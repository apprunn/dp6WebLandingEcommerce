import Router from 'vue-router';
import login from './login';
import Components from './components';
import Profile from './profile';
import register from './register';
import Order from './buy';
import Help from './help';
import Category from './category';
import Search from './search';
import ProductDetail from './detail-product';
import restorePassword from './restore-password';
import SummaryOrder from './summary-order';
import RecoverPassword from './recover-password';

export default function (Vue) {
	Vue.use(Router);
	const config = new Router({
		mode: 'history',
		routes: [
			{
				path: '/',
				name: 'page-home',
				meta: {
					title: 'Home',
					description: 'pantalla principal del ecommerce',
				},
				component: () => import(/* webpackChunkName: "home" */ '@/pages/page-home'),
			},
			Search,
			Category,
			Components,
			Help,
			login,
			Order,
			ProductDetail,
			Profile,
			RecoverPassword,
			register,
			restorePassword,
			SummaryOrder,
			{
				name: 'reclamaciones',
				path: '/reclamaciones',
				component: () => import('@/pages/page-reclamaciones'),
			},
			{
				name: 'not-exist',
				path: '*',
				redirect: '/no-conseguida',
				component: () => import('@/pages/page-not-found'),
				children: [{
					name: 'not-found',
					path: '/no-conseguida',
					component: () => import('@/components/shared/not-found'),
				}],
			},
		],
		scrollBehavior() {
			return { x: 0, y: 0 };
		},
	});
	return config;
}
