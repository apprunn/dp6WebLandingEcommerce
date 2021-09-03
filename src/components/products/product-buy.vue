<template>
  <div class="product-buy">
		<!-- <div class="container-btn-open" v-if="false">
			<p class="warehouse-null" v-if="openWarehouse">No hay tiendas disponibles</p>
			<button
				data-cy="see-available-warehouse"
				v-if="!openWarehouse && productTypeService"
				:class="[
					isLoading ? 'loading stores' : 'btn-stores',
				]"
				@click="$emit('open-dialog')"
			>Ver tiendas disponibles</button>
		</div> -->
		<div class="container-buttons">
			<quantityButton
				:class="[
					'continer-quantity-button',
					{ 'loading': isLoading },
				]"
				@click="clickQuantity"
				:number="number"
			/>
			<app-button-order
				active
				button-title="¡LO QUIERO!"
				:disabled-order="disabledOrder"
				:class="[
					isLoading ? 'loading' : 'btn',
				]"
				@click="$emit('add-to-car')"
			>
				<div>
					<image-check
						active
						active-color="white"
						class="image-btn"
						:inactive-color="globalColors.primary"
					/>
				</div>
			</app-button-order>
		</div>
	</div>
</template>
<script>
import { mapGetters } from 'vuex';
import quantityButton from '@/components/shared/buttons/quantity-button';
import appButtonOrder from '@/components/shared/buttons/app-button-order';
import imageCheck from '@/components/shared/icons/check-component';
import { getDeeper } from '@/shared/lib';

function clickQuantity(value) {
	this.$emit('click', value);
}

function productTypeService() {
	return getDeeper('typeInfo.code')(this.product) !== 'servicios';
}

export default {
	name: 'product-buy',
	components: {
		quantityButton,
		appButtonOrder,
		imageCheck,
	},
	computed: {
		...mapGetters('loading', [
			'isLoading',
		]),
		productTypeService,
	},
	methods: {
		clickQuantity,
	},
	props: {
		number: Number,
		openWarehouse: false,
		product: {
			required: true,
			type: Object,
		},
		disabledOrder: {
			type: Boolean,
			default: false,
		},
	},
};
</script>
<style lang="scss" scoped>
	.product-buy {
		.btn {
			width: 197px;
		}

		.image-btn {
			margin-right: 12px;
		}

		.btn-stores {
			border-bottom: 1px solid color(dark);
			font-size: size(small);
			margin-bottom: 18px;

			@media screen and (max-width: 996px) {
				margin-bottom: 0px;
			}
		}

		.container-buttons {
			display: flex;

			@media screen and (max-width: 996px) {
				justify-content: center;
				padding: 0 5%;
			}
		}

		.continer-quantity-button {
			margin-right: 17px;
		}
	}

	.container-btn-open{
		@media screen and (max-width: 996px) {
			border: 1px solid color(border);
			padding: 15px;
			margin-bottom: 33px;
			text-align: center;
		}
	}

	.stores {
		margin-bottom: 10px;
	}

	.warehouse-null {
		color: #acaaaa;
		font-family: font(regular);
		font-size: 12px;
	}
</style>
