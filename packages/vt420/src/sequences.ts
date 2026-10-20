/**
 * Fixed control sequences for setting up and restoring a VT420.
 */

import type { SupplementalSet } from "./charset.ts";

export interface DesignationOptions {
	technical: boolean;
	supplemental: SupplementalSet;
	eightBit: boolean;
}

/** G2 as the session keeps it: DEC Technical, or ASCII on a terminal without it. */
export function g2Designation(technical: boolean): string {
	return technical ? "\x1b*>" : "\x1b*B";
}

/** G2 as the soft font, named " @", while the renderer draws from it. */
export const SOFT_FONT_DESIGNATION = "\x1b* @";

/**
 * DECDLD for glyphs of a soft font of 10 by 16 dots a character, the size of an 80-column, 24-line screen, from
 * `first` on; each glyph is 16 rows of 10 characters, `#` for a dot. Full-cell, so glyphs can join their neighbours.
 * Only the glyphs loaded are replaced, so a font can go out a few glyphs at a time, as a slow line wants it.
 */
export function softFont(glyphs: readonly (readonly string[])[], first = 0x21): string {
	const encoded = glyphs.map((rows) => {
		const sixels: string[] = [];
		for (let band = 0; band < 3; band++) {
			let column = "";
			for (let col = 0; col < 10; col++) {
				let bits = 0;
				for (let bit = 0; bit < 6; bit++) bits |= (rows[band * 6 + bit]?.[col] === "#" ? 1 : 0) << bit;
				column += String.fromCharCode(0x3f + bits);
			}
			sixels.push(column);
		}
		return sixels.join("/");
	});
	return `\x1bP1;${first - 0x20};1;10;0;2;16;0{ @${encoded.join(";")}\x1b\\`;
}

/** G0 ASCII, G1 DEC Special Graphics, G2 DEC Technical, G3 supplemental; GL = G0, and GR = G3 in 8-bit mode. */
export function charsetDesignations(options: DesignationOptions): string {
	const g2 = g2Designation(options.technical);
	const g3 = options.supplemental === "latin1" ? "\x1b/A" : "\x1b+%5";
	return `\x1b(B\x1b)0${g2}${g3}\x0f${options.eightBit ? "\x1b|" : ""}`;
}

/** Power-up designations: ASCII in G0/G1, DEC Supplemental in G2/G3, G0 in GL and G2 in GR. */
export const DEFAULT_DESIGNATIONS = "\x1b(B\x1b)B\x1b*%5\x1b+%5\x0f\x1b}";

/** 7-bit C1 controls, replace mode, LNM reset, local echo off, autowrap off, origin mode off. */
export const SESSION_MODES = "\x1b F\x1b[4l\x1b[20l\x1b[12h\x1b[?7l\x1b[?6l";

export function statusLineType(type: number): string {
	return `\x1b[${type}$~`;
}
