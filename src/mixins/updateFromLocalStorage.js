
import helper from '@/shared/helper';

function mounted() {
	this.loadDataFromLocalStorage();
}

async function loadDataFromLocalStorage() {
	const user = this.getLocalStorage('ecommerce::ecommerce-user');
	const order = this.getLocalStorage('ecommerce-order');
	const currencyDefault = this.getLocalStorage('ecommerce::currency-default');
	const storageProducts = this.getLocalStorage('ecommerce::product-select');
	const token = helper.getLocalToken();
	if (token) {
		this.$store.dispatch('setToken', token);
		const { data: response } = await this.$httpSales.get('customers/current');
		console.log('b');
		helper.setLocalData('ecommerce-user', response);
		this.$store.dispatch('setUser', response);
		this.$userInfo = this.$store.getters.user;
		this.$store.dispatch('LOAD_PRODUCTS', { context: this });
	}
	if (user) {
		this.$store.dispatch('setUser', user);
	}
	if (order) {
		this.$store.dispatch('getOrderData', order);
	}
	if (currencyDefault) {
		this.$store.commit('SET_CURRENCY_DEFAULT', currencyDefault);
	} else {
		this.$store.dispatch('SET_CURRENCY_DEFAULT', this);
	}
	if (storageProducts && storageProducts.length > 0) {
		this.$store.commit('SET_ORDER_DETAILS', storageProducts);
	}
	await Promise.all([
		this.$store.dispatch('LOAD_FILTERS', this),
	]);
}

export default {
	methods: {
		loadDataFromLocalStorage,
	},
	mounted,
};
