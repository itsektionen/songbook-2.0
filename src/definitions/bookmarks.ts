import { Song } from './songs';

export type Bookmark = {
	id: string;
	name: string;
	songs: Song['id'][];
};
