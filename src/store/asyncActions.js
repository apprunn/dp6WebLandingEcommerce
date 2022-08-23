import { compose, isEmpty, setNewProperty, map } from '@/shared/lib';
import helper from '@/shared/helper';

const PAGE_TITLE = process.env.PAGE_TITLE;

function updateProducts(products, priceListId) {
	return products.map(
		compose(
			setNewProperty('price', product => helper.setPrices(product, priceListId, 'price')),
			setNewProperty('priceDiscount', product => helper.setPrices(product, priceListId, 'priceDiscount')),
			setNewProperty('createdAt', ({ createdAt }) => helper.formatDate(createdAt)),
		),
	);
}

const asyncActions = {
	LOAD_PRODUCTS: async ({ commit, getters, state }, { context, params = {} }) => {
		const request = [];
		commit('LOADING_PRODUCTS', true);
		const completeParams = Object.assign({}, getters.productParams, params);
		// if (state.token) {
		// 	request.push(
		// 		process.env.PRODUCTS_READ_REPORT ?
		// 		context.$httpProductsRead.get('products-public', { params: completeParams }) :
		// 		context.$httpProducts.get('products-public', { params: completeParams }),
		// 	);
		// } else {
		// 	request.push(
		// 		process.env.PRODUCTS_READ_REPORT ?
		// context.$httpProductsRead.get('products-public', { params: completeParams }) :
		// 			context.$httpProducts.get('products-public', { params: completeParams }),
		// 	);
		// }
		request.push(
			context.$httpProductsPublic.get('products-public', { params: completeParams }),
		);
		const [{ data: products, headers }] = await Promise.all(request);
		const user = JSON.parse(localStorage.getItem('ecommerce::ecommerce-user')) || [];
		const commercePriceListId = user && user.salPriceListId ? user.salPriceListId :
			getters.getCommerceData.settings.salPriceListId;
		const setUpDateInProducts = updateProducts(products, commercePriceListId);
		let newProducts = null;
		debugger;
		if (setUpDateInProducts.length > 20) {
			newProducts = [].concat(state.products.list, setUpDateInProducts);
		} else {
			newProducts = [].concat(setUpDateInProducts);
		}
		// const newProducts = [].concat(state.products.list, setUpDateInProducts);
		commit('LOADING_PRODUCTS', false);
		commit('SET_PRODUCTS', newProducts);
		commit('LAST_PAGE', headers);
	},
	LOAD_RELATED_PRODUCTS: async ({ commit, getters }, { context, id }) => {
		const url = `products-public/${id}/related`;
		const { data: products } = process.env.PRODUCTS_READ_REPORT ?
			await context.$httpProductsReadPublic.get(url) : await context.$httpProductsPublic.get(url);
		const commercePriceListId = getters.getCommerceData.settings.salPriceListId;
		const updatedProducts = updateProducts(products, commercePriceListId);
		commit('SET_RELATED_PRODUCTS', updatedProducts);
	},
	SET_FAVORITE_FLAG: async ({ commit, state }, { context, product }) => {
		const url = `products/favorite/${product.id}`;
		const body = {
			isFavorite: !product.flagFavorite,
		};
		if (state.token) {
			await context.$httpProducts.post(url, body);
		} else {
			const message = {
				text: 'Debe iniciar sesión para agregar a favoritos',
				isVisible: true,
				color: 'error',
			};
			commit('showSnackBar', message);
		}
	},
	CREATE_ORDER: async (store, { context, body }) => {
		const url = 'orders';
		const { data: order } = await context.$httpSales.post(url, body);
		await asyncActions.GET_ORDER_INFO(store, { context, id: order.id });
	},
	UPDATE_ORDER: async (store, { context, id, body }) => {
		const url = `orders/${id}`;
		const { data: order } = await context.$httpSales.patch(url, body)
			.catch((error) => {
				if (error.status === 400) {
					if (error.data.message === 'NO_UPDATE_BECAUSE_ORDER_FINALIZED') {
						store.commit('EMPTY_CAR');
						store.dispatch('SET_DEFAULT_VALUES');
						context.goTo('page-home');
					}
				}
			});
		await asyncActions.GET_ORDER_INFO(store, { context, id: order.id });
	},
	CANCEL_ORDER: async (store, { context, id }) => {
		const url = `orders/${id}/cancel`;
		await context.$httpSales.patch(url);
	},
	GET_ORDER_INFO: async (store, { context, id }) => {
		const url = `orders/${id}?summary=true`;
		const { data: order } = await context.$httpSales.get(url);
		localStorage.setItem('ecommerce-order', JSON.stringify(order));
		localStorage.setItem('ecommerce-order-state', JSON.stringify(order));
		store.dispatch('getOrderData', order);
	},
	LOAD_DEPARTMENTS: async ({ commit }, context) => {
		commit('SET_IS_TOOGLE_DP', true);
		const url = 'province';
		await new Promise(resolve => setTimeout(resolve, 1000));
		const { data: departments } = await context.$httpSales.get(url);
		commit('SET_DEPARTMENTS', departments);
		commit('SET_IS_TOOGLE_DP', false);
	},
	LOAD_PROVINCES: async ({ commit }, { context, provinceId }) => {
		commit('SET_IS_TOOGLE_PR', true);
		const url = `cities/${provinceId}`;
		await new Promise(resolve => setTimeout(resolve, 1000));
		const { data: cities } = await context.$httpSales.get(url);
		commit('SET_PROVINCES', cities);
		commit('SET_IS_TOOGLE_PR', false);
	},
	LOAD_DISTRICTS: async ({ commit }, { context, cityId }) => {
		commit('SET_IS_TOOGLE_PS', true);
		const url = `parish/${cityId}`;
		await new Promise(resolve => setTimeout(resolve, 1000));
		const { data: parish } = await context.$httpSales.get(url);
		commit('SET_DISTRICTS', parish);
		commit('SET_IS_TOOGLE_PS', false);
	},
	LOAD_CATEGORIES: async ({ commit, getters }, { context }) => {
		const { id } = getters.getCommerceData;
		const url = `e-categories-public?commerceId=${id}`;
		let { data: response } = await context.$httpProductsPublic.get(url);
		response = response.map((r) => {
			const newCategory = { ...r };
			newCategory.select = false;
			newCategory.hover = false;
			return newCategory;
		});
		commit('SET_CATEGORIES', response);
	},
	LOAD_USER_ADDRESS: async ({ commit }, { context, params }) => {
		const { data: address, headers } = await context.$httpSales.get('customers-address', { params });
		commit('SET_USER_ADDRESS', address);
		commit('SET_DIRECTIONS', address);
		return Number(headers['x-last-page']);
	},
	LOAD_DIRECTIONS: async ({ commit }, context) => {
		const url = 'customers-address';
		const { data: directions } = await context.$httpSales.get(url);
		commit('SET_DIRECTIONS', directions);
	},
	LOAD_WAREHOUSES: async ({ commit }, context) => {
		const url = 'warehouse-public';
		const { data: warehouses } = await context.$httpProductsPublic.get(url);
		commit('SET_WAREHOUSES', warehouses);
	},
	NEW_ADDRESS: async ({ commit }, { context, newAddress }) => {
		await context.$httpSales.post('customers-address', newAddress);
		asyncActions.LOAD_USER_ADDRESS(
			{ commit },
			{ context, params: { page: 1, limit: 5 } });
	},
	SET_FAVORITE_ADDRESS: async (state, { context, body, id }) => {
		await context.$httpSales.patch(`customers-address/${id}`, body);
	},
	SET_STATE_ORDERS: async (state, { context, body, id }) => {
		const { data: numberOrder } = await context.$httpSales.patch(`orders/${id}/update-state`, body);
		localStorage.setItem('order-state-order', JSON.stringify(numberOrder));
	},
	DELETE_ADDRESS: async (state, { context, id }) => {
		await context.$httpSales.delete(`customers-address/${id}`);
	},
	LOAD_ORDERS_STATUS: async ({ commit }, context) => {
		const { data: orderStatus } = await context.$httpSales.get('order-states');
		commit('SET_ORDER_STATES', orderStatus);
	},
	LOAD_ORDERS: async ({ commit }, { context, params }) => {
		const url = 'orders';
		const { data: orders, headers } = await context.$httpSales.get(url, { params });
		const setUpDateInOrders = orders.map(
			setNewProperty('createdAt', ({ createdAt }) => helper.formatDate(createdAt)),
		);
		commit('SET_ORDERS', setUpDateInOrders);
		return Number(headers['x-last-page']);
	},
	LOAD_ORDER_DETAILS: async ({ commit }, { context, orderId }) => {
		const url = `orders/${orderId}?summary=true`;
		const { data: orderDetails } = await context.$httpSales.get(url);
		orderDetails.createdAt = helper.formatDate(orderDetails.createdAt);
		commit('SET_ORDER_INFO', orderDetails);
	},
	UPDATE_USER_DATA: async (state, { context, body }) => {
		const url = 'customers-public';
		await context.$httpSales.patch(url, body);
		asyncActions.LOAD_USER_DATA(state, context);
	},
	LOAD_USER_DATA: async ({ commit }, context) => {
		const url = 'customers/current';
		const { data: user } = await context.$httpSales.get(url);
		context.setLocalData('ecommerce::ecommerce-user', user);
		commit('setUser', user);
	},
	SET_CURRENCY_DEFAULT: async ({ commit }, context) => {
		const aclCode = process.env.ACL_COMPANY_CODE;
		const url = `companies/${aclCode}/acl`;
		const { data: res } = await context.$httpSales.get(url);
		context.setLocalData(`${process.env.STORAGE_USER_KEY}::currency-default`, res.currencyDefault);
		context.setLocalData(`${process.env.STORAGE_USER_KEY}::country`, res.country.countryCode);
		commit('SET_CURRENCY_DEFAULT', res.currencyDefault);
	},
	LOAD_FILTERS: async ({ commit }, context) => {
		const { data: filters } = process.env.SALES_READ_REPORT ?
			await context.$httpProductsReadPublic.get('filters-public') : await context.$httpProductsPublic.get('filters-public');
		if (filters.length > 0) {
			const allFilter = { id: null, title: 'Todos', urlImage: filters[0].urlImage };
			const newFilters = [].concat(allFilter, filters);
			const updatedFilters = map(setNewProperty('select', (filter, index) => index === 0), newFilters);
			commit('UPDATE_FILTERS', updatedFilters);
		} else {
			commit('UPDATE_FILTERS', filters);
		}
	},
	LOAD_FAVORITES_PRODUCTS: async ({ commit, getters }, { context, params }) => {
		const url = 'products/favorites?favorite=true';
		const { data: favorites, headers } = await context.$httpProducts.get(url, { params });
		const commercePriceListId = getters.getCommerceData.settings.salPriceListId;
		const setUpDateInProducts = updateProducts(favorites, commercePriceListId);
		commit('SET_FAVORITES', setUpDateInProducts);
		return Number(headers['x-last-page']);
	},
	LOAD_BANNERS: async ({ commit, getters }, context) => {
		const { id } = getters.getCommerceData;
		const url = `banners-public?commerceId=${id}`;
		const { data: banners } = await context.$httpProductsPublic.get(url);
		commit('SET_BANNERS', banners);
	},
	LOAD_COMMERCE_INFO: async ({ commit, dispatch }, context) => {
		const url = `com-ecommerce-companies/${process.env.COMMERCE_CODE}/public`;
		const { data: commerceData } = process.env.SALES_READ_REPORT ?
			await context.$httpSalesReadPublic.get(url) : await context.$httpSalesPublic.get(url);
		context.setLocalData(`${process.env.STORAGE_USER_KEY}::ecommerce-data`, commerceData);
		commit('SET_COMMERCE_DATA', commerceData);
		commit('SET_FLAG_NOT_VALID_EMAIL_USER', commerceData.settings.flagNotValidEmailUser);
		dispatch('SET_ECOMMERCE_THEME', commerceData.settings.theme);
		dispatch('setFlagGrouper', commerceData.settings.flagGrouper);
		const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
		link.type = 'image/x-icon';
		link.rel = 'shortcut icon';
		link.href = commerceData.favicon.value;
		link.sizes = '16x16';
		document.getElementsByTagName('head')[0].appendChild(link);
		const pageTitle = document.getElementsByTagName('title');
		const backUp = 	commerceData.name || 'AppRunn SAC';
		const title = PAGE_TITLE === 'undefined' ? backUp : PAGE_TITLE;
		pageTitle[0].innerHTML = title;
	},
	MAKE_ORDER: async ({ dispatch, getters, commit }, { flagFinish, context }) => {
		commit('SET_IS_TOOGLE_BTN', true);
		const body = helper.buildOrderBody(flagFinish, getters);
		body.additionalInfo = {
			changeAmount: getters.getAmountBuyWithShipp,
		};
		const orderExist = !isEmpty(getters.getOrderInfo);
		const dispatchName = orderExist ? 'UPDATE_ORDER' : 'CREATE_ORDER';
		const dispatchObj = orderExist
			? { context, id: getters.getOrderInfo.id, body }
			: { context, body };
		await dispatch(dispatchName, dispatchObj);
		const page = flagFinish ? 'buy-summary' : 'buy-payment';
		const classPage = flagFinish ? 'summary-content-container' : 'section-container';
		commit('SET_IS_TOOGLE_BTN', false);
		commit('SET_TOTALAMOUNT_BUY_SHIPP', 0);
		context.goTo(page);
		setTimeout(() => {
			context.scrollTo(classPage, 800, false);
		}, 900);
	},
	LOAD_PAYMENT_TRANSACTIONS: async ({ commit }, { context, codeGateway, page }) => {
		const url = 'payment-gateway';
		const params = {
			codeGateway,
			commerceCode: process.env.COMMERCE_CODE,
			page,
		};
		const { data: response, headers } = await context.$httpSales.get(url, { params });
		commit('SET_ONLINE_TRANSACTIONS', response);
		return Number(headers['x-last-page']);
	},
	getCurrentTransactions: async (_, { context, gatewayCode }) => {
		const url = `payment-gateway/${gatewayCode}/list-order`;
		const { data: response } = await context.$httpSales.get(url);
		return response;
	},
};

export default asyncActions;
