export function interpolateColors(color1, color2, factor) {
	const c1 = parseColor(color1);
	const c2 = parseColor(color2);

	const r = Math.round(c1.r + (c2.r - c1.r) * factor);
	const g = Math.round(c1.g + (c2.g - c1.g) * factor);
	const b = Math.round(c1.b + (c2.b - c1.b) * factor);

	return `rgb(${r}, ${g}, ${b})`;
}

export function parseColor(color) {
	const canvas = document.createElement('canvas');
	const context = canvas.getContext('2d');

	context.fillStyle = color;

	const computedColor = context.fillStyle;
	canvas.remove();
	if (computedColor.startsWith('#')) {
		return hexToRgb(computedColor);
	} else if (computedColor.startsWith('rgb')) {
		const rgb = computedColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
		if (rgb) {
			return {
				r: parseInt(rgb[1], 10),
				g: parseInt(rgb[2], 10),
				b: parseInt(rgb[3], 10),
			};
		}
	}
	return { r: 0, g: 0, b: 0 };
}

export function hexToRgb(hex) {
	hex = hex.replace(/^#/, '');

	if (hex.length === 3) {
		hex = hex.split('').map(char => char + char).join('');
	}
	const intVal = parseInt(hex, 16);

	return {
		r: (intVal >> 16) & 255,
		g: (intVal >> 8) & 255,
		b: intVal & 255,
	};
}
