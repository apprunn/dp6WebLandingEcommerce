import Vue from 'vue';
import orderMutations from '@/store/mutations/order';
import geoMutations from '@/store/mutations/geo';
import profileMutations from '@/store/mutations/profile';

function clearUser(state) {
	Vue.set(state, 'token', null);
	Vue.set(state, 'user', null);
}

function setToken(state, token) {
	Vue.set(state, 'token', token);
}

function setStock(state, stock) {
	Vue.set(state, 'stockAvaible', stock);
}

function setUser(state, user) {
	Vue.set(state, 'user', user);
}

function showSnackBar(state, snackbar) {
	Vue.set(state.appConfig, 'snackbar', { ...snackbar });
}

function toggleLoading(state, value) {
	Vue.set(state.appConfig, 'isLoading', value);
}

function UPDATE_POLL_PROGRESS(state, number) {
	Vue.set(state.pollData, 'progress', state.pollData.progress + number);
}

function SET_PRODUCTS(state, products) {
	Vue.set(state.products, 'list', products);
	Vue.set(state, 'originalProducts', products);
}

function SET_PRODUCT_TO_BUY(state, product) {
	const newProduct = { ...product };
	newProduct.quantity = 1;
	Vue.set(state.order, 'products', state.order.products.concat({ ...newProduct }));
}

function SET_ORDER_ID(state, id) {
	Vue.set(state.order, 'id', id);
}

function UPDATE_FLAG_ADD_VOUCHER(state, flag) {
	Vue.set(state.profile, 'flagAddVoucher', flag);
}

function SET_CATEGORIES(state, categories) {
	localStorage.setItem('ecommerce::categories', JSON.stringify(categories));
	Vue.set(state, 'categories', [...categories]);
}

function SET_ORDER_TOTAL(state, total) {
	Vue.set(state.order, 'total', total);
}

function UPDATE_PRODUCTS_SELECTED(state, products) {
	if (products) {
		localStorage.setItem('ecommerce::product-select', JSON.stringify(products));
		Vue.set(state.order, 'products', [...products]);
	} else {
		localStorage.removeItem('ecommerce::product-select');
		Vue.set(state.order, 'products', []);
	}
}

function SET_WAREHOUSES(state, warehouses) {
	const newWarehouse = [state.warehouses[0]].concat(warehouses);
	Vue.set(state, 'warehouses', newWarehouse);
}

function SET_DIRECTIONS(state, directions) {
	const addressDefault = { id: 0, addressLine1: 'Nueva dirección', name: 'Nueva dirección' };
	Vue.set(state, 'directions', [].concat(addressDefault, directions));
}

function UPDATE_FILTERS(state, filters) {
	Vue.set(state, 'filters', filters);
}

function SET_CURRENCY_DEFAULT(state, currency) {
	Vue.set(state, 'currencyDefault', currency);
}

function SET_BANNERS(state, banners) {
	Vue.set(state, 'banners', banners);
}

function SET_KEYSEARCH(state, key) {
	Vue.set(state, 'keySearch', key);
}

function SET_COMMERCE_DATA(state, data) {
	Vue.set(state, 'commerce', data);
}

function UPDATE_PRODUCT_PAGE(state) {
	const newPage = state.products.params.page + 1;
	Vue.set(state.products.params, 'page', newPage);
}

function PAGE_ONE(state) {
	Vue.set(state.products.params, 'page', 1);
}

function LAST_PAGE(state, headers) {
	const totalPage = headers['x-last-page'];
	Vue.set(state.products, 'lastPage', Number(totalPage));
}

function RESET_PRODUCTS_ARRAY(state) {
	Vue.set(state.products, 'list', []);
}

function SET_PRODUCT_FILTER(state, filters) {
	Vue.set(state.products.params, 'filters', filters);
}

function ADD_ONE_IN_SERVICE_COUNTER(state, service) {
	state.appConfig.loadingCounter.push(service);
}

function MINUS_ONE_IN_SERVICE_COUNTER(state, index) {
	const current = state.appConfig.loadingCounter;
	current.splice(index, 1);
	Vue.set(state.appConfig, 'loadingCounter', current);
}

function UPDATE_WINDOW_LOADED(state, flag) {
	Vue.set(state, 'windowLoaded', flag);
}

function SET_ECOMMERCE_COLORS(state, theme) {
	const { primary, secondary, border, title, subtitle } = theme;
	const colors = { primary, secondary, border, title, subtitle };
	Vue.set(state, 'colors', colors);
}

