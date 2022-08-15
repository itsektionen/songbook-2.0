import { Tag } from '../definitions/tag';

const tagMap: Record<
	Tag,
	{ name: string; foreground: string; background: string; border?: string }
> = {
	gasque: { name: 'GASQUE', foreground: '#44687D', background: '#81BED9' },
	beer: { name: 'BEER', foreground: '#7a3c01', background: '#D97a19' },
	wine: { name: 'WINE', foreground: '#6b0612', background: '#ff3d4d' },
	snaps: { name: 'NUBBE', foreground: '#f04816', background: '#efb850' },
	punsch: { name: 'PUNSCH', foreground: '#ca9e01', background: '#f7f143' },
	foreign: { name: 'FOREIGN', foreground: '#333333', background: '#dee2ee' },
	nerdy: { name: 'NERDY', foreground: '#100a87', background: '#85f27c', border: '#c9123a' },
	esoteric: { name: 'ESOTERIC', foreground: '#6d1380', background: '#f179f7' },
	solemn: { name: 'SOLEMN', foreground: '#660ac2', background: '#84f5ea' },
	swe: { name: 'SWEDISH', foreground: '#004b87', background: '#ffcd00' },
	eng: { name: 'ENGLISH', foreground: '#00216e', background: '#fa7d7a' },
};

type TagBadgeProps = {
	tag: Tag;
};

export default function TagBadge({ tag }: TagBadgeProps): JSX.Element {
	const { name, foreground, background, border } = tagMap[tag];
	return (
		<span
			className="TagBadge"
			style={{ color: foreground, borderColor: border || foreground, backgroundColor: background }}
		>
			{name}
		</span>
	);
}
