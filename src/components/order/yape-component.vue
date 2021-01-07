<template>
	<div
		:class="[
			'yape-main-container',
			{ active: show },
			{ 'yape-in-summary': !isPaymentPage }
		]"
	>

		<button
			v-if="isPaymentPage"
			data-cy="yape-button"
			type="button"
			class="yape-btn"
			:style="`border:1px solid ${globalColors.base}`"
			@click="selectYape"
		>
			<span class="yape-btn-content">Pague con: </span>
			<img
				src="https://lh3.googleusercontent.com/y5S3ZIz-ohg3FirlISnk3ca2yQ6cd825OpA0YK9qklc5W8MLSe0NEIEqoV-pZDvO0A8=s180-rw"
				alt="logo_yape"
			>
		</button>
		<div v-else class="yape-logo-message" data-cy="yape-in-summary">
			<div class="logo-yape">
				<img
					src="https://lh3.googleusercontent.com/y5S3ZIz-ohg3FirlISnk3ca2yQ6cd825OpA0YK9qklc5W8MLSe0NEIEqoV-pZDvO0A8=s180-rw"
					alt="logo_yape"
				>
			</div>
			<h3
				class="mb-3 mt-3 yape-logo-message-notification"
			>Recuerda que debes cargar el comprobante de pago en el detalle de este pedido.</h3>
			<h3
				class="yape-logo-message-voucher-loading"
			>Visita tu: Perfil de usuario, Mis Pedidos, busca este pedido y carga el comprobante</h3>
		</div>

		<div
			:class="['yape-modal-container', { active: show }]"
			data-cy="yape-qr-container"
		>
			<div class="modal-qr">
				<img :src="urlImage" alt="yape_qr">
			</div>
			<div v-if="yapeName || yapePhone" class="yape-data">
				<h3 :style="`color: ${globalColors.primary}`">Datos YAPE:</h3>
				<span v-if="yapeName">Nombre: {{yapeName}}</span>
				<span v-if="yapePhone">Telefono: {{yapePhone}}</span>
			</div>
		</div>
		
	</div>
</div>
</template>
<script>
import appInput from '@/components/shared/inputs/app-input';

function created() {
	this.isPaymentPage = this.$route.meta.step === 3;
	this.show = !this.isPaymentPage;
}

function selectYape() {
	this.show = !this.show;

	if (this.show) {
		const yapeData = {
			walletNumber: this.yapePhone,
			walletQR: this.urlImage,
		};

		this.$store.dispatch('setAdditionalInformation', yapeData);
		this.$store.dispatch('setWayPaymentDetailCode', this.code);
	} else {
		this.$store.dispatch('setAdditionalInformation', null);
		this.$store.dispatch('setWayPaymentDetailCode', null);
	}
}

function data() {
	return {
		isPaymentPage: false,
		show: false,
	};
}
export default {
	name: 'yape-component',
	components: {
		appInput,
	},
	created,
	data,
	methods: {
		selectYape,
	},
	props: {
		code: {
			default: '',
			type: String,
		},
		urlImage: {
			required: true,
			type: String,
		},
		yapePhone: {
			default: '',
			type: String,
		},
		yapeName: {
			default: '',
			type: String,
		},
	},
};
</script>
<style lang="scss" scoped>
.yape-btn {
	align-items: center;
	background-color: white;
	border-radius: 12px;
	display: flex;
	justify-content: space-between;
	padding: 10px 20px;
	transition: background-color, color 150ms ease-in-out;
	width: 180px;

	.yape-btn-content {
		font-family: font(bold);
		font-size: size(large);
	}

	img {
		border-radius: 50%;
		height: 45px;
		width: 45px;
	}

	&:hover {
		background-color: color(yape);
		color: white;
	}
}

.yape-modal-container {
	align-items: center;
	background-color: white;
	border-radius: 10px;
	display: flex;
	padding: 30px;
	padding-right: 0px;
	opacity: 0;
	transition-duration: 300ms;
	transition-property: opacity;
	transition-delay: 300ms;

	&.active {
		opacity: 1;
	}

	.modal-qr {
		align-items: center;
		border: 2px solid color(yape);
		border-radius: 28px;
		display: flex;
		height: 230px;
		justify-content: center;
		margin: 25px auto;
		width: 220px;

		img {
			height: 100%;
			width: 100%;
		}
	}
}

.yape-main-container {
	align-items: flex-start;
	display: flex;
	justify-content: flex-start;
	margin-top: 3rem;
	max-height: 6rem;
	overflow: hidden;
	transition-duration: 500ms;
	transition-property: max-height;

	&.active {
		max-height: 22rem;
	}
}
.yape-data {
	border-radius: 5px;
	border: 1px solid color(border);
	font-family: font(bold);
	font-size: size(small);
	margin-left: 2rem;
	padding-bottom: 2rem;
	padding-left: 1rem;
	padding-right: 1rem;
	padding-top: 2rem;

	h3 {
		margin-bottom: 1rem;
		text-align: center;
	}
}

.logo-yape {
	border-radius: 50%;
	height: 5rem;
	overflow: hidden;
	width: 5rem;

	img {
		height: 100%;
		object-fit: contain;
		width: 100%;
	}
}

.yape-in-summary {
	color: color(dark);
	justify-content: center;
	padding-left: 1rem;
	padding-right: 1rem;

	.yape-logo-message {
		font-family: font(bold);
		font-size: size(small);
		max-width: 28rem;

		h3 {
			border-radius: 0.5rem;
			padding: 1rem;
		}

		&-notification {
			background-color: rgba($yape, 0.1);
			border: 2px solid color(yape);
			color: color(yape);
		}
		&-voucher-loading {
			background-color: rgba($yapeSecondary, 0.1);
			border: 2px solid color(yapeSecondary);
			color: color(yapeSecondary);
		}
	}

}
</style>
