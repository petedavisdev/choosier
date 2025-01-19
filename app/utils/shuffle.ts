export function shuffle<T>(array: T[]): T[] {
	return array
		.map((x) => [Math.random(), x] as [number, T])
		.sort()
		.map((y) => y[1]);
}
