import { HTMLAttributes } from 'react';

export type IconProps = {
	size?: 'sm' | 'md' | 'lg';
	className?: string;
	style?: HTMLAttributes<HTMLDivElement>['style'];
};

export default function Icon({
	size = 'md',
	className,
	style,
	children,
}: IconProps & { children: JSX.Element }): JSX.Element {
	const iconSize = size === 'lg' ? 'icon-lg' : size === 'sm' ? 'icon-sm' : 'icon-md';

	return (
		<div className={`line-0 ${iconSize} ${className || ''}`} style={style}>
			{children}
		</div>
	);
}
