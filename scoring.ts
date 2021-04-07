export const calculateScore = (numLinesCleared: number) => (level: number) => {
	const scoreTable = [40, 100, 300, 1200];
	console.log(
		"score: ",
		numLinesCleared > 0 ? (level + 1) * scoreTable[numLinesCleared - 1] : 0
	);
	return numLinesCleared > 0
		? (level + 1) * scoreTable[numLinesCleared - 1]
		: 0;
};

export const calculateLevel = (numLinesCleared: number) =>
	Math.floor(Math.sqrt(25 + 20 * numLinesCleared) - 5) / 10;
