# dp6WebLandingEcommerce

> a vuetify template along to vue-router, axios and some other stuff.

> https://ecommerce-template.netlify.com/ [DEV]

### Libraries Documentation

1.  [VueJs](vuejs.org)
2.  [Vue-Router](https://router.vuejs.org/en/)
3.  [Vuetify](http://next.vuetifyjs.com)
4.  [Axios replace to vue-resource](https://github.com/axios/axios)
5.  [Vuex](https://vuex.vuejs.org/)

### Basic Rules

Read our official [guide](https://style-guide.eperedo.com/)

## Environment

Before you launch the server please create the .env file with the following values:

```bash
ACL_COMPANY_CODE=
ACL_URL=
API_JAPI=
APP_CODE=
APP_NAME=
CLIENT_ID=
CODE_PROJECT=
COMMERCE_CODE=
COMPANY_LOGIN_TITLE=
COMPANY_LOGO=
DEFAULT_AVATAR=
FORM_BACKGROUND=
GOOGLE_MAP_API_KEY=
PAYMENTEZ_CLIENT=
PAYMENTEZ_KEY=
PRODUCTS_URL=
REDIRECT_URI=
ROLE_CODE=
SALES_URL=
TOKEN=
UPLOAD_URL=
WAREHOUSE_ADDRESS=
WAREHOUSE_ID=
WAREHOUSE_NAME=
WAYS_DELIVERIES=
```

Now you can start the server, if you have any problems please ask @azulchic. She will not answer you, but worth the try.

## Build Setup

```bash
#Node version
14.18.2

# install dependencies
npm install

# serve with hot reload at localhost:PORT
npm run dev

# build for production with minification
npm run build 
```

## Scope

1. MAQ - Maquetación, CSS, HTML
2. CFG - Estructura, Build, Deploy, Configuración
3. HOME - Inicio
4. CAT - Categories
5. PRO - Products
6. COM - Components (Header, Subheader, Filters, Searcher, Footer, Carrousel, etc...)
7. LOG - Login, register, etc.

## Payments Methods
1. VisaNet: Requiere dos variables de entorno: `VISA_MERCHAN_ID` y `COMMERCE_CODE`.
2. Paymentez: Requiere dos variables de entorno: `PAYMENTEZ_CLIENT` y `PAYMENTEZ_KEY`.
3. DataFast: Requiere ? variables de entorno:
