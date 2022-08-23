import { Link, useMatch } from '@tanstack/react-location';
import { useEffect, useState } from 'react';
import SongListItem from '../components/SongListItem';
import Spinner from '../components/Spinner';
import { useSearch } from '../context/searchContext';
import { useSongs } from '../context/songContext';
import { Song } from '../definitions/songs';

export default function SongList(): JSX.Element {
	const { data, search: searchParams } = useMatch();
	const { ids: songIds } = data as { ids?: number[]; error?: string };
	const { name } = searchParams as { name?: string };
	const { songs, loading } = useSongs();
	const [baseSongs, setBaseSongs] = useState<Song[]>([]);
	const [displaySongs, setDisplaySongs] = useState<Song[]>([]);
	const { search, filter } = useSearch();

	const isFilteredList = !!songIds;

	useEffect(() => {
		if (songs)
			setBaseSongs(isFilteredList ? songs.filter((song) => songIds.includes(song.id)) : songs);
		else setBaseSongs([]);
	}, [songs, songIds]);

	useEffect(() => {
		setDisplaySongs(baseSongs);
	}, [baseSongs]);

	useEffect(() => {
		const normalizedSearch = search.normalize('NFD').toLowerCase();
		const filteredSongs: Song[] = [];
		baseSongs.forEach((song) => {
			if (filter.length && !filter.every((tag) => song.tags.includes(tag))) return;
			if (song.title.normalize('NFD').toLowerCase().includes(normalizedSearch))
				return filteredSongs.push(song);
			if (song.content.normalize('NFD').toLowerCase().includes(normalizedSearch))
				return filteredSongs.push(song);
		});

		setDisplaySongs(filteredSongs);
	}, [baseSongs, search, filter]);

	return (
		<main className="SongList">
			{isFilteredList && name && <h1>{name}</h1>}
			{loading && <Spinner />}
			{displaySongs.length > 0 && (
				<ul>
					{displaySongs.map((song) => (
						<SongListItem song={song} from={isFilteredList ? 'list' : 'home'} key={song.id} />
					))}
				</ul>
			)}
		</main>
	);
}
