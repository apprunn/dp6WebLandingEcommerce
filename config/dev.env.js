const merge = require('webpack-merge');
const prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
	NODE_ENV: '"development"',
	ACL_COMPANY_CODE: `'${process.env.ACL_COMPANY_CODE}'`,
	ACL_URL: `'${process.env.ACL_URL}'`,
	APP_CODE: `'${process.env.APP_CODE}'`,
	APP_NAME: `'${process.env.APP_NAME}'`,
	CLIENT_ID: `'${process.env.CLIENT_ID}'`,
	CODE_PROJECT: `'${process.env.CODE_PROJECT}'`,
	COLOR_PRIMARY: `'${process.env.COLOR_PRIMARY}'`,
	COLOR_BORDER: `'${process.env.COLOR_BORDER}'`,
	COLOR_TITLE: `'${process.env.COLOR_TITLE}'`,
	COLOR_SECONDARY: `'${process.env.COLOR_SECONDARY}'`,
	COLOR_SUBTITLE: `'${process.env.COLOR_SUBTITLE}'`,
	COMMERCE_CODE: `'${process.env.COMMERCE_CODE}'`,
	COMPANY_LOGIN_TITLE: `'${process.env.COMPANY_LOGIN_TITLE}'`,
	COMPANY_LOGO: `'${process.env.COMPANY_LOGO}'`,
	DEFAULT_AVATAR: `'${process.env.DEFAULT_AVATAR}'`,
	FORM_BACKGROUND: `'${process.env.FORM_BACKGROUND}'`,
	PRODUCTS_URL: `'${process.env.PRODUCTS_URL}'`,
	REDIRECT_URI: `'${process.env.REDIRECT_URI}'`,
	ROLE_CODE: `'${process.env.ROLE_CODE}'`,
	S3_IMAGES_URL: "'//apprunn.s3.amazonaws.com'",
	SALES_URL: `'${process.env.SALES_URL}'`,
	STORAGE_USER_KEY: '"ecommerce"',
	TOKEN: `'${process.env.TOKEN}'`,
	UPLOAD_URL: `'${process.env.UPLOAD_URL}'`,
	VISA_MERCHAN_ID: `'${process.env.VISA_MERCHAN_ID}'`,
	WAREHOUSE_ADDRESS: `'${process.env.WAREHOUSE_ADDRESS}'`,
	WAREHOUSE_ID: `'${process.env.WAREHOUSE_ID}'`,
	WAREHOUSE_NAME: `'${process.env.WAREHOUSE_NAME}'`,
	BANNER_SEARCHER_SHOW: `'${process.env.BANNER_SEARCHER_SHOW}'`,
	WAYS_DELIVERIES: `'${process.env.WAYS_DELIVERIES}'`,
	GOOGLE_MAP_API_KEY: `'${process.env.GOOGLE_MAP_API_KEY}'`,
	URL_VALID_DOCUMENT_NUMBER: `'${process.env.URL_VALID_DOCUMENT_NUMBER}'`,
	PAYMENTEZ_CLIENT: `'${process.env.PAYMENTEZ_CLIENT}'`,
	PAYMENTEZ_KEY: `'${process.env.PAYMENTEZ_KEY}'`,
	SALES_URL_HTTP2: `'${process.env.SALES_URL_HTTP2}'`,
	NO_ICON_CATEGORY: `'${process.env.NO_ICON_CATEGORY}'`,
	PAGE_DESCRIPTION: `'${process.env.PAGE_DESCRIPTION}'`,
	PAGE_KEYWORD: `'${process.env.PAGE_KEYWORD}'`,
	PAGE_TITLE: `'${process.env.PAGE_TITLE}'`,
});
