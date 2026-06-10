import { Song } from '../definitions/songs';
import { generateBase64Id } from './base64Ids';

export function getSharedListPath(songIds: Song['id'][]): string {
	return `/l/${songIds.map((songId) => generateBase64Id(songId)).join('')}`;
}

export function getSharedListUrl(
	songIds: Song['id'][],
	name: string,
	origin: string = window.location.origin,
): string {
	return `${origin}${getSharedListPath(songIds)}?name=${encodeURIComponent(name)}`;
}
