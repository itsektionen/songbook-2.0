export async function copyText(text: string): Promise<boolean> {
	if (navigator.clipboard?.writeText && window.isSecureContext) {
		await navigator.clipboard.writeText(text);
		return true;
	}

	const textArea = document.createElement('textarea');
	textArea.value = text;
	textArea.setAttribute('readonly', '');
	textArea.style.position = 'fixed';
	textArea.style.opacity = '0';
	textArea.style.left = '-9999px';
	document.body.appendChild(textArea);

	textArea.focus();
	textArea.select();
	textArea.setSelectionRange(0, text.length);

	let copied = false;
	try {
		copied = document.execCommand('copy');
	} catch {
		copied = false;
	}

	document.body.removeChild(textArea);

	if (copied) return true;

	window.prompt('Copy this link', text);
	return false;
}
