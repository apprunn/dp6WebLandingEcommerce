const route = {
	name: 'buy-summary',
	path: '/resumen-de-mi-pedido/:orderId?',
	component: () => import(/* webpackChunkName: "summaryOrder" */ '@/pages/page-new-summary-order'),
	beforeEnter: (to, from, next) => {
		if (to.fullPath.includes('resumen-de-mi-pedido') && localStorage.getItem('ecommerce::token')) {
			next();
		} else {
			next({ name: 'page-home' });
		}
	},
	meta: {
		step: 4,
	},
};
export default route;
