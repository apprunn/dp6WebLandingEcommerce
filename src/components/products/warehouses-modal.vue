<template>
	<div>
		<v-dialog
			data-cy="warehouseModal"
			v-model="dialogModal"  
			max-width="766px"
			@input="closeModal"
			class="warehouses-modal">
			<v-card>
				<v-card-title>
					<div 
						class="title-modal"
						:style="`background: ${globalColors.primary}`">
						<p><span class="bold">Disponibilidad</span> en tiendas</p>
						<button @click="$emit('change-modal', false)">
							<img src="/static/img/close-modal.svg" alt="cerrar">
						</button>
					</div> 
				</v-card-title>
				<transition name="go-left" mode="out-in" tag="div">
					<v-card-text v-if="showMap" key="map">
						<p>
							<span><b>{{selectedWarehouse.autocomplete}}: </b></span>
							<span>{{selectedWarehouse.warehouse.address}}</span>
						</p>
							<map-component :location="warehouseLocation"/>
					</v-card-text>
					<v-card-text v-else key="warehouse-table">
						<h1
							v-if="rows.length === 0"
							class="no-stock-message"
							:style="`color:${globalColors.base}`"
						>Sin disponibilidad :(</h1>
						<responsive-table
							v-else
							:columns="columns"
							:rows="rows"
							auto
						>
							<template slot-scope="{ row }">
								<td class="td-auto">
									<div class="text-left bold">{{row.warehouse.name}}</div>
									<div class="text-left">{{row.warehouse.address}}</div>
								</td>
								<td class="td-auto">{{row.stock}}</td>
								<td class="td-auto">
									<button class="icon-map" @click="goToMap(row)" v-if="warehouseLatLon(row)">
										<img src="/static/img/map.svg" alt="mapa">
									</button>
								</td>
							</template>
						</responsive-table>
					</v-card-text>
				</transition>
			</v-card>
		</v-dialog>
	</div>
</template>
<script>
import responsiveTable from '@/components/shared/table/respondive-table';
import mapComponent from '@/components/shared/map/map-component';

function warehouseLatLon(row) {
	const { warehouse: { location } } = row;
	const { x, y } = location || {};
	return (!!x && !!y);
}

function closeModal(value) {
	this.$emit('change-modal', value);
}

function dialog(value) {
	this.dialogModal = value;
	if (!value) {
		this.showMap = false;
	}
}

function goToMap(row) {
	this.showMap = true;
	this.selectedWarehouse = row;
	const { warehouse: { location: { x, y } } } = row;
	this.warehouseLocation = { lat: x, lng: y };
}

function data() {
	return {
		columns: [
			{ value: 'warehouse', title: 'Tienda', responsive: true },
			{ value: 'stock', title: 'Stock', responsive: true },
			{ value: 'map', title: 'Mapa', responsive: true },
		],
		dialogModal: false,
		showMap: false,
		selectedWarehouse: {},
		warehouseLocation: {
			lat: 0,
			lng: 0,
		},
	};
}
export default {
	name: 'warehouses-modal',
	components: {
		responsiveTable,
		mapComponent,
	},
	data,
	methods: {
		closeModal,
		goToMap,
		warehouseLatLon,
	},
	props: {
		dialog: {
			default: false,
			type: Boolean,
		},
		rows: {
			default: () => [],
			type: Array,
		},
	},
	watch: {
		dialog,
	},
};
</script>
<style lang="scss" scoped>
	.icon-map {
		cursor: pointer;
		padding: 10px 0;
	}

	.title-modal {
		border-radius: 5px;
		color: color(white);
		font-size: 15px;
		height: 46px;
		padding: 13px;
		text-align: center;
		width: 100%;

		.bold {
			font-family: font(bold);
		}

		@media screen and (max-width: 764px) {
			display: flex;
			justify-content: space-between;
		}
	}

	.td-auto {
		border-bottom: none !important;
		font-size: size(small);
		height: auto !important;
		padding: 10px 0;
	}

	.bold {
		font-family: font(bold);
	}

	.text-left {
		text-align: left;
	}

	.no-stock-message {
		margin: 0;
		text-align: center;
	}
</style>