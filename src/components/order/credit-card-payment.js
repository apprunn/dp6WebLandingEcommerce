import { mapGetters } from 'vuex';
import { LINK, BUTTON } from '@/shared/enums/paymentStrategy';
import {
	leadgods, niubiz, datafast, pagoplux, pagopluxLink,
	xchange, paymentez, placetopay, alignet, mercadopago, mercadopagoMp,
} from '@/shared/enums/gatewayCodes';

const Niubiz = () => import('@/components/order/paymentsMethods/niubiz');
const Paymentez = () => import('@/components/order/paymentsMethods/paymentez');
const DataFast = () => import('@/components/order/paymentsMethods/data-fast');
const PagoPlux = () => import('@/components/order/paymentsMethods/pago-plux');
const PagoPluxLink = () => import('@/components/order/paymentsMethods/pago-plux-link');
const Xchange = () => import('@/components/order/paymentsMethods/xchange');
const LeadGods = () => import('@/components/order/paymentsMethods/leadgods');
const PlaceToPay = () => import('@/components/order/paymentsMethods/place-to-pay');
const Alignet = () => import('@/components/order/paymentsMethods/alignet');
const MercadoPago = () => import('@/components/order/paymentsMethods/mercadopago');

/**
 * @param {object-function} h render function
 * @param {array} gateway - arreglo con enlaces de pago configurados para el comercio
*/
function paymentLinkCreator(h, gateway, ipAddress) {
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
						ipAddress,
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
const paymentButtonCreator = (h, gateway, ipAddress) => {
	const buttonOptions = {
		[niubiz]: Niubiz,
		[paymentez]: Paymentez,
		[datafast]: DataFast,
		[pagoplux]: PagoPlux,
		[xchange]: Xchange,
		[alignet]: Alignet,
		[mercadopago]: MercadoPago,
		[mercadopagoMp]: MercadoPago,
	};
	let selectedButtons = [];
	gateway.forEach((t) => {
		const { code, urlImage, code: gatewayCode } = t;
		const paymentBtns = h(
			buttonOptions[code],
			{
				props: {
					code: gatewayCode,
					img: urlImage,
					ipAddress,
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
			'data-cy': 'online-payments',
			style: {
				borderTop: '1px solid #e6e6e6',
				paddingTop: '1rem',
			},
		},
		[btnTitle, btns],
	);
};

export default {
	computed: {
		...mapGetters([
			'getOrderInfo',
		]),
	},
	methods: {
		paymentButtonCreator,
		paymentLinkCreator,
	},
	props: {
		ip: {
			required: true,
			type: String,
		},
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
			const l = this.paymentLinkCreator(h, link.gateway, this.ip);
			paymentsMethos.push(l);
		}
		const button = this.paymentsTypes.find(p => p.code === BUTTON);
		if (button) {
			const b = this.paymentButtonCreator(h, button.gateway, this.ip);
			paymentsMethos.push(b);
		}
		return h('div', paymentsMethos);
	},
};
