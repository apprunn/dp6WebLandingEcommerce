<template>
	<div>
		<section>
			<h3
				:style="`color: ${globalColors.primary};`"
				class="section-title">Mis transacciones online</h3>
		</section>
		<section class="table-online-transaction">
			<responsive-table
				align-left
				:columns="columns"
				:rows="transactions"
				:page="currentPage"
				:pages="totalPages"
				@page-changed="pageChange"
			>
				<template slot-scope="{ row }">
					<td class="order-number">{{row.number}}</td>
					<td class="order-amount">{{row.amount}}</td>
					<td class="order-status">{{row.paymentStateName}}</td>
					<td class="order-reference">{{row.referenceId || row.documentNumber}}</td>
					<td class="date">
						<span>Fecha:</span>
						{{row.dateTransaction | formatDate}}
					</td>
					<td class="date">
						<span v-if="row.dateExpiration">
							{{row.dateExpiration | formatDate}}
						</span>
						<span v-else>--</span>
					</td>
					<td class="actions">
						<details-component class="action-btn" @click="seeDetails(row)"/>
					</td>
				</template>
			</responsive-table>
		</section>
	</div>
</template>
<script>
import carComponent from '@/components/shared/icons/car-component';
import deleteComponent from '@/components/shared/icons/delete-component';
import responsiveTable from '@/components/shared/table/respondive-table';
import detailsComponent from '@/components/shared/icons/details-component';
import { placetopay } from '@/shared/enums/gatewayCodes';
import { mapState } from 'vuex';

async function created() {
	this.loadTransactions();
}

async function loadTransactions() {
	this.totalPages = await this.$store.dispatch(
		'LOAD_PAYMENT_TRANSACTIONS',
		{ context: this, codeGateway: placetopay, page: this.currentPage },
	);
}

function pageChange(page) {
	this.currentPage = page;
	this.loadTransactions();
}

function seeDetails(order) {
	this.$router.push({ name: 'order-detail', params: { id: order.orderId } });
}

function data() {
	return {
		columns: [
			{ value: 'order', title: 'Pedido', responsive: true },
			{ value: 'amount', title: 'Monto', responsive: true },
			{ value: 'status', title: 'Estado', responsive: true },
			{ value: 'reference', title: 'Referencia', responsive: false },
			{ value: 'date', title: 'Creación', responsive: false },
			{ value: 'date', title: 'Expiración', responsive: false },
			{ value: 'actions', title: '', responsive: false },
		],
		currentPage: 1,
		totalPages: 0,
	};
}

export default {
	name: 'online-transactions',
	components: {
		carComponent,
		deleteComponent,
		detailsComponent,
		responsiveTable,
	},
	computed: {
		...mapState({
			transactions: state => state.profile.onlineTransactions,
		}),
	},
	created,
	data,
	methods: {
		loadTransactions,
		pageChange,
		seeDetails,
	},
};
</script>
<style lang="scss" scoped>

	.product-info-container {
		align-items: center;
		display: grid;
		grid-column-gap: 20px;
		grid-template-columns: 50px 1fr;
	}

	.table-online-transaction {
		margin: 0 50px;
		
		@media (max-width: 600px) {
			margin: 0 10px;
		}

		td {
			font-size: size(small);
			padding: 10px;
			text-align: center;
		}
	}

	.row-product {
		grid-column: 1/3;

		@media (max-width: 600px) {
			align-items: center;
			background-color: color(disabled);
			display: flex;
			height: 100%;
		}
	}

	.product-name {
		font-family: font(bold);
		font-size: size(medium);

		@media (max-width: 600px) {
			font-size: size(small);
		}
	}

	.product-description,
	.product-img {

		@media (max-width: 600px) {
			display: none;
		}
	}

	.order-number {
		grid-column: 1;
		grid-row: 1;

		@media (max-width: 600px) {
			font-size: size(small);
		}
	}

	.order-amount {
		grid-column: 2;
		grid-row: 1;
		white-space: nowrap;

		@media (max-width: 600px) {
			font-size: size(small);
			text-align: left;
		}
	}

	.order-status {
		grid-column: 3;
		grid-row: 1;

		@media (max-width: 600px) {
			font-size: size(small);
		}
	}

	.order-reference {
		grid-column: 2;
		grid-row: 2;

		@media (max-width: 600px) {
			border-bottom: none;
			font-size: size(small);
		}
	}

	.actions {
		grid-column: 3;
		grid-row: 2;

		@media (max-width: 600px) {
			border-bottom: none;
			font-size: size(small);
		}
	}

	.date {
		grid-column: 1;
		grid-row: 2;

		span {
			display: none;
		}

		@media (max-width: 600px) {
			border-bottom: none;
			font-size: size(small);

			span {
				display: inline-block;
			}
		}
	}

	.product-actions-wrapper {
		display: flex;
	}

	.row-product {

		@media (max-width: 600px) {
			border: none;
		}
	}

	.product-img {
		height: 34px;
		object-fit: contain;
		width: 50px;
	}

	.action-btn {
		margin: 0 10px;
	}

	.section-title {
		font-family: font(bold);
		font-size: size(large);
		margin: 30px 0 40px 40px;
		text-transform: uppercase;

		@media (max-width: 500px) {
			margin-bottom: 20px;
		}
	}
</style>
