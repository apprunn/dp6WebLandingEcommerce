<template>
	<div>
		<div id="alignet"></div>
		<button type="button" @click="checkout">Alignet</button>
	</div>
</template>
<script>
import { mapGetters } from 'vuex';

function checkout() {
	this.key = 'some key';
	this.mountJs();
}

function mountStyles() {
	const Styles = document.createElement('link');
	Styles.setAttribute('href', this.dev.style);
	Styles.setAttribute('type', 'text/css');
	Styles.setAttribute('rel', 'stylesheet');
	const body = document.querySelector('body');
	body.appendChild(Styles);
}

function mountJs() {
	const Script = document.createElement('script');
	Script.setAttribute('src', this.dev.js);
	Script.setAttribute('type', 'text/javascript');
	Script.setAttribute('rel', 'stylesheet');
	Script.onload = () => {
		this.mountStyles();
		this.flexCaptureInit(); // esta información la debe retornar backend
	};
	const body = document.querySelector('body');
	body.appendChild(Script);
}

function flexCaptureInit() {
	const payload = {
		action: 'authorize',
		transaction: {
			currency: '604',
			amount: 1234,
			meta: {
				internal_operation_number: this.getOrderInfo.id,
				description: 'Descripcion de la transaccion',
				additional_fields: {
					reserverd1: 'Prueba valor reservado 1',
				},
			},
		},
		address: {
			billing: {
				first_name: 'Juan',
				last_name: 'Perez',
				email: 'juan.perez@email.com',
				phone: {
					country_code: 51,
					subscriber: '987654321',
				},
				location: {
					line_1: 'Mi casa',
					line_2: 'Mi casa',
					city: 'LIMA',
					state: 'LIMA',
					country: 'PE',
					zip_code: '18',
				},
			},
			shipping: {},
		},
		card_holder: [
			{
				first_name: 'Juan',
				last_name: 'Perez',
				email_address: 'juan.perez@email.com',
				identity_document_country: 'PE',
				identity_document_type: 'DNI',
				identity_document_identifier: '87654321',
			}],
	};
	const capture = new window.FlexCapture({
		key: this.key,
		payload,
		additionalFields: [],
	});
	capture.init(document.querySelector('#alignet'), (response) => {
		console.log('response', response);
	});
}

function data() {
	return {
		dev: {
			style: 'https://alignet-flex-demo.s3.amazonaws.com/css/flex-capture.css',
			js: 'https://alignet-flex-demo.s3.amazonaws.com/flex-capture.min.js',
		},
		key: '',
		prod: {
			style: 'https://d23b52o2im4p82.cloudfront.net/css/flex-capture.css',
			prod: 'https://d23b52o2im4p82.cloudfront.net/flex-capture.min.js',
		},
	};
}

export default {
	name: 'alignet',
	computed: {
		...mapGetters([
			'getOrderInfo',
		]),
	},
	data,
	methods: {
		checkout,
		flexCaptureInit,
		mountJs,
		mountStyles,
	},
};
</script>
<style lang="scss" scoped>

</style>