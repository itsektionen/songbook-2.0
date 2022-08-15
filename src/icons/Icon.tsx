export type IconProps = {
	size?: 'sm' | 'md' | 'lg';
	className?: string;
};

export default function Icon({
	size = 'md',
	className,
	children,
}: IconProps & { children: JSX.Element }): JSX.Element {
	const iconSize = size === 'lg' ? 'icon-lg' : size === 'sm' ? 'icon-sm' : 'icon-md';

	return <div className={`line-0 ${iconSize} ${className || ''}`}>{children}</div>;
}
