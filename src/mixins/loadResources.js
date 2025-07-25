import helper from '@/shared/helper';


export default {
	async created() {
		let domains = helper.getLocalData('domains');
		if (!domains) {
			await this.loadDomians();
			domains = helper.getLocalData('domains');

			if (domains) {
				console.log('REFRESCAR');
				window.location.reload();
				return;
			}
		}
		await this.loadCommerceData();
		await this.loadResource();
		await this.loadDataFromLocalStorage();
	},

	methods: {
		loadDomians() {
			return this.$store.dispatch('LOAD_DOMAINS', { context: this });
		},
		loadCommerceData() {
			return this.$store.dispatch('LOAD_COMMERCE_INFO', this);
		},
		loadResource() {
			return [
				this.$store.dispatch('LOAD_BANNERS', this),
				this.$store.dispatch('LOAD_CATEGORIES', { context: this }),
				this.$store.dispatch('LOAD_PRODUCTS', { context: this }),
			];
		},
		async loadDataFromLocalStorage() {
			try {
				const user = this.getLocalStorage('ecommerce::ecommerce-user');
				const order = this.getLocalStorage('ecommerce-order');
				const currencyDefault = this.getLocalStorage('ecommerce::currency-default');
				const storageProducts = this.getLocalStorage('ecommerce::product-select');
				const token = helper.getLocalToken();
				console.log({ token });

				if (token) {
					this.$store.dispatch('setToken', token);
					const { data: response } = await this.$httpSales.get('customers/current');
					console.log({ response });
					helper.setLocalData('ecommerce-user', response);
					this.$store.dispatch('setUser', response);
					this.$userInfo = this.$store.getters.user;
					this.$store.dispatch('LOAD_PRODUCTS', { context: this });
				}
				if (user) this.$store.dispatch('setUser', user);
				if (order) this.$store.dispatch('getOrderData', order);
				if (currencyDefault) this.$store.commit('SET_CURRENCY_DEFAULT', currencyDefault);
				else this.$store.dispatch('SET_CURRENCY_DEFAULT', this);
				if (storageProducts && storageProducts.length > 0) this.$store.commit('SET_ORDER_DETAILS', storageProducts);
				await this.$store.dispatch('LOAD_FILTERS', this);
			} catch (error) {
				console.error(error);
			}
		}
	},
};
