import { useMatch } from '@tanstack/react-location';
import { useEffect, useState } from 'react';
import SongListItem from '../components/SongListItem';
import Spinner from '../components/Spinner';
import { useSearch } from '../context/searchContext';
import { useSongs } from '../context/songContext';
import { Song } from '../definitions/songs';

export default function SongList(): JSX.Element {
	const { data, search: searchParams } = useMatch();
	const { ids: songIds } = data as { ids?: number[] };
	const { name } = searchParams as { name?: string };
	const { songs, songCollection, loading: loadingSongs } = useSongs();
	const { search, filter } = useSearch();

	const [baseSongs, setBaseSongs] = useState<Song[]>();
	const [displaySongs, setDisplaySongs] = useState<Song[]>();
	const [loading, setLoading] = useState<boolean>(true);

	const isFilteredList = !!songIds;

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
		if (!search && !filter.length) return setDisplaySongs(baseSongs);

		const normalizedSearch = search.normalize('NFD').toLowerCase();
		const filteredSongs: Song[] = [];
		baseSongs?.forEach((song) => {
			if (filter.length && !filter.every((tag) => song.tags.includes(tag))) return;
			if (song.title.normalize('NFD').toLowerCase().includes(normalizedSearch))
				return filteredSongs.push(song);
			if (song.content.normalize('NFD').toLowerCase().includes(normalizedSearch))
				return filteredSongs.push(song);
		});

		setDisplaySongs(filteredSongs);
	}, [baseSongs, search, filter]);

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

	return (
		<main className="SongList">
			{isFilteredList && name && <h1>{name}</h1>}
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
