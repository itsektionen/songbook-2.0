import { useMatch } from '@tanstack/react-location';
import Fuse from 'fuse.js';
import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import Actions from '../components/Actions';
import ListShareActions from '../components/ListShareActions';
import SongListItem from '../components/SongListItem';
import Spinner from '../components/Spinner';
import { useBookmarks } from '../context/bookmarksContext';
import { useSearch } from '../context/searchContext';
import { useSongs } from '../context/songContext';
import { Song } from '../definitions/songs';

const normalize = (s: string) =>
	s
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '')
		.replace(/[^\p{L}\p{N}]/gu, '')
		.toLowerCase();

const songTitles = (song: Song) => [song.title, ...(song.alternativeTitles ?? [])];

export default function SongList(): React.ReactElement {
	const { data, search: searchParams } = useMatch();
	const { ids: songIds } = data as { ids?: number[] };
	const { name } = searchParams as { name?: string };
	const { songs, songCollection, loading: loadingSongs } = useSongs();
	const { bookmarks, createBookmark } = useBookmarks();
	const { search, filter } = useSearch();

	const [baseSongs, setBaseSongs] = useState<Song[]>();
	const [displaySongs, setDisplaySongs] = useState<Song[]>();
	const [loading, setLoading] = useState<boolean>(true);

	const isFilteredList = !!songIds;
	const listName = name || 'Imported list';
	const localListAlreadySaved = !!(
		isFilteredList &&
		bookmarks &&
		Object.values(bookmarks).find(
			(bookmark) =>
				bookmark.name === listName &&
				bookmark.songs.length === (songIds?.length ?? 0) &&
				bookmark.songs.every((songId, index) => songId === songIds?.[index]),
		)
	);

	const fuse = useMemo(() => {
		if (!baseSongs) return null;
		const titleIndex = baseSongs.map((song) => ({
			song,
			titles: songTitles(song).map(normalize),
		}));
		return new Fuse(titleIndex, {
			keys: ['titles'],
			threshold: 0.35,
			ignoreLocation: true,
		});
	}, [baseSongs]);

	useEffect(() => {
		if (!songs) return;
		if (!isFilteredList) return setBaseSongs(songs);

		const listSongs: Song[] = [];
		const uniqueness: Record<number, true> = {};
		songIds.forEach((id) => {
			if (songCollection?.[id] && !uniqueness[id]) {
				listSongs.push(songCollection[id]);
				uniqueness[id] = true;
			}
		});
		setBaseSongs(listSongs);
	}, [songs, songCollection, songIds]);

	useEffect(() => {
		if (!baseSongs) return;
		const normalizedSearch = normalize(search);
		if (!normalizedSearch && !filter.length) return setDisplaySongs(baseSongs);

		const tagFiltered = filter.length
			? baseSongs.filter((song) => filter.every((tag) => song.tags.includes(tag)))
			: baseSongs;

		if (!normalizedSearch) return setDisplaySongs(tagFiltered);

		const tagFilteredIds = new Set(tagFiltered.map((s) => s.id));

		const titleSubstringHits = tagFiltered.filter((song) =>
			songTitles(song).some((title) => normalize(title).includes(normalizedSearch)),
		);

		const titleFuzzyHits = (fuse?.search(normalizedSearch) ?? [])
			.map((result) => result.item.song)
			.filter((song) => tagFilteredIds.has(song.id));

		const contentHits = tagFiltered.filter((song) =>
			normalize(song.content).includes(normalizedSearch),
		);

		const seen = new Set<number>();
		const merged: Song[] = [];
		for (const song of [...titleSubstringHits, ...titleFuzzyHits, ...contentHits]) {
			if (!seen.has(song.id)) {
				seen.add(song.id);
				merged.push(song);
			}
		}

		setDisplaySongs(merged);
	}, [baseSongs, fuse, search, filter]);

	useEffect(() => {
		setLoading(loadingSongs || !songs || !baseSongs || !displaySongs);
	}, [songs, baseSongs, displaySongs, loadingSongs]);

	function noSongsString(): string {
		if (!songs?.length) return 'Could not find any songs :(';
		if (isFilteredList && songIds.length >= 0) return 'There are no songs in this list :(';
		if (!baseSongs?.length) return "Couldn't find any songs with the IDs from the list :(";
		if (!displaySongs?.length) {
			const params: string[] = [];
			if (search) params.push('search');
			if (filter.length) params.push('filter');
			return `Couldn't find any songs matching your ${params.join(' and ')} :/`;
		}

		return 'Something went wrong :/';
	}

	function saveImportedList() {
		if (!isFilteredList || !songIds || localListAlreadySaved) return;

		createBookmark(listName, songIds);
		toast.success('List saved');
	}

	return (
		<main className="SongList">
			{isFilteredList && (
				<div className="top-row">
					<h1>{listName}</h1>
					{localListAlreadySaved ? (
						<Actions>
							<ListShareActions name={listName} songIds={songIds ?? []} />
						</Actions>
					) : (
						<button
							className="save-button"
							onClick={saveImportedList}
							disabled={!bookmarks}
							style={{ color: 'rgb(var(--confirm))' }}
						>
							Save
						</button>
					)}
				</div>
			)}
			{loading ? (
				<Spinner />
			) : displaySongs?.length ? (
				<ul>
					{displaySongs.map((song) => (
						<SongListItem song={song} from={isFilteredList ? 'list' : 'home'} key={song.id} />
					))}
				</ul>
			) : (
				<h2 className="no-songs">{noSongsString()}</h2>
			)}
		</main>
	);
}
