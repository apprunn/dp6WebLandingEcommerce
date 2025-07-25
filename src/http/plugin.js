/* eslint-disable no-param-reassign */

import {
	createFixedAxios,
	createDynamicAxios
} from '@/http/http-factory';
import createInterceptors from '@/http/interceptors-factory';

const UPLOAD_URL = process.env.UPLOAD_URL;
const URL_VALID_DOCUMENT_NUMBER = process.env.URL_VALID_DOCUMENT_NUMBER;
const SALES_URL_HTTP2 = process.env.SALES_URL_HTTP2;
const SALES_URL = process.env.SALES_URL;
const API_GOOGLE_MAPS = process.env.API_GOOGLE_MAPS;
const TOKEN = process.env.TOKEN;
const ACL_URL = 'https://acl.casamarketapp.com/api';
const headers = { Authorization: `Bearer ${TOKEN}` };


export default {
	install(Vue, { store }) {
		const interceptors = createInterceptors(store);

		/* eslint-disable no-param-reassign */
		Vue.prototype.$httpAcl = createFixedAxios(ACL_URL, interceptors);

		Vue.prototype.$httpUpLoad = createFixedAxios(UPLOAD_URL, interceptors);
		Vue.prototype.$httpDocumentNumberValidating = createFixedAxios(URL_VALID_DOCUMENT_NUMBER, interceptors);
		Vue.prototype.$http2 = createFixedAxios(SALES_URL_HTTP2, interceptors);
		Vue.prototype.$httpUpdateTransaction = createFixedAxios(SALES_URL, interceptors);
		Vue.prototype.$httpMaps = createFixedAxios(API_GOOGLE_MAPS, interceptors);

		// DINAMICOS - CONSULTAN AL LOCAL STORAGE
		Vue.prototype.$httpProducts = createDynamicAxios('PRODUCTS_URL', interceptors);
		Vue.prototype.$httpSales = createDynamicAxios('SALES_URL', interceptors);
		Vue.prototype.$httpProductsRead = createDynamicAxios('PRODUCTS_REPORT', interceptors);
		Vue.prototype.$httpSalesRead = createDynamicAxios('SALES_REPORT', interceptors);

		Vue.prototype.$httpSalesPublic = createDynamicAxios('SALES_URL', interceptors, headers);
		Vue.prototype.$httpProductsPublic = createDynamicAxios('PRODUCTS_URL', interceptors, headers);
		Vue.prototype.$httpProductsReadPublic = createDynamicAxios('PRODUCTS_REPORT', interceptors, headers);
		Vue.prototype.$httpSalesReadPublic = createDynamicAxios('SALES_REPORT', interceptors, headers);
	}
};
