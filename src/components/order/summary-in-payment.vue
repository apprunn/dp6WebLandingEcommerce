<template>
	<div class="summary-main-container">
		<div class="summary-grid" name="delivery">
			<img :src="iconSvg.location" alt="ícono de localización">
			<div class="summary-content-delivery">
				<h4 class="summary-title">{{pickUpName}}</h4>
				<span class="">
					<span>{{getResponsibleName}}</span>
					<span class="mx-3">{{labelCountry}}: {{getDni}}</span>
					<span>Teléfono: {{getPhone}}</span>
				</span>
				<span>Dirección: {{getDirection}}</span>
			</div>
		</div>
		<div class="summary-grid summary-grid-method" name="billing" v-if="isNotEmptyBilling">
			<img :src="iconSvg.bill" alt="ícono de factura">
			<div class="summary-content">
				<h4 class="summary-title">Solicitud de Factura</h4>
				<div>
					<span class="mr-3">RUC: {{getRuc}}</span>
					<span>Razón Social: {{getRzSocial}}</span>
				</div>
				<span>Domicilio fiscal: {{getAddress}}</span>
			</div>
		</div>
		<div class="summary-grid summary-grid-method" name="billing" v-if="stepFour">
			<img :src="iconSvg.pay" alt="ícono de factura">
			<div class="summary-content">
				<h4 class="summary-title">Método de pago</h4>
				<div>
					<h5>{{getWayPayment.title}}</h5>
					<div v-if="getWayPayment.code === 'link'" class="link-container">
						<a :href="getWayPayment.payment"
						>{{getWayPayment.payment}}:</a>
					</div>
					<span v-else>{{getWayPayment.payment}}</span>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { getDeeper, isEmpty } from '@/shared/lib';
import { mapGetters } from 'vuex';
import PickUpIn from '@/shared/PickUp';

function isNotEmptyBilling() {
	const customerBill = getDeeper('dataBill')(this.getOrderInfo);
	return !(isEmpty(customerBill));
}

function pickUpName() {
	return getDeeper('pickUpName')(this.getOrderInfo);
}

function getResponsibleName() {
	return getDeeper('responsiblePickUp.name')(this.getOrderInfo);
}

function getDni() {
	return getDeeper('responsiblePickUp.dni')(this.getOrderInfo);
}

function getPhone() {
	return getDeeper('responsiblePickUp.phone')(this.getOrderInfo);
}

function getDirection() {
	if (getDeeper('flagPickUp')(this.getOrderInfo) === PickUpIn.store) {
		return getDeeper('warehouseAddress')(this.getOrderInfo);
	}
	return getDeeper('deliveryAddress.addressLine1')(this.getOrderInfo);
}

function stepFour() {
	return this.$route.meta.step === 4;
}

function getWayPayment() {
	const wayPayment = getDeeper('wayPayment.description')(this.getOrderInfo);
	if (wayPayment) {
		return {
			payment: wayPayment,
			title: '',
		};
	}
	const link = getDeeper('sessionGateway.data.url')(this.getOrderInfo);
	if (link) {
		return {
			code: 'link',
			payment: link,
			title: 'Enlace de pago',
		};
	}
	return 'Recojo en tienda';
}

function getRuc() {
	return getDeeper('dataBill.ruc')(this.getOrderInfo);
}

function getRzSocial() {
	return getDeeper('dataBill.rzSocial')(this.getOrderInfo);
}

function getAddress() {
	return getDeeper('dataBill.address')(this.getOrderInfo);
}

function labelCountry() {
	return getDeeper('company.country.countryCode')(this.user) === 'ECU' ? 'Número de Documento' : 'DNI';
}

function data() {
	return {
		iconSvg: {
			location: '/static/icons/red-localization.svg',
			bill: '/static/icons/red-bill.svg',
			pay: '/static/icons/pay.svg',
		},
	};
}

export default {
	name: 'summary-in-payment',
	computed: {
		...mapGetters([
			'getOrderInfo',
			'user',
		]),
		getAddress,
		getDirection,
		getDni,
		getPhone,
		getResponsibleName,
		getRuc,
		getRzSocial,
		getWayPayment,
		isNotEmptyBilling,
		pickUpName,
		stepFour,
		labelCountry,
	},
	data,
};
</script>
<style lang="scss" scoped>
	.summary-main-container {
		align-items: flex-start;
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
		margin: 0 30px;

		@media (min-width: 750px) {
			justify-content: space-around;
		}
	}

	.summary-grid {
		align-items: flex-start;
		color: color(dark);
		display: grid;
		font-family: font(regular);
		grid-column-gap: 8px;
		grid-template-columns: 15px 1fr;
		max-width: 380px;
	}

	.summary-title {
		font-family: font(bold);
	}

	.summary-content-delivery {
		align-items: flex-start;
		display: grid;
		grid-template-rows: 22px 1fr 1fr;
		margin-bottom: 20px;

		@media (max-width: 600px) {
		}
	}

	.bill-data {

		@media (max-width: 600px) {
			display: flex;
			flex-direction: column;
		}
	}

	.link-container {
		max-width: 150px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>