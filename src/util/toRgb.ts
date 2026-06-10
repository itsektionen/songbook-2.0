export function toRgb(cssVar: string, fallback: string): string {
	const value = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
	return `rgb(${value || fallback})`;
}
