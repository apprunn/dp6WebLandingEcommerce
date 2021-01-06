
import { Yape } from '@/shared/enums/depositPayment';
import { mapGetters } from 'vuex';
import { getDeeper } from '@/shared/lib';

const YapeComponent = () => import('@/components/order/yape-component');

function yapeUrlImage() {
	return getDeeper('settings.billeters.yape.imageQR')(this.getCommerceData);
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
		yapeUrlImage,
	},
	props: {
		deposits: {
			required: true,
			type: Array,
		},
	},
	render(h) {
		const options = {
			[Yape]: h(YapeComponent, { props: { urlImage: this.yapeUrlImage } }),
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
					display: 'block',
					gridGap: '10px',
					gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 180px))',
				},
			},
			selectedPaymentMethods);
	},
};
