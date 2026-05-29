import React from 'react';
import { Tag, TAG_NAMES } from '../definitions/tag';

const tagColors: Record<Tag, { foreground: string; background: string; border: string }> = {
	gasque: { foreground: '#4a2d7a', background: '#cc99ff', border: '#a366ff' },
	beer: { foreground: '#402305', background: '#d97a19', border: '#b5630f' },
	wine: { foreground: '#49040c', background: '#ff3d4d', border: '#e21f30' },
	snaps: { foreground: '#370e02', background: '#f04816', border: '#d13708' },
	punsch: { foreground: '#6b6800', background: '#f7f143', border: '#d6cf1f' },
	foreign: { foreground: '#3a4252', background: '#dee2ee', border: '#b9c0d2' },
	nerdy: { foreground: '#14591a', background: '#85f27c', border: '#4fce4a' },
	esoteric: { foreground: '#1d4a63', background: '#91cae3', border: '#5fa6c8' },
	solemn: { foreground: '#105c54', background: '#84f5ea', border: '#45cdc0' },
	swe: { foreground: '#004b87', background: '#ffcd00', border: '#d9ac00' },
	eng: { foreground: '#00216e', background: '#fa7d7a', border: '#ef4f4b' },
};

type TagBadgeProps = {
	tag: Tag;
};

export default function TagBadge({ tag }: TagBadgeProps): React.ReactElement {
	const { foreground, background, border } = tagColors[tag];
	return (
		<span
			className="TagBadge"
			style={{ color: foreground, borderColor: border, backgroundColor: background }}
		>
			{TAG_NAMES[tag].toUpperCase()}
		</span>
	);
}
