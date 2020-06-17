import Vue from 'vue';
import Vuelidate from 'vuelidate';
import VueAnalytics from 'vue-analytics';
import VueHead from 'vue-head';
import VueSimpleSVG from 'vue-simple-svg';
import VueAwesomeSwiper from 'vue-awesome-swiper';
import 'swiper/dist/css/swiper.css';
import VueTheMask from 'vue-the-mask';
import VueAuthenticate from 'vue-authenticate';
import axios from 'axios';
import VueAxios from 'vue-axios';
import 'normalize.css';
import updateFromLocalStorage from '@/mixins/updateFromLocalStorage';
import loadResources from '@/mixins/loadResources';
import App from './App';
import registerVuetify from './vuetify';
import {
	httpRequestInterceptor,
	httpResponseInterceptor,
	httpResponseSuccessInterceptor,
} from './http/index';
import registerAxios from './axios';
import vueRouter from './router';
import globalMixin from './mixins/global';
import registerFilters from './filters/global';
import './global-components';
import store from './store';
import registerMap from './vue-map';

window.onload = () => {
	store.dispatch('SET_WINDOW_LOADED_TO_TRUE');
	store.dispatch('toggleLoading', false);
};
registerAxios(Vue);
registerMap(Vue);
Vue.use(VueAxios, axios);
Vue.use(VueTheMask);
Vue.use(Vuelidate);
Vue.use(VueSimpleSVG);
Vue.use(VueHead);
Vue.use(VueAuthenticate, {
	baseUrl: process.env.ACL_URL,
	providers: {
		facebook: {
			clientId: process.env.CLIENT_ID,
			redirectUri: process.env.REDIRECT_URI,
			responseType: 'token',
			authorizationEndpoint: 'https://www.facebook.com/v4.0/dialog/oauth',
		},
	},
});
Vue.use(VueAnalytics, {
	id: 'UA-XXXXXXX-1',
	autoTracking: {
		screenview: true,
	},
	disableScriptLoader: true,
	sendHitTask: window.location.hostname === 'ecommerce.netlify.com',
});
Vue.use(VueAwesomeSwiper);

const router = vueRouter(Vue);
registerFilters(Vue);
registerVuetify(Vue);
Vue.prototype.$imageUrl = process.env.S3_IMAGES_URL;
Vue.prototype.$clientId = process.env.CLIENT_ID;
Vue.config.productionTip = false;
Vue.mixin(globalMixin);

async function created() {
	this.$httpProducts.interceptors.request.use(this.httpRequestInterceptor);
	this.$httpProducts.interceptors.response.use(
		this.httpResponseSuccessInterceptor,
		this.httpResponseInterceptor,
	);
	this.$httpAcl.interceptors.request.use(this.httpRequestInterceptor);
	this.$httpAcl.interceptors.response.use(
		this.httpResponseSuccessInterceptor,
		this.httpResponseInterceptor,
	);
	this.$httpSales.interceptors.request.use(this.httpRequestInterceptor);
	this.$httpSales.interceptors.response.use(
		this.httpResponseSuccessInterceptor,
		this.httpResponseInterceptor,
	);
	this.$httpProductsPublic.interceptors.request.use(this.httpRequestInterceptor);
	this.$httpProductsPublic.interceptors.response.use(
		this.httpResponseSuccessInterceptor,
		this.httpResponseInterceptor,
	);
}

/* eslint-disable no-new */
new Vue({
	created,
	el: '#app',
	methods: {
		httpRequestInterceptor,
		httpResponseInterceptor,
		httpResponseSuccessInterceptor,
	},
	mixins: [updateFromLocalStorage, loadResources],
	router,
	render: h => h(App),
	store,
});
