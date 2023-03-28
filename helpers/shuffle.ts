export function shuffle<T>(array: T[]): T[] {
	let shuffledArray = array;

	array.forEach((_item, index) => {
		const randomIndex = Math.floor(Math.random() * (index + 1));
		[shuffledArray[index], shuffledArray[randomIndex]] = [
			shuffledArray[randomIndex],
			shuffledArray[index],
		];
	});

	return shuffledArray;
}
