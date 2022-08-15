import { nanoid } from 'nanoid';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Bookmark } from '../definitions/bookmarks';
import { Song } from '../definitions/songs';

const LS_BOOKMARKS_KEY = 'in-songbook:bookmarks';

const BookmarksContext = createContext<{
	bookmarks: Record<Bookmark['id'], Bookmark>;
	setBookmarks: (value: Record<Bookmark['id'], Bookmark>) => void;
	createBookmark: (name: string, song?: Song['id']) => void;
	addSongToBookmark: (bookmarkId: Bookmark['id'], songId: Song['id']) => void;
	removeSongFromBookmark: (bookmarkId: Bookmark['id'], songId: Song['id']) => void;
}>({
	bookmarks: {},
	setBookmarks: () => {},
	createBookmark: () => {},
	addSongToBookmark: () => {},
	removeSongFromBookmark: () => {},
});

export const useBookmarks = () => useContext(BookmarksContext);

function newBookmark(name: string, id: string = nanoid(10)): Bookmark {
	return { id, name, songs: [] };
}

export function BookmarksProvider({ children }: { children: ReactNode }): JSX.Element {
	const [bookmarks, setBookmarks] = useState<Record<Bookmark['id'], Bookmark>>({});

	useEffect(() => {
		const ls = localStorage.getItem(LS_BOOKMARKS_KEY);
		if (ls) setBookmarks(JSON.parse(ls));
		else {
			const favorites = newBookmark('Favorites');
			localStorage.setItem(LS_BOOKMARKS_KEY, JSON.stringify({ [favorites.id]: favorites }));
			setBookmarks({ [favorites.id]: favorites });
		}
	}, []);

	function updateBookmarks(value: Record<Bookmark['id'], Bookmark>): void {
		setBookmarks(value);
		localStorage.setItem(LS_BOOKMARKS_KEY, JSON.stringify(value));
	}

	function createBookmark(name: string, song?: Song['id']): void {
		const bookmark = newBookmark(name);
		if (song) bookmark.songs = [song];
		updateBookmarks({ ...bookmarks, [bookmark.id]: bookmark });
	}

	function addSongToBookmark(bookmarkId: Bookmark['id'], songId: Song['id']): void {
		const bookmark = bookmarks[bookmarkId];
		if (!bookmark || bookmark.songs.includes(songId)) return;

		bookmark.songs.push(songId);
		updateBookmarks({ ...bookmarks, [bookmarkId]: bookmark });
	}

	function removeSongFromBookmark(bookmarkId: Bookmark['id'], songId: Song['id']): void {
		const bookmark = bookmarks[bookmarkId];
		if (!bookmark || !bookmark.songs.includes(songId)) return;

		bookmark.songs = bookmark.songs.filter((bookmarkSongId) => bookmarkSongId !== songId);
		updateBookmarks({ ...bookmarks, [bookmarkId]: bookmark });
	}

	return (
		<BookmarksContext.Provider
			value={{
				bookmarks,
				setBookmarks: updateBookmarks,
				createBookmark,
				addSongToBookmark,
				removeSongFromBookmark,
			}}
		>
			{children}
		</BookmarksContext.Provider>
	);
}
