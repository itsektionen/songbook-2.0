import { Song } from '../definitions/songs';

const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_-';
const BASE = ALPHABET.length;
const ALPHABET_REGEX = /^[\dA-Za-z_\-]+$/;

export function parseBase64Ids(songIds: string): { ids: number[]; error?: string } {
	if (!songIds.length || songIds.length % 2 !== 0 || !songIds.match(ALPHABET_REGEX))
		return { ids: [], error: 'Invalid b64 id string' };
	const ids = songIds
		.match(/.{2}/g)!
		.map(([higher, lower]) => ALPHABET.indexOf(higher) * 64 + ALPHABET.indexOf(lower));

	return { ids };
}

export function generateBase64Id(songId: Song['id']): string {
	const lowNumber = songId % BASE;
	const highNumber = (songId - lowNumber) / BASE;

	return ALPHABET.charAt(highNumber) + ALPHABET.charAt(lowNumber);
}
