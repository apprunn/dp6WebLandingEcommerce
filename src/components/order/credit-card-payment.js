import { mapGetters } from 'vuex';
import { LINK, BUTTON } from '@/shared/enums/paymentStrategy';
import {
	leadgods, visa, datafast, pagoplux, pagopluxLink, xchange, paymentez, placetopay, alignet,
} from '@/shared/enums/gatewayCodes';

const VisaPeru = () => import('@/components/order/paymentsMethods/visa-payment');
const Paymentez = () => import('@/components/order/paymentsMethods/paymentez');
const DataFast = () => import('@/components/order/paymentsMethods/data-fast');
const PagoPlux = () => import('@/components/order/paymentsMethods/pago-plux');
const PagoPluxLink = () => import('@/components/order/paymentsMethods/pago-plux-link');
const Xchange = () => import('@/components/order/paymentsMethods/xchange');
const LeadGods = () => import('@/components/order/paymentsMethods/leadgods');
const PlaceToPay = () => import('@/components/order/paymentsMethods/place-to-pay');
const Alignet = () => import('@/components/order/paymentsMethods/alignet');

function created() {
	this.getClientIp();
}

/**
 * getClientIp - obtiene el ip del computador del cliente
*/
async function getClientIp() {
	try {
		({ data: this.clientIp } = await this.$http.get('https://api.ipify.org'));
	} catch (err) {
		this.showNotification(
			'Ocurrio un error con la ip de origen',
			'error',
		);
	}
}

/**
 * @param {object-function} h render function
 * @param {array} gateway - arreglo con enlaces de pago configurados para el comercio
*/
function paymentLinkCreator(h, gateway) {
	const that = this;
	if (this.getOrderInfo) {
		const orderId = this.getOrderInfo.id;
		const redirectUri = 'perfil/detalle-orden';
		const linkOptions = {
			[leadgods]: LeadGods,
			[placetopay]: PlaceToPay,
			[pagopluxLink]: PagoPluxLink,
		};
		let selectedLinks = [];
		gateway.forEach((t) => {
			const { categoryCode, code, urlImage } = t;
			const paymentLinkComponent = h(
				linkOptions[code],
				{
					props: {
						categoryCode,
						code,
						imgLink: urlImage,
						ipAddress: that.clientIp || '',
						orderId,
						uri: redirectUri,
					},
				},
			);
			selectedLinks = selectedLinks.concat(paymentLinkComponent);
		});
		const links = h(
			'div',
			{
				style: {
					margin: '1rem',
					padding: '1rem 0',
				},
			},
			selectedLinks,
		);
		const linkTitle = h('h3', { style: { marginBottom: '0rem' } }, 'Pagar con link de pago');
		return h('div', [linkTitle, links]);
	}
	return null;
}

/**
 * @param {object-function} h render function
 * @param {array} gateway - arreglo con botones de pago configurados para el comercio
 */
const paymentButtonCreator = (h, gateway) => {
	const buttonOptions = {
		[visa]: VisaPeru,
		[paymentez]: Paymentez,
		[datafast]: DataFast,
		[pagoplux]: PagoPlux,
		[xchange]: Xchange,
		[alignet]: Alignet,
	};
	let selectedButtons = [h(Alignet)];
	gateway.forEach((t) => {
		const { code, urlImage } = t;
		const paymentBtns = h(
			buttonOptions[code],
			{
				props: {
					img: urlImage,
					ipAddress: this.clientIp,
				},
			},
		);
		selectedButtons = selectedButtons.concat(paymentBtns);
	});
	const btns = h(
		'div',
		{
			style: {
				display: 'flex',
			},
		},
		selectedButtons,
	);
	const btnTitle = h('h3', { style: { marginBottom: '1rem' } }, 'Paga ahora');
	return h(
		'div',
		{
			style: {
				borderTop: '1px solid #e6e6e6',
				paddingTop: '1rem',
			},
		},
		[btnTitle, btns],
	);
};

function ipAddress() {
	return this.clientIp;
}

function data() {
	return {
		clientIp: null,
	};
}

export default {
	computed: {
		...mapGetters([
			'getOrderInfo',
		]),
		ipAddress,
	},
	created,
	data,
	methods: {
		getClientIp,
		paymentButtonCreator,
		paymentLinkCreator,
	},
	props: {
		paymentsTypes: {
			required: true,
			type: Array,
		},
	},
	render(h) {
		if (this.paymentsTypes.length === 0) {
			return null;
		}
		const paymentsMethos = [];
		const link = this.paymentsTypes.find(p => p.code === LINK);
		if (link) {
			const l = this.paymentLinkCreator(h, link.gateway);
			paymentsMethos.push(l);
		}
		const button = this.paymentsTypes.find(p => p.code === BUTTON);
		if (button) {
			const b = this.paymentButtonCreator(h, button.gateway);
			paymentsMethos.push(b);
		}
		return h('div', paymentsMethos);
	},
};
