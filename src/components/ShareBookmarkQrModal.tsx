import QRCodeStyling from 'qr-code-styling';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { copyText } from '../util/copyText';
import { toRgb } from '../util/toRgb';
import Modal, { ModalButtonGroup, ModalProps } from './Modal';

type ShareBookmarkQrModalProps = Omit<ModalProps, 'children' | 'innerClassName'> & {
	url: string;
	name: string;
	logoUrl?: string;
};

export default function ShareBookmarkQrModal({
	isOpen,
	onClose,
	url,
	name,
	logoUrl,
}: ShareBookmarkQrModalProps): React.ReactElement {
	const qrContainerRef = useRef<HTMLDivElement>(null);
	const qrFullscreenRef = useRef<HTMLDivElement>(null);
	const qrCodeRef = useRef<QRCodeStyling | null>(null);
	const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
	const downloadName = `songbook-list-${
		name
			.trim()
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/(^-|-$)/g, '') || 'qr'
	}`;

	useEffect(() => {
		if (!isOpen || !qrContainerRef.current) return;

		const foreground = toRgb('--primary-dark', '0, 0, 0');
		const background = toRgb('--background', '255, 0, 255');

		if (!qrCodeRef.current) {
			qrCodeRef.current = new QRCodeStyling({
				width: 260,
				height: 260,
				type: 'svg',
				data: url,
				image: logoUrl,
				qrOptions: { errorCorrectionLevel: 'Q' },
				dotsOptions: { type: 'square', color: foreground },
				backgroundOptions: { color: background },
				cornersSquareOptions: { type: 'square', color: foreground },
				cornersDotOptions: { type: 'square', color: foreground },
				imageOptions: { crossOrigin: 'anonymous', margin: 6 },
			});
		}

		qrCodeRef.current.update({
			data: url,
			image: logoUrl,
			dotsOptions: { color: foreground },
			backgroundOptions: { color: background },
			cornersSquareOptions: { color: foreground },
			cornersDotOptions: { color: foreground },
		});

		qrContainerRef.current.innerHTML = '';
		qrCodeRef.current.append(qrContainerRef.current);
	}, [isOpen, url, logoUrl]);

	useEffect(() => {
		function onFullscreenChange() {
			setIsFullscreen(document.fullscreenElement === qrFullscreenRef.current);
		}

		document.addEventListener('fullscreenchange', onFullscreenChange);
		return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
	}, []);

	function toggleFullscreen() {
		if (!qrFullscreenRef.current) return;

		if (document.fullscreenElement === qrFullscreenRef.current) {
			document.exitFullscreen().catch(() => toast.error('Could not exit fullscreen'));
			return;
		}

		qrFullscreenRef.current
			.requestFullscreen()
			.catch(() => toast.error('Fullscreen is not available on this device/browser'));
	}

	return (
		<Modal isOpen={isOpen} onClose={onClose} innerClassName="ShareBookmarkQrModal">
			<h1>Share list by QR</h1>
			<h2>{name}</h2>
			<div className="qr-wrapper" ref={qrFullscreenRef} onClick={toggleFullscreen}>
				<div className="qr-code" ref={qrContainerRef} />
			</div>
			<p className="qr-url">{url}</p>
			<ModalButtonGroup>
				<button
					onClick={() =>
						copyText(url).then((copied) => {
							if (copied) toast.success('Copied!');
							else toast.info('Long-press and copy the link');
						})
					}
					style={{ color: 'rgb(var(--reset))' }}
				>
					Copy link
				</button>
				<button
					onClick={() =>
						qrCodeRef.current
							?.download({ name: downloadName, extension: 'svg' })
							.then(() => toast.success('Downloaded!'))
					}
					style={{ color: 'rgb(var(--primary-dark))' }}
				>
					Download image
				</button>
			</ModalButtonGroup>
			<p
				className="fullscreen-action"
				onClick={toggleFullscreen}
				onKeyDown={(event) => {
					if (event.key !== 'Enter' && event.key !== ' ') return;
					event.preventDefault();
					toggleFullscreen();
				}}
				role="button"
				tabIndex={0}
			>
				{isFullscreen ? 'Exit fullscreen' : 'Show fullscreen QR'}
			</p>
			<p className="hint">Click the QR image to toggle fullscreen</p>
		</Modal>
	);
}
