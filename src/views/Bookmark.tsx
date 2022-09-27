import { useLocation, useMatch } from '@tanstack/react-location';
import { useEffect, useState } from 'react';
import Spinner from '../components/Spinner';
import { useBookmarks } from '../context/bookmarksContext';
import { useSongs } from '../context/songContext';
import { Bookmark as BookmarkType } from '../definitions/bookmarks';
import { Song } from '../definitions/songs';
import Trash from '../icons/Trash';

export default function Bookmark(): JSX.Element {
	const {
		params: { bookmarkId },
	} = useMatch();
	const location = useLocation();
	const { bookmarks, deleteBookmark, updateBookmark } = useBookmarks();
	const { songCollection } = useSongs();
	const [bookmark, setBookmark] = useState<BookmarkType | null>();
	const [bookmarkName, setBookmarkName] = useState<BookmarkType['name']>('');
	const [bookmarkSongs, setBookmarkSongs] = useState<Song[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [edited, setEdited] = useState<boolean>(false);

	useEffect(() => {
		if (bookmarks) setBookmark(bookmarks[bookmarkId] ?? null);
		setEdited(false);
	}, [bookmarks]);

	useEffect(() => {
		if (bookmark === undefined || songCollection === undefined) return;
		if (bookmark === null) return setLoading(false);

		setBookmarkName(bookmark.name);
		setBookmarkSongs(bookmark.songs.map((songId) => songCollection[songId]));
		setLoading(false);
	}, [bookmark, songCollection]);

	useEffect(() => {
		if (bookmark?.name === bookmarkName && bookmark?.songs.length === bookmarkSongs.length)
			return setEdited(false);
		setEdited(true);
	}, [bookmarkName, bookmarkSongs]);

	function onDelete(): void {
		if (!confirm('Are you sure you want to delete this bookmark?')) return;
		deleteBookmark(bookmarkId);
		location.history.push('/bookmarks');
	}

	return (
		<main className="Bookmark">
			{loading ? (
				<Spinner />
			) : bookmark !== null ? (
				<>
					<div className="top-row" style={{ marginTop: '0.5rem' }}>
						<input value={bookmarkName} onChange={(e) => setBookmarkName(e.target.value)} />
						<button onClick={onDelete} style={{ color: '#dd3d0d' }}>
							<Trash />
						</button>
					</div>
					<ul>
						{bookmarkSongs.map((song) => (
							<li className="list-item width-full" key={song.id}>
								<div className="flex-row space-between items-center">
									<h1>{song.title}</h1>
									<button
										onClick={() => {
											setBookmarkSongs(bookmarkSongs.filter(({ id }) => id !== song.id));
										}}
									>
										<Trash />
									</button>
								</div>
							</li>
						))}
					</ul>

					<div className="bottom-row">
						<button style={{ color: 'red' }} onClick={() => location.history.push('/bookmarks')}>
							Cancel
						</button>
						<button
							disabled={!edited}
							style={{ color: 'green' }}
							onClick={() => {
								updateBookmark(bookmarkId, {
									name: bookmarkName,
									songs: bookmarkSongs.map((song) => song.id),
								});
								location.history.push('/bookmarks');
							}}
						>
							Confirm
						</button>
					</div>
				</>
			) : (
				<h1>Couldn't find the bookmark</h1>
			)}
		</main>
	);
}
