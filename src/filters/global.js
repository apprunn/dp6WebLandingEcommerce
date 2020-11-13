import { format } from 'date-fns';

function round(value, decimals = 2) {
	const newValue = Number(value);
	return newValue.toFixed(decimals);
}

function limitTo(value, length = 10) {
	const cutText = value.substring(0, length);
	return `${cutText}...`;
}

function formatDate(date, formatter = 'YYYY-MM-DD') {
	const newDate = format(new Date(date), formatter);
	return newDate;
}

function exactDate(date, formatter = 'DD-MM-YYYY', splitBy = 'T') {
	if (date) {
		const dateSplit = date.split(splitBy);
		const dateComplete = dateSplit[0].split('-');
		const year = dateComplete[0];
		const month = dateComplete[1] - 1;
		const day = dateComplete[2];
		const newDate = format(new Date(year, month, day), formatter);
		return newDate;
	}
	return '';
}

function currencyFormat(val) {
	const newVal = val ? Number(val.toFixed(2)) : 0;
	if (!newVal) {
		return '0.00';
	}
	const [integer, decimals] = String(newVal).split('.');
	if (!decimals) {
		return `${integer}.00`;
	}
	const newDecimals = decimals.length === 1 && decimals < 10 ? `${decimals}0` : decimals;
	return `${integer}.${newDecimals}`;
}

function cuttingWord(val, num) {
	const len = val.length;
	if (len > num) {
		const cuted = val.substr(0, (num - 3));
		return `${cuted}...`;
	}
	return val;
}

export default function (Vue) {
	Vue.filter('round', round);
	Vue.filter('limitTo', limitTo);
	Vue.filter('exactDate', exactDate);
	Vue.filter('formatDate', formatDate);
	Vue.filter('currencyFormat', currencyFormat);
	Vue.filter('cuttingWord', cuttingWord);
}