function RESETING_COUNTER(state) {
	Vue.set(state.appConfig, 'loadingCounter', []);
}

function SET_PRODUCT_ID_TO_RATE(state, productId) {
	Vue.set(state, 'productIdToRate', productId);
}

function SET_RELATED_PRODUCTS(state, relatedProducts) {
	Vue.set(state.products, 'relateds', relatedProducts);
}

function SET_PRODUCT_SEARCH(state, search) {
	Vue.set(state.products.params, 'search', search);
}

function SET_FLAG_GROUPER(state, flagGrouper) {
	Vue.set(state.products.params, 'flagGrouper', flagGrouper);
}

function SET_ATTRIBUTES(state, attributes) {
	Vue.set(state, 'catAttributes', attributes);
}

function toogleLoginModal(state) {
	Vue.set(state, 'openSignInModal', !state.openSignInModal);
}

function SET_TOP_LOCATION_OF_MODAL(state, h) {
	Vue.set(state, 'topLocationModal', h);
}

function LOADING_PRODUCTS(state, isLoading) {
	Vue.set(state, 'loadingProducts', isLoading);
}

function SET_IS_TOOGLE_BTN(state, value) {
	Vue.set(state, 'isToogleBtn', value);
}
function SET_IS_TOOGLE_DP(state, value) {
	Vue.set(state, 'isToogleDp', value);
}
function SET_IS_TOOGLE_PR(state, value) {
	Vue.set(state, 'isTooglePr', value);
}
function SET_IS_TOOGLE_PS(state, value) {
	Vue.set(state, 'isTooglePs', value);
}
function SET_IS_COLLAPSE_PRODUCT(state, value) {
	Vue.set(state, 'isCollapseProduct', value);
}

function SET_TOTAL_BUY_SHIPP(state, value) {
	Vue.set(state, 'totalBuyWithShipp', value);
}

function SET_TOTALAMOUNT_BUY_SHIPP(state, value) {
	Vue.set(state, 'totalAmountBuyWithShipp', value);
}

function SET_FLAG_NOT_VALID_EMAIL_USER(state, value) {
	Vue.set(state, 'flagNotValidEmailUser', value);
}

function SET_PAYMENT_STATE_NEW(state, value) {
	Vue.set(state, 'paymentStateIdNew', value);
}

const methods = {
	ADD_ONE_IN_SERVICE_COUNTER,
	clearUser,
	...geoMutations,
	...orderMutations,
	...profileMutations,
	PAGE_ONE,
	setToken,
	setStock,
	setUser,
	showSnackBar,
	toggleLoading,
	RESET_PRODUCTS_ARRAY,
	LAST_PAGE,
	MINUS_ONE_IN_SERVICE_COUNTER,
	SET_ATTRIBUTES,
	SET_BANNERS,
	SET_COMMERCE_DATA,
	SET_CURRENCY_DEFAULT,
	SET_DIRECTIONS,
	SET_ECOMMERCE_COLORS,
	SET_ORDER_ID,
	SET_PAYMENT_STATE_NEW,
	SET_PRODUCTS,
	SET_PRODUCT_FILTER,
	SET_PRODUCT_TO_BUY,
	SET_WAREHOUSES,
	UPDATE_FLAG_ADD_VOUCHER,
	UPDATE_POLL_PROGRESS,
	SET_CATEGORIES,
	SET_FLAG_GROUPER,
	SET_ORDER_TOTAL,
	SET_PRODUCT_ID_TO_RATE,
	SET_PRODUCT_SEARCH,
	SET_RELATED_PRODUCTS,
	SET_TOP_LOCATION_OF_MODAL,
	RESETING_COUNTER,
	toogleLoginModal,
	UPDATE_FILTERS,
	UPDATE_PRODUCT_PAGE,
	UPDATE_PRODUCTS_SELECTED,
	UPDATE_WINDOW_LOADED,
	LOADING_PRODUCTS,
	SET_KEYSEARCH,
	SET_IS_TOOGLE_BTN,
	SET_IS_TOOGLE_DP,
	SET_IS_TOOGLE_PR,
	SET_IS_TOOGLE_PS,
	SET_IS_COLLAPSE_PRODUCT,
	SET_TOTAL_BUY_SHIPP,
	SET_TOTALAMOUNT_BUY_SHIPP,
	SET_FLAG_NOT_VALID_EMAIL_USER,
};

export default methods;
