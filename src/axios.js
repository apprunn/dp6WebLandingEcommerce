import axios from 'axios';

const aclInstance = axios.create({
	baseURL: process.env.ACL_URL,
});

const productsInstance = axios.create({
	baseURL: process.env.PRODUCTS_URL,
});

const productsPublicInstance = axios.create({
	baseURL: process.env.PRODUCTS_URL,
	headers: {
		Authorization: `Bearer ${process.env.TOKEN}`,
	},
});

const salesInstance = axios.create({
	baseURL: process.env.SALES_URL,
});

const updateTransactionIntance = axios.create({
	baseURL: process.env.SALES_URL,
});

const salesPublicInstance = axios.create({
	baseURL: process.env.SALES_URL,
	headers: {
		Authorization: `Bearer ${process.env.TOKEN}`,
	},
});

const uploadInstance = axios.create({
	baseURL: process.env.UPLOAD_URL,
});

const documentNumberValidating = axios.create({
	baseURL: process.env.URL_VALID_DOCUMENT_NUMBER,
});

const http2Instance = axios.create({
	baseURL: process.env.SALES_URL_HTTP2,
});

export default function (Vue) {
	/* eslint-disable no-param-reassign */
	Vue.prototype.$httpProducts = productsInstance;
	Vue.prototype.$httpAcl = aclInstance;
	Vue.prototype.$httpSales = salesInstance;
	Vue.prototype.$httpSalesPublic = salesPublicInstance;
	Vue.prototype.$httpProductsPublic = productsPublicInstance;
	Vue.prototype.$httpUpLoad = uploadInstance;
	Vue.prototype.$httpDocumentNumberValidating = documentNumberValidating;
	Vue.prototype.$http2 = http2Instance;
	Vue.prototype.$httpUpdateTransaction = updateTransactionIntance;
}
