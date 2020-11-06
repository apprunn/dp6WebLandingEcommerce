
import { Yape } from '@/shared/enums/depositPayment';
import { mapGetters } from 'vuex';

const YapeComponent = () => import('@/components/order/yape-component');

function yapeUrlImage() {
	const { urlImage } = this.deposits.find(d => d.name === Yape) || {};
	return urlImage;
}

function yapeProps() {
	const urlImage = this.yapeUrlImage || '';
	const amount = (this.getTotalToBuy - this.discount) + this.getShippingCost;
	return { urlImage, amount };
}

function discount() {
	const percentage = this.user.discount;
	const amount = this.getTotalToBuy * (Number(percentage) / 100);
	return Number(amount.toFixed(2));
}

export default {
	name: 'deposit-payments',
	computed: {
		...mapGetters([
			'getShippingCost',
			'getTotalToBuy',
			'user',
		]),
		discount,
		yapeUrlImage,
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
			[Yape]: h(YapeComponent, { props: this.yapeProps }),
		};
		let selectedPaymentMethods = [];
		this.deposits.forEach((t) => {
			const { name } = t;
			selectedPaymentMethods = selectedPaymentMethods.concat(options[name]);
		});
		return h(
			'div',
			{
				style: {
					display: 'grid',
					gridGap: '10px',
					gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 180px))',
				},
			},
			selectedPaymentMethods);
	},
};
