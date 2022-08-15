import { Tag } from './tag';

export type Song = {
	id: number;
	title: string;
	author?: string;
	melody?: string;
	composer?: string;
	tags: Tag[];
	sorting?: number;
	deleted?: true;
	content: string;
};

export type SongCollection = { [id: string | number]: Song };

export type SongsWithMeta = {
	songs: Song[];
	updatedAt: string;
};

export const SONGS_JSON_URL =
	'https://raw.githubusercontent.com/insektionen/songlist/master/dist/songs.json';
