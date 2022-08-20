import { useState, useEffect } from 'react';
import Moon from '../icons/Moon';
import Sun from '../icons/Sun';
import { detectColorScheme, switchTheme } from '../util/colorScheme';

const ColorSchemeToggle = () => {
	const [dark, setDark] = useState<boolean>();

	useEffect(() => {
		setDark(detectColorScheme());
	}, []);

	const handleClick = (): void => {
		setDark((_prev) => !_prev);
		switchTheme(dark!);
	};

	return <button onClick={handleClick}>{dark ? <Sun /> : <Moon />}</button>;
};

export default ColorSchemeToggle;
