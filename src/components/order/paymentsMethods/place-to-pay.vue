<template>
<div>
	<div class="conditions">
		<v-checkbox
			class="check"
			v-model="checkbox"
		>
		</v-checkbox>
		<span>Acepto los <button type="button" @click="conditionsAndTermsLink">términos y condiciones</button></span>
	</div>
	<div class="placetopay-styles-container">
		<button
			:disabled="!checkbox"
			type="button"
			class="placetopay-styles"
			@click="linkGenerator"
		>
			<img :src="imgLink" alt="imagen de placetopay">
		</button>
	</div>
	<div class="credit-card-container">
		<img src="/static/img/creditCards/Visa_Inc._logo.svg.png" alt="logo_visa">
		<img src="/static/img/creditCards/mastercard.svg" alt="logo_mastercard">
		<img src="/static/img/creditCards/american.svg" alt="logo_american">
		<img src="/static/img/creditCards/dinners.svg" alt="logo_dinner">
		<img src="/static/img/creditCards/discover.png" alt="logo_discover">
	</div>
</div>
</template>
<script>
import { mapActions, mapState } from 'vuex';

function conditionsAndTermsLink() {
	const findIt = this.help.find((h) => {
		const name = this.normalize(h.name);
		return name === 'terminos y condiciones';
	});
	const [item] = findIt.section;
	const link = findIt;
	const newItem = item.name.split(' ').join('-');
	const newLink = link.name.split(' ').join('-');
	this.$router.push(`/ayuda/apartado/${newItem}/seccion/${newLink}`);
}

function normalize(str) {
	return str.toLowerCase().normalize('NFD')
		.replace(/([aeio])\u0301|(u)[\u0301\u0308]/gi, '$1$2')
		.normalize();
}

async function linkGenerator() {
	const url = `payment-gateway/${this.code}/checkout`;
	const body = {
		categoryCode: this.categoryCode,
		commerceCode: process.env.COMMERCE_CODE,
		ipAddress: this.ipAddress,
		orderId: this.orderId,
		uri: this.uri,
	};
	try {
		const { data: response } = await this.$httpSales.post(url, body);
		this.SET_DEFAULT_VALUES();
		this.removeProductFromLS();
		window.open(response.data.url, '_self');
	} catch (error) {
		this.showNotification(
			'Ocurrió un error al generar el enlace de pago. Recargue y vuelva a intentarlo por favor',
			'error',
		);
		console.log(error);
	}
}

function data() {
	return {
		checkbox: false,
		link: null,
	};
}

export default {
	name: 'placetopay',
	computed: {
		...mapState({
			help: state => state.commerce.helperCenter,
		}),
	},
	data,
	methods: {
		...mapActions([
			'SET_DEFAULT_VALUES',
			'removeProductFromLS',
		]),
		conditionsAndTermsLink,
		linkGenerator,
		normalize,
	},
	props: {
		categoryCode: {
			type: String,
			required: true,
		},
		code: {
			type: String,
			required: true,
		},
		imgLink: {
			type: String,
			required: true,
		},
		ipAddress: {
			type: String,
			required: true,
		},
		orderId: {
			type: Number,
			required: true,
		},
		uri: {
			type: String,
			required: true,
		},
	},
};
</script>
<style lang="scss" scoped>
.placetopay-styles-container {
	border: 1px solid #E75A32;
	font-weight: bold;
	padding: 0.5rem 1.5rem;
	transition-duration: 250ms;
	max-width: fit-content;

	.placetopay-styles {
		align-items: center;
		background-color: white;
		display: flex;
		justify-content: center;
		text-decoration: none;
		&[disabled] {
			cursor: not-allowed;
			opacity: 0.4;
		}
	}
	&:hover {
		box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
		transform: scale(1.05);
	}
}

.conditions {
	align-items: center;
	display: flex;

	.check {
		margin-right: 1rem;
		max-width: 2rem;
	}

	button {
		color: color(terciary);
		text-decoration: underline;
	}
}

.credit-card-container {
	display: flex;
	height: 1rem;
	margin-top: 1rem;

	img {
		height: 100%;
		margin: 0 0.25rem;
	}
}
</style>