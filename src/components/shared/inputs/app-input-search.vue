<template>
	<div
		:class="[
		{ 'loading': indeterminate },
		'app-input-search',
	]">
		<SearchIcon v-if="!indeterminate"/>
		<input
			ref="search"
			data-cy="inputSearcher"
			v-bind="$attrs"
			placeholder="¿Qué buscas?"
			:class="[
				{ 'loading': indeterminate },
				'app-input',
			]"
			:style="`color: ${color}`"
			@keydown.enter="sendValue"
			@keyup.esc="sendValue"
			v-model="searchText"
		/>
		<trash-component class="action" @click="cleanInput" :width="16" :height="19" />
	</div>
</template>
<script>
import { mapGetters } from 'vuex';
import SearchIcon from '@/components/shared/icons/search-component';
import trashComponent from '@/components/shared/icons/trash-component';

function data() {
	return {
		searchText: '',
	};
}

function sendValue(value) {
	this.$emit('search', value.target.value);
}
function cleanInput() {
	this.searchText = '';
	this.focusInput();
}

function focusInput() {
	this.$refs.search.focus();
}

export default {
	name: 'app-input-search',
	components: {
		SearchIcon,
		trashComponent,
	},
	computed: {
		...mapGetters([
			'indeterminate',
		]),
	},
	data,
	props: {
		image: String,
		color: String,
	},
	methods: {
		sendValue,
		cleanInput,
		focusInput,
	},
	watch: {
		$route(to) {
			if (to.path === '/') {
				this.cleanInput();
				this.$emit('search', '');
			}
		},
	},
};
</script>
<style lang="scss" scoped>
	.app-input-search {
		align-items: center;
		border: solid 2px color(border);
		border-radius: 8px;
		display: flex;
		height: 38px;
		padding: 5px 14px;
		width: 100%;

		@media (max-width: 764px) {
			border: solid 1px color(border);
			border-radius: 3px;
		}
	}

	.app-input {
		background-color: color(white);
		border-color: transparent;
		border-radius: 7px;
		border-style: solid;
		border-width: 1px;
		font-family: font(demi);
		font-size: size(medium);
		outline: none;
		padding: 0px 16.2px;
		width: 100%;
	}

	.icon-search {
		height: 22px;

		@media (max-width: 764px) {
			height: 17px;
		}
	}

	.action {
		width: 20px;
		height: 20px;
	}
</style>


