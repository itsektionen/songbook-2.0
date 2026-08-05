import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import MusicNote from '../icons/MusicNote';
import Spin from '../icons/Spin';
import Stop from '../icons/Stop';

type Player = {
	prime: () => Promise<void>;
	start: () => void;
	stop: () => void;
	seek: (seconds: number) => void;
	duration: number;
};

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
	if (!audioContext) {
		const Context =
			window.AudioContext ??
			(window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
		if (Context) audioContext = new Context();
	}
	return audioContext;
}

// Audio unlocks only with a user gesture, and the gesture expires across awaits
// (notably on iOS): https://developer.mozilla.org/en-US/docs/Glossary/Transient_activation
function unlockAudioContext(): void {
	void getAudioContext()?.resume();
}

async function createPlayer(abc: string): Promise<Player> {
	const abcjs = (await import('abcjs')).default;

	const ac = getAudioContext();
	if (ac) abcjs.synth.registerAudioContext(ac);
	if (!abcjs.synth.supportsAudio()) {
		throw new Error('Audio playback is not supported in this browser.');
	}

	const visualObj = abcjs.renderAbc('*', abc)[0];
	visualObj.setTiming();

	const synth = new abcjs.synth.CreateSynth();
	await synth.init({
		visualObj,
		audioContext: ac ?? undefined,
		options: {
			soundFontUrl: '/soundfonts/',
			soundFontVolumeMultiplier: 3.0,
			chordsOff: true,
		},
	});

	// prime() is the buffering part, start() makes melody start playing.
	// Split up so play() can bail in between if we unmounted mid-load.
	let primed = false;
	const player: Player = {
		duration: visualObj.getTotalTime() || 0,
		prime: async () => {
			if (!primed) {
				player.duration = (await synth.prime()).duration;
				primed = true;
			}
			await abcjs.synth.activeAudioContext().resume();
		},
		start: () => synth.start(),
		stop: () => {
			try {
				synth.stop();
			} catch {
				/* not started */
			}
		},
		seek: (seconds) => {
			if (primed) synth.seek(seconds, 'seconds');
		},
	};
	return player;
}

type State = 'idle' | 'loading' | 'playing';

export default function MelodyPlayer({ abc }: { abc: string }): React.ReactElement {
	const [state, setState] = useState<State>('idle');
	const [progress, setProgress] = useState(0);
	const [duration, setDuration] = useState(0);
	const playerRef = useRef<Player | null>(null);
	const playerPromiseRef = useRef<Promise<Player> | null>(null);
	const startRef = useRef({ offset: 0, time: 0 });
	const tickTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const isMountedRef = useRef(true);
	const progressRef = useRef(0);

	function loadPlayer(): Promise<Player> {
		if (!playerPromiseRef.current) {
			playerPromiseRef.current = createPlayer(abc).then((player) => {
				playerRef.current = player;
				if (isMountedRef.current) setDuration(player.duration);
				return player;
			});
			playerPromiseRef.current.catch(() => (playerPromiseRef.current = null));
		}
		return playerPromiseRef.current;
	}

	useEffect(() => {
		isMountedRef.current = true;
		loadPlayer().catch(() => {});
		return () => {
			isMountedRef.current = false;
			clearTickTimer();
			playerRef.current?.stop();
		};
	}, []);

	function clearTickTimer() {
		if (tickTimerRef.current) {
			clearInterval(tickTimerRef.current);
			tickTimerRef.current = null;
		}
	}

	function stop() {
		clearTickTimer();
		playerRef.current?.stop();
		progressRef.current = 0;
		setProgress(0);
		setState('idle');
	}

	function clockNow(): number {
		const ac = getAudioContext();
		return ac ? ac.currentTime : performance.now() / 1000;
	}

	function startClock(offset: number) {
		startRef.current = { offset, time: clockNow() };
		clearTickTimer();
		tickTimerRef.current = setInterval(() => {
			const total = playerRef.current?.duration ?? 0;
			const position = startRef.current.offset + (clockNow() - startRef.current.time);
			if (total > 0 && position >= total) stop();
			else {
				progressRef.current = position;
				setProgress(position);
			}
		}, 250);
	}

	async function play() {
		unlockAudioContext();
		setState('loading');
		try {
			const player = await loadPlayer();
			if (!isMountedRef.current) {
				return;
			}
			await player.prime();
			if (!isMountedRef.current) {
				return;
			}
			const offset = progressRef.current;
			if (offset > 0) {
				player.seek(offset);
			}
			player.start();
			setDuration(player.duration);
			setState('playing');
			startClock(offset);
		} catch {
			if (!isMountedRef.current) return;
			toast.error('Could not play the melody');
			setState('idle');
		}
	}

	function seek(seconds: number) {
		progressRef.current = seconds;
		setProgress(seconds);
		playerRef.current?.seek(seconds);
		if (state === 'playing') startClock(seconds);
	}

	const isPlaying = state === 'playing';
	const icon = {
		loading: <Spin className="loading-spinner" size="sm" />,
		playing: <Stop size="sm" />,
		idle: <MusicNote size="md" />,
	}[state];

	return (
		<div className="melody-player gap-lg">
			<button
				onClick={isPlaying ? stop : play}
				disabled={state === 'loading'}
				aria-label={isPlaying ? 'Stop melody' : 'Play melody'}
			>
				{icon}
			</button>
			<input
				type="range"
				aria-label="Melody progress"
				min={0}
				max={duration || 1}
				step={0.1}
				value={progress}
				disabled={!duration}
				onChange={(e) => seek(Number(e.target.value))}
			/>
			<span className="time">
				{Math.floor(progress)}s / {duration ? `${Math.round(duration)}s` : '–'}
			</span>
		</div>
	);
}
