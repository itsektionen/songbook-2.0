import React from 'react';
import { Link } from '@tanstack/react-location';
import { Song } from '../definitions/songs';
import TagBadge from './TagBadge';

type SongItemProps = {
	song: Song;
	from?: 'home' | 'list';
};

export default function SongItem({ song, from }: SongItemProps): React.ReactElement {
	return (
		<Link to={`/s/${song.id}`} search={from && { from }} className="SongListItem">
			<li>
				<div>
					<div className="flex-row space-between items-center">
						<h1>{song.title}</h1>
						<div className="flex-row gap-sm">
							{song.tags.map((tag) => (
								<TagBadge tag={tag} key={tag} />
							))}
							{/* {TAGS.map((tag) => (
								<TagBadge tag={tag} key={tag} />
							))} */}
						</div>
					</div>
					<p>
						{song.content
							.split('\n\n')
							.filter((paragraph) => !paragraph.startsWith('> ') && !paragraph.startsWith('# '))
							.join('\n')}
					</p>
				</div>
			</li>
		</Link>
	);
}
