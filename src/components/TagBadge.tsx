import React from 'react';
import { Tag, TAG_NAMES } from '../definitions/tag';

const tagColors: Record<Tag, { foreground: string; background: string; border?: string }> = {
	gasque: { foreground: '#403050', background: '#cc99ff' },
	beer: { foreground: '#7a3c01', background: '#D97a19' },
	wine: { foreground: '#6b0612', background: '#ff3d4d' },
	snaps: { foreground: '#f04816', background: '#efb850' },
	punsch: { foreground: '#ca9e01', background: '#f7f143' },
	foreign: { foreground: '#333333', background: '#dee2ee' },
	nerdy: { foreground: '#100a87', background: '#85f27c', border: '#c9123a' },
	esoteric: { foreground: '#44687D', background: '#91cae3' },
	solemn: { foreground: '#660ac2', background: '#84f5ea' },
	swe: { foreground: '#004b87', background: '#ffcd00' },
	eng: { foreground: '#00216e', background: '#fa7d7a' },
};

type TagBadgeProps = {
	tag: Tag;
};

export default function TagBadge({ tag }: TagBadgeProps): React.ReactElement {
	const { foreground, background, border } = tagColors[tag];
	return (
		<span
			className="TagBadge"
			style={{ color: foreground, borderColor: border || foreground, backgroundColor: background }}
		>
			{TAG_NAMES[tag].toUpperCase()}
		</span>
	);
}
