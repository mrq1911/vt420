/** The tab's icon: a VT420 on its stand, a prompt and the cursor lit in the phosphor's colour. */
export function faviconSvg([r, g, b]: readonly [number, number, number]): string {
	const ink = `rgb(${r} ${g} ${b})`;
	return [
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">`,
		`<rect x="0.5" y="1" width="15" height="11.5" rx="2" fill="#3b3a35"/>`,
		`<rect x="2" y="2.5" width="12" height="8.5" rx="1" fill="#050607"/>`,
		`<path d="M4 4.5 6 6.5 4 8.5" fill="none" stroke="${ink}" stroke-width="1.3"/>`,
		`<rect x="7.5" y="7.5" width="3" height="1.5" fill="${ink}"/>`,
		`<rect x="6" y="12.5" width="4" height="1.5" fill="#2b2a26"/>`,
		`<rect x="3.5" y="14" width="9" height="1.5" rx="0.5" fill="#3b3a35"/>`,
		`</svg>`,
	].join("");
}

/** The page's icon in that colour. */
export function showFavicon(rgb: readonly [number, number, number]): void {
	const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
	if (link) link.href = `data:image/svg+xml,${encodeURIComponent(faviconSvg(rgb))}`;
}
