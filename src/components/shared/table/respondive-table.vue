<template>
	<table>
		<thead class="table-head">
			<tr class="grid-system">
				<th
					v-for="column in columns"
					:key="column.id"
					:class="[
						column.responsive ? 'responsive-col': 'no-responsive',
						{ 'first-column-head' : alignLeft },
					]"
				>{{column.title}}</th>
			</tr>
		</thead>
		<tbody>
			<tr 
				v-for="row in rows" :key="row.id" 
				class="grid-system"
				:class="{'auto': auto}"
				>
				<slot v-bind:row="row"></slot>
			</tr>
		</tbody>
		<tfoot :class="{ 'tfoot-hidden': tfootHidden }" v-if="pages > 1">
			<tr>
				<td class="pagination-container" :colspan="calculateColSpan">
					<button
						class="sub-page"
						type="button"
						@click="changePage(currentPage - 1)"
					>
						<
					</button>
					<button
						type="button"
						:class="[
							'pagination',
							{ 'active-page': currentPage === page },
						]"
						v-for="page in computedPages"
						:key="page"
						@click="changePage(page)"
					>{{page}}</button>
					<button
						class="add-page"
						type="button"
						@click="changePage(currentPage + 1)"
					>></button>
				</td>
			</tr>
		</tfoot>
	</table>
</template>
<script>

function created() {
	this.currentPage = this.page;
	this.arrPageRange = Array.from({ length: this.pageRange }, (el, i) => i + 1);
}

function calculateColSpan() {
	return this.columns.length;
}

function computedPages() {
	if (this.pages <= this.pageRange) {
		return this.pages;
	}
	return this.currentPage <= this.pageRange
		? this.initialPagination()
		: this.newPagination(this.currentPage);
}

function newPagination(currentPage) {
	if (currentPage >= this.pageRange && this.pages - currentPage < this.pageRange) {
		const init = this.pages - this.pageRange;
		return Array.from({ length: this.pageRange }, (el, i) => init + i + 1);
	}
	return this.nextRange(currentPage);
}

function initialPagination() {
	return [].concat(this.arrPageRange, '...', this.pages);
}

function changePage(newPage) {
	if (newPage === '...') {
		this.nextRange(this.currentPage, 1);
	} else {
		if (newPage < 1) {
			this.currentPage = 1;
		} else if (newPage > this.pages) {
			this.currentPage = this.pages;
		} else {
			this.currentPage = newPage;
		}
		this.$emit('page-changed', this.currentPage);
	}
}

function nextRange(currentPage, n) {
	const currentRange = Math.ceil(currentPage / this.pageRange) + (n || 0);
	const initial = (currentRange * this.pageRange) - this.pageRange;
	const arr = Array.from({ length: this.pageRange }, (el, i) => initial + i + 1);
	if (n) {
		this.currentPage = arr[0];
	}
	return [].concat(arr, '...', this.pages);
}

function page(newPage, oldPage) {
	if (newPage !== oldPage) {
		this.currentPage = newPage;
	}
}

function data() {
	return {
		arrPageRange: null,
		currentPage: 1,
		pageRange: 6,
	};
}

export default {
	name: 'responsive-table',
	computed: {
		calculateColSpan,
		computedPages,
	},
	created,
	data,
	methods: {
		changePage,
		initialPagination,
		nextRange,
		newPagination,
	},
	props: {
		alignLeft: {
			default: false,
			type: Boolean,
		},
		columns: {
			default: () => [],
			type: Array,
		},
		page: {
			default: 1,
			type: Number,
		},
		pages: {
			default: 0,
			type: [Number, String],
		},
		rows: {
			default: () => [],
			type: Array,
		},
		auto: {
			default: false,
			type: Boolean,
		},
		tfootHidden: {
			default: true,
			type: Boolean,
		},
	},
	watch: {
		page,
	},
};
</script>
<style lang="scss" scoped>
	table {
		border-collapse: collapse;
		color: color(dark);
	}

	table, tr {
		width: 100%;
	}

	thead {
		background-color: color(border);
		position: sticky;
		top: 75px;
		z-index: 7;

		th {
			font-family: font(bold);
			font-size: size(small);
			padding: 10px;
			text-transform: uppercase;
		}

		.no-responsive {

			@media (max-width: 600px) {
				display: none;
			}
		}

		.responsive-col {

			@media (max-width: 600px) {
				display: table-cell;
				overflow: hidden;
				text-overflow: ellipsis;
			}
		}

		th:first-child {
			border-bottom-left-radius: 8px;
			border-top-left-radius: 8px;
		}

		th:last-child {
			border-bottom-right-radius: 8px;
			border-top-right-radius: 8px;
		}
	}

	td {
		border-bottom: 1px solid color(border);
		font-family: font(regular);
		font-size: size(small);
		height: 45px;
		text-align: center;
	}

	tfoot.tfoot-hidden {
		@media (max-width: 600px) {
			display: none;
		}
	}

	.grid-system {

		@media (max-width: 600px) {
			align-items: center;
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(20px, 1fr));
		}

		&.auto{
			border-bottom: 1px solid color(border);
		}
	}

	.first-column-head {
		padding-left: 30px;
		text-align: left;

		@media (max-width: 600px) {
			padding: 10px;
			text-align: center;
		}
	}

	.pagination-container {
		border: none;
		text-align: right;
	}

	.pagination {
		color: color(base);
		font-family: font(medium);
		font-size: size(small);
		height: 20px;
		margin: 0 5px;
		text-align: center;
		width: 17px;
	}

	.active-page {
		background-color: color(secondary);
		color: color(background);
	}

	.sub-page,
	.add-page {
		color: color(base);
		font-family: font(medium);
		font-size: size(small);
	}
</style>

