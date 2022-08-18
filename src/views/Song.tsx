import { useLocation, useMatch } from '@tanstack/react-location';
import ReactMarkdown from 'react-markdown';
import { toast } from 'react-toastify';
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
			{loading && <h2>Loading...</h2>}
			{song ? (
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
							{song.content || '# Could not find the song'}
						</ReactMarkdown>
					</div>
				</>
			) : (
				<h2>Loading...</h2>
			)}
		</main>
	);
}
