import React from 'react';
import Icon, { IconProps } from './Icon';

export default function QrCode(props: IconProps): React.ReactElement {
	return (
		<Icon {...props}>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em">
				<path
					fill="currentColor"
					d="M3 3h7v7H3V3zm2 2v3h3V5H5zm9-2h7v7h-7V3zm2 2v3h3V5h-3zM3 14h7v7H3v-7zm2 2v3h3v-3H5zm10-2h2v2h-2v-2zm-2 2h2v2h-2v-2zm4 0h2v2h-2v-2zm-4 4h2v2h-2v-2zm4 0h4v2h-4v-2zm2-4h2v2h-2v-2z"
				/>
			</svg>
		</Icon>
	);
}
