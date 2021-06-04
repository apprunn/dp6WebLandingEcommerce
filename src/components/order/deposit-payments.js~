
import { Yape } from '@/shared/enums/depositPayment';
import { mapGetters } from 'vuex';
import { getDeeper } from '@/shared/lib';

const YapeComponent = () => import('@/components/order/yape-component');

function yapeData() {
	return getDeeper('settings.billeters.yape')(this.getCommerceData);
}

function buildProps(name, code) {
	const propsOptions = {
		[Yape.name]: this.yapeProps.bind(this, code),
	};
	return propsOptions[name].call();
}

function yapeProps(code) {
	return {
		code,
		urlImage: this.yapeData.imageQR,
		yapeName: this.yapeData.name,
		yapePhone: this.yapeData.phone,
	};
}

export default {
	name: 'deposit-payments',
	computed: {
		...mapGetters([
			'getCommerceData',
			'getShippingCost',
			'getTotalToBuy',
			'user',
		]),
		yapeData,
	},
	methods: {
		buildProps,
		yapeProps,
	},
	props: {
		deposits: {
			required: true,
			type: Array,
		},
	},
	render(h) {
		const options = {
			[Yape.name]: YapeComponent,
		};
		let selectedPaymentMethods = [];
		const that = this;
		this.deposits.forEach((t) => {
			const { name, code } = t;
			const props = that.buildProps(name, code);

			selectedPaymentMethods = selectedPaymentMethods.concat(
				h(options[name], { props }),
			);
		});
		return h(
			'div',
			{
				style: {
					display: 'block',
					gridGap: '10px',
					gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 180px))',
				},
			},
			selectedPaymentMethods);
	},
};
