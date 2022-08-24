import { useMatch } from '@tanstack/react-location';
import ReactMarkdown from 'react-markdown';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import TagBadge from '../components/TagBadge';
import { useSongs } from '../context/songContext';
// import AddToBookmark from '../icons/AddToBookmark';
import LinkTo from '../icons/LinkTo';

export default function SongDetails(): JSX.Element {
	const { songCollection, loading } = useSongs();
	const {
		params: { songId },
	} = useMatch();
	const song = songCollection?.[songId];

	function writeLinkToClipboard() {
		if (song)
			navigator.clipboard
				.writeText(`${window.location.origin}/s/${song.id}`)
				.then(() => toast.success('Copied!'));
	}

	return (
		<main className="Song">
			{loading ? (
				<Spinner />
			) : song ? (
				<>
					<div className="flex-row space-between items-start">
						<h1>{song.title}</h1>
						<div className="flex-row">
							<button className="action" onClick={writeLinkToClipboard}>
								<LinkTo />
							</button>
							{/* <button className="action">
								<AddToBookmark />
							</button> */}
						</div>
					</div>
					<div>
						{song.author && <h3>By: {song.author}</h3>}
						{song.melody && (
							<h3>
								Melody: {song.melody} {song.composer && `(${song.composer})`}
							</h3>
						)}
					</div>
					<div className="tag-row">
						{song.tags.map((tag) => (
							<TagBadge tag={tag} key={tag} />
						))}
					</div>

					<div className="song-content">
						<ReactMarkdown components={{ h1: ({ children }) => <h2>{children}</h2> }}>
							{song.content || ''}
						</ReactMarkdown>
					</div>
				</>
			) : (
				<h2 className="self-center" style={{ textAlign: 'center' }}>
					{"Couldn't find the song you were looking for :("}
				</h2>
			)}
		</main>
	);
}
