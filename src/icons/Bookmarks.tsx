import Icon, { IconProps } from './Icon';

export default function Lists(props: IconProps): JSX.Element {
	return (
		<Icon {...props}>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="1em" height="1em">
				<path
					d="M448 336v-288C448 21.49 426.5 0 400 0H352v191.1c0 13.41-15.52 20.88-25.1 12.49L272 160L217.1 204.5C207.5 212.8 192 205.4 192 191.1V0H96C42.98 0 0 42.98 0 96v320c0 53.02 42.98 96 96 96h320c17.67 0 32-14.33 32-32c0-11.72-6.607-21.52-16-27.1v-81.36C441.8 362.8 448 350.2 448 336zM384 448H96c-17.67 0-32-14.33-32-32c0-17.67 14.33-32 32-32h288V448z"
					fill="currentColor"
				/>
			</svg>
		</Icon>
	);
}
