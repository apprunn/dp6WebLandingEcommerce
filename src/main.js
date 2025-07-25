import Vue from 'vue';
import Vuelidate from 'vuelidate';
import VueAnalytics from 'vue-analytics';
import VueSimpleSVG from 'vue-simple-svg';
import VueAwesomeSwiper from 'vue-awesome-swiper';
import VueTheMask from 'vue-the-mask';
import VueAuthenticate from 'vue-authenticate';
import axios from 'axios';
import VueAxios from 'vue-axios';
import 'normalize.css';
import loadResources from '@/mixins/loadResources';
import App from './App';
import registerVuetify from './vuetify';
import './assets/css/swiper.css';

import VueHttp from './http/plugin';
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
registerMap(Vue);

// PLUGINS
Vue.use(VueAxios, axios);
Vue.use(VueTheMask);
Vue.use(Vuelidate);
Vue.use(VueSimpleSVG);
Vue.use(VueHttp, { store });
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


registerFilters(Vue);
registerVuetify(Vue);

Vue.prototype.$bus = new Vue();
Vue.prototype.$imageUrl = process.env.S3_IMAGES_URL;
Vue.prototype.$clientId = process.env.CLIENT_ID;
Vue.config.productionTip = false;

Vue.mixin(globalMixin);
const router = vueRouter(Vue);
/* eslint-disable no-new */
new Vue({
	async created() {
		this.$bus.$on('LOAD_COMMERCE_INFO', (commerceData) => {
			Vue.prototype.$commerceData = commerceData;
			Vue.prototype.$allowOrderStockNegative = commerceData.company.settings.allowOrderStockNegative;
			Vue.prototype.$flagShowBaseUnit = commerceData.company.settings.flagShowBaseUnit;
		});
	},
	el: '#app',
	mixins: [loadResources],
	router,
	render: h => h(App),
	store,
});
