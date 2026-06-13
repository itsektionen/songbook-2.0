import React from 'react';
import Icon, { IconProps } from './Icon';

export default function Check(props: IconProps): React.ReactElement {
	return (
		<Icon {...props}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				width="1em"
				height="1em"
				aria-hidden="true"
			>
				<path
					d="M5 12.5l4.5 4.5L19 7"
					fill="none"
					stroke="currentColor"
					strokeWidth="3"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		</Icon>
	);
}
