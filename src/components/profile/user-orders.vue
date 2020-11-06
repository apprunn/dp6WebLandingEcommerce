<template>
	<div>
		<profile-tab @status-changed="statusChanged" class="tabs-container"/>
		<div class="table-container">
			<responsive-table
				:columns="columns"
				:rows="getOrders"
				:page="params.page"
				:pages="lastPage"
				@page-changed="changePage"
			>
				<template slot-scope="{ row }">
					<td class="row-date">{{row.createdAt}}</td>
					<td class="row-order">
						<span class="row-order-label">Nro. Orden: </span>{{row.number}}
					</td>
					<td class="row-date">{{getReferenceId(row)}}</td>
					<td class="row-totalOrder">
						<span class="row-totalOrder-label">Total: </span>{{row.total}}
					</td>
					<td class="row-orderStatus">{{getValue('orderState.name', row)}}</td>
					<td class="row-wayDelivery">{{row.pickUpName}}</td>
					<td class="row-wayPayment">{{getValue('wayPayment.name', row)}}</td>
					<td class="row-actions">
						<details-component class="action-btn" @click="seeDetails(row)"/>
						<delete-component
							v-show="row.orderState.code === 'REQUESTED' || row.orderState.code === 'CONFIRMED'"
							class="action-btn"
							@click="openDeletingOrderModal(row)"
						/>
					</td>
				</template>
			</responsive-table>
		</div>
		<modal-component v-model="showModal" max-width="370px">
			<div class="deleting-order-modal">
				<section class="modal-close-button" :style="`color:${globalColors.primary}`">
					<button type="button" @click="closeModal" class="close-button">X</button>
				</section>
				<section class="modal-content">
					<p class="confirm">¿Desea anular<br> el pedido Nro: {{currentOrder.number}}?</p>
				</section>
				<section class="modal-buttons-container">
					<button
						type="button"
						class="modal-button"
						:style="`background-color:${globalColors.primary}`"
						@click="deleteOrder"
					>SI</button>
					<button
						type="button"
						class="modal-button"
						:style="`background-color:${globalColors.secondary}`"
						@click="closeModal"
					>NO</button>
				</section>
			</div>
		</modal-component>
	</div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import { getDeeper } from '@/shared/lib';
import deleteComponent from '@/components/shared/icons/delete-component';
import detailsComponent from '@/components/shared/icons/details-component';
import profileTab from '@/components/shared/tabs/profile-tab';
import responsiveTable from '@/components/shared/table/respondive-table';
import modalComponent from '@/components/shared/modal/modal-component';

function created() {
	this.$store.dispatch('LOAD_ORDERS_STATUS', this);
	this.loadOrders();
}

async function loadOrders() {
	this.lastPage = await this.$store.dispatch(
		'LOAD_ORDERS',
		{ context: this, params: this.params },
	);
}

function seeDetails(order) {
	this.$router.push({ name: 'order-detail', params: { id: order.id } });
}

function getValue(route, order) {
	return getDeeper(route)(order);
}


function changePage(page) {
	this.loadOrders();
	this.params.page = page;
}

function statusChanged(id) {
	this.params.orderStateId = id;
	this.params.page = 1;
	this.loadOrders();
}

async function deleteOrder() {
	const { id } = this.currentOrder;
	await this.CANCEL_ORDER({ context: this, id });
	this.loadOrders();
	this.closeModal();
}

function openDeletingOrderModal(order) {
	this.showModal = !this.showModal;
	this.currentOrder = order;
}

function closeModal() {
	this.showModal = false;
	this.currentOrder = {};
}

function getReferenceId(order) {
	const referenceId = getDeeper('additionalInformation.paymentGateway.referenceId')(order);
	return referenceId || '--';
}

