import store from '@/store';
import { getDeeper } from '@/shared/lib';
import countries from '@/shared/countries.json';

function data() {
	return {
		params: {
			customerId: null,
			page: 1,
			limit: 20,
			search: null,
		},
		table: {
			lastPage: 1,
			rows: [],
		},
		isBtn: false,
	};
}

function isPeru() {
	return getDeeper('company.country.countryCode')(store.getters.user) === 'PER';
}

Math.easeInOutQuad = (t, b, c, d) => {
	let time = t;
	time /= d / 2;
	if (time < 1) {
		return (((c / 2) * time) * time) + b;
	}
	time -= 1;
	return ((-c / 2) * ((time * (time - 2)) - 1)) + b;
};

function goTo(name, options) {
	this.$router.push({ name, ...options });
}

function getImageUrl(imageUrl) {
	return `${this.$imageUrl}/${imageUrl}`;
}

async function loadData(url) {
	const { data: records, headers } = await this.$http.get(url, { params: this.params });
	this.table.lastPage = Number(headers['x-last-page']);
	this.table.rows = records.map((record) => {
		const newRecord = { ...record };
		newRecord.isSelected = false;
		return newRecord;
	});
	return { records, headers };
}

function onSearch(value, url) {
	this.params.search = value || null;
	this.params.page = 1;
	this.loadData(url);
}

function replaceString(word, selectionStart, newWord) {
	if (word) {
		return word.slice(0, selectionStart) + newWord + word.slice(selectionStart + 0);
	}
	return newWord;
}

function showNotification(text, color = 'success', html = null, isBtn = false, timeout = 60000) {
	this.$store.dispatch('showSnackBar', { text, color, html, isBtn, timeout });
}

function showGenericError(text = 'Ups, ocurrió algún problema', timeout = 10000) {
	this.showNotification(text, 'error', null, false, timeout);
}

function showRow(columns, columnId) {
	const column = columns.find(h => h.id === columnId);
	return column.visible;
}

function stopClick() {
	return false;
}

function token() {
	return this.$store.getters.token;
}

function globalColors() {
	const { primary, secondary, border, title, subtitle } = store.getters.templateColors;
	return {
		base: border,
		dark: process.env.COLOR_DARK,
		highLight: process.env.COLOR_HIGHLIGHT,
		primary,
		secondary,
		title,
		subtitle,
	};
}

function countryLabels() {
	const countryCode = JSON.parse(localStorage.getItem('ecommerce::country'));
	return countries[countryCode];
}

function getLocalStorage(key) {
	const items = JSON.parse(localStorage.getItem(key));
	return items;
}

function setLocalData(key, setData) {
	return localStorage.setItem(key, JSON.stringify(setData));
}

function scrollTo(element, duration, fit) {
	const to = document.getElementsByClassName(element)[0].offsetTop;
	const start = window.scrollY;
	const change = fit ? to - start : to - start - 100;
	let currentTime = 0;
	const increment = 20;

	const animateScroll = () => {
		currentTime += increment;
		const val = Math.easeInOutQuad(currentTime, start, change, duration);
		window.scrollTo(0, val);
		if (currentTime < duration) {
			setTimeout(animateScroll, increment);
		}
	};
	animateScroll();
	this.isVisible = false;
}

function updateDescriptionTag(description) {
	const metaDescription = document.getElementById('myDescription');
	if (metaDescription) {
		metaDescription.content = description;
	}
}

function updatePageTitle(title) {
	document.title = title;
}

function isEcuador() {
	return !this.isPeru;
}

const mixin = {
	data,
	computed: {
		countryLabels,
		globalColors,
		isEcuador,
		isPeru,
		token,
	},
	methods: {
		getImageUrl,
		getLocalStorage,
		goTo,
		loadData,
		onSearch,
		replaceString,
		setLocalData,
		showGenericError,
		showNotification,
		showRow,
		stopClick,
		scrollTo,
		updateDescriptionTag,
		updatePageTitle,
	},
};

export default mixin;
