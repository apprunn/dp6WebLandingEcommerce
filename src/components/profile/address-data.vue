<template>
	<div>
		<section>
			<h3
				:style="`color: ${globalColors.primary};`"
				class="section-title"
			>direcciones</h3>
		</section>
		<section>
			<new-address-form/>
		</section>
		<section class="table">
			<responsive-table
				class="address"
				:columns="columns"
				:pages="totalPage"
				:rows="getAddress"
				:tfoot-hidden="false"
				@page-changed="pageChange"
			>
				<template slot-scope="{ row }">
					<td class="address-name">{{row.name || '--'}}</td>
					<td class="address-department">{{getValue('province.name', row) || '--'}}</td>
					<td class="address-city">{{getValue('city.name', row) || '--'}}</td>
					<td class="address-province">{{getValue('parish.name', row) || '--'}}</td>
					<td class="address-location">{{row.addressLine1}}</td>
					<td class="address-location-2">{{row.addressLine2}}</td>
					<td class="address-actions">
						<div class="address-actions-wrapper">
							<star-component class="action-btn" @click="favoriteAddress(row)" v-model="row.isFavorite"/>
							<delete-component class="action-btn" @click="deleteAddress(row)"/>
						</div>
					</td>
				</template>
			</responsive-table>
		</section>
	</div>
</template>
<script>
import { mapGetters } from 'vuex';
import { getDeeper, setNewProperty } from '@/shared/lib';
import newAddressForm from '@/components/profile/new-address-form';
import deleteComponent from '@/components/shared/icons/delete-component';
import responsiveTable from '@/components/shared/table/respondive-table';
import starComponent from '@/components/shared/icons/star-component';

function created() {
	this.updateColumns();
	this.loadAddress();
}

function updateColumns() {
	this.columns = this.columns.map((col) => {
		if (col.value === 'district') {
			return setNewProperty('title', this.countryLabels.district)(col);
		} else if (col.value === 'province') {
			return setNewProperty('title', this.countryLabels.province)(col);
		} else if (col.value === 'department') {
			return setNewProperty('title', this.countryLabels.department)(col);
		}
		return col;
	});
}

async function loadAddress() {
	this.totalPage = await this.$store.dispatch('LOAD_USER_ADDRESS',
		{ context: this, params: { page: this.currentPage, limit: this.limit } },
	);
}

function getValue(route, row) {
	return getDeeper(route)(row);
}

function pageChange(page) {
	this.currentPage = page;
	this.$store.dispatch('LOAD_USER_ADDRESS',
		{ context: this, params: { page: this.currentPage, limit: this.limit } },
	);
}

async function favoriteAddress(address) {
	const { isFavorite, id } = address;
	const body = {
		isFavorite: !isFavorite,
	};
	try {
		await this.$store.dispatch('SET_FAVORITE_ADDRESS', { context: this, body, id });
		this.loadAddress();
		this.showNotification('Dirección actualizada como favorita');
	} catch (error) {
		this.showGenericError('No fue posible seleccionar como favorita esa dirección', 80000);
	}
}

async function deleteAddress({ id, name }) {
	try {
		await this.$store.dispatch('DELETE_ADDRESS', { context: this, id });
		this.showNotification(`Dirección ${name.toUpperCase()} eliminada con éxito`);
		this.loadAddress();
	} catch (error) {
		this.showGenericError('Esta dirección es usada actualmente en un Pedido', 80000);
	}
}

function data() {
	return {
		columns: [
			{ value: 'alias', title: 'Alias', responsive: true },
			{ value: 'department', title: '', responsive: true },
			{ value: 'province', title: '', responsive: true },
			{ value: 'district', title: '', responsive: true },
			{ value: 'address', title: 'Dirección', responsive: false },
			{ value: 'addressLine2', title: 'Dpto. - Ofic.', responsive: false },
			{ value: 'actions', title: 'Acción', responsive: false },
		],
		currentPage: 1,
		limit: 10,
		totalPage: 0,
	};
}

export default {
	name: 'address-data',
	components: {
		deleteComponent,
		newAddressForm,
		responsiveTable,
		starComponent,
	},
	computed: {
		...mapGetters([
			'getAddress',
		]),
	},
	created,
	data,
	methods: {
		deleteAddress,
		favoriteAddress,
		getValue,
		loadAddress,
		pageChange,
		updateColumns,
	},
};
</script>
<style lang="scss" scoped>
	.address {

		td {
			font-size: size(small);
			padding: 5px !important;
		}
	}

	.table {
		margin: 0 50px;
		
		@media (max-width: 680px) {
			margin: 0 10px;
		}

		td {
			padding: 10px 30px;

			@media (max-width: 600px) {
				font-size: size(small);
				padding: 10px;
			}
		}
	}

	.address-name {
		grid-column: 1;
		grid-row: 2;

		@media (max-width: 600px) {
			align-items: flex-start;
			background-color: white;
			border-bottom: none;
			display: flex;
			height: 100%;
		}
	}

	.address-department {
		grid-column: 2;
		grid-row: 2;
		text-transform: lowercase;

		@media (max-width: 600px) {
			background-color: white;
			border-bottom: none;
			text-align: left;
		}
	}

	.address-province {
		grid-column: 4;
		grid-row: 2;
		text-transform: lowercase;

		@media (max-width: 600px) {
			background-color: white;
			border-bottom: none;
			text-align: left;
		}
	}

	.address-city {
		grid-column: 3;
		grid-row: 2;
		text-transform: lowercase;

		@media (max-width: 600px) {
			background-color: white;
			border-bottom: none;
			text-align: left;
		}
	}

	.address-actions {
		grid-column: 4/5;
		grid-row: 1;
		height: 65px;

		@media (max-width: 600px) {
			height: 45px;
		}
	}

	.address-location {
		grid-column: 1/4;
		grid-row: 1;
		text-align: left;

		@media (max-width: 600px) {
			font-family: font(demi);
			text-align: left;
		}

		&-2 {
			grid-column: 2/4;
			grid-row: 1;
		}
	}

	.address-actions-wrapper {
		align-items: baseline;
		display: flex;
	}

	.action-btn {
		margin: 0 5px;
		width: 2rem;
	}

	.section-title {
		font-family: font(bold);
		font-size: size(large);
		margin: 20px 0 20px 40px;
		text-transform: uppercase;

		@media (max-width: 500px) {
			margin-bottom: 20px;
		}
	}
</style>