function data() {
	return {
		columns: [
			{ value: 'date', title: 'Fecha de orden', responsive: true },
			{ value: '', title: 'Número de orden', responsive: false },
			{ value: '', title: 'Referencia', responsive: false },
			{ value: '', title: 'Total Orden' },
			{ value: 'orderStatus', title: 'Estado', responsive: true },
			{ value: 'wayDelivery', title: 'Modo de entrega', responsive: false },
			{ value: 'wayPayment', title: 'Método de pago', responsive: true },
			{ value: '', title: 'Acción' },
		],
		currentOrder: {},
		lastPage: 0,
		orderStatusId: 0,
		params: {
			limit: 7,
			page: 1,
			orderStateId: null,
		},
		showModal: false,
	};
}

export default {
	name: 'user-orders',
	components: {
		deleteComponent,
		detailsComponent,
		modalComponent,
		profileTab,
		responsiveTable,
	},
	computed: {
		...mapGetters([
			'getOrders',
			'getStates',
		]),
	},
	created,
	data,
	methods: {
		...mapActions([
			'CANCEL_ORDER',
		]),
		changePage,
		closeModal,
		deleteOrder,
		getReferenceId,
		getValue,
		loadOrders,
		openDeletingOrderModal,
		seeDetails,
		statusChanged,
	},
};
</script>
<style lang="scss" scoped>
	.tabs-container {
		margin-left: 50px;
	}
	.web-tab {
		bottom: 90%;
		position: absolute;

		@media (max-width: 900px) {
			bottom: 90%;
		}
	}

	.table-container {
		margin: 20px 50px 0;

		@media (max-width: 600px) {
			margin: 20px 10px 0;
		}
	}

	.row-order {
		grid-column: 1/2;
		grid-row: 1/2;

		@media (max-width: 600px) {
			border: none;
			font-family: font(bold);
			font-size: size(small);
			line-height: 45px;
		}
	}

	.row-date {
		grid-column: 1/2;
		grid-row: 2/3;

		@media (max-width: 600px) {
			background-color: color(background);
			font-size: size(small);
			line-height: 45px;
		}
	}

	.row-totalOrder {
		grid-column: 2/3;
		grid-row: 1/2;

		@media (max-width: 600px) {
			border: none;
			font-family: font(bold);
			font-size: size(small);
			line-height: 45px;
		}
	}

	.row-orderStatus {
		grid-column: 2/3;
		grid-row: 2/3;

		@media (max-width: 600px) {
			background-color: color(background);
			font-size: size(small);
			line-height: 45px;
		}
	}

	.row-actions {
		display: flex;
		grid-column: 3/4;
		grid-row: 1/2;

		@media (max-width: 600px) {
			border: none;
			line-height: 45px;
		}
	}

	.row-wayPayment {
		grid-column: 3/4;
		grid-row: 2/3;

		@media (max-width: 600px) {
			background-color: color(background);
			font-size: size(small);
			line-height: 45px;
			overflow: hidden;
		}
	}

	.row-wayDelivery {
		
		@media (max-width: 600px) {
			display: none;
		}
	}

	.action-btn {
		margin: 0 10px;
	}

	.row-totalOrder-label,
	.row-order-label {
		display: none;

		@media (max-width: 600px) {
			display: inline-block,
		}
	}

	.deleting-order-modal {
		align-items: center;
		background-color: white;
		border-radius: 8px;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		padding: 14px;
		margin: auto;

		.modal-close-button {
			text-align: right;
			width: 100%;

			.close-button {
				margin-bottom: 15px;
				padding: 5px 15px;
			}
		}

		.modal-content {
			border-bottom: 1px solid color(border);
			width: 100%;

			.confirm {
				font-family: font(demi);
				font-size: medium;
				margin: 0 auto 30px;
				text-align: center;
				width: max-content;
			}
		}

		.modal-buttons-container {
			align-items: center;
			display: flex;
			justify-content: center;
			margin-top: 20px;
			width: 100%;

			.modal-button {
				border-radius: 7px;
				color: white;
				font-family: font(demi);
				margin: 0 10px;
				padding: 5px 35px;
			}
		}
	}
</style>
