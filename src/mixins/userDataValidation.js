function onlyNumbers(val) {
	return Number(val) > 0;
}

function onlyCharacters(char) {
	if (char && char !== null) {
		const trimedChar = char.split(' ').join('');
		const noChar = /[^a-zA-ZáéíóúáéíóúÁÉÍÓÚñÑ]/i.test(trimedChar);
		return !noChar;
	}
	return false;
}

export default {
	methods: {
		onlyCharacters,
		onlyNumbers,
	},
};
