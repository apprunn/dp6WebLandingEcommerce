const route = {
	name: 'buy',
	path: '/carrito-de-compras',
	component: () => import(/* webpackChunkName: "page-buy" */ '@/pages/page-buy'),
	meta: {
		step: 1,
	},
	children: [
		{
			name: 'buy-delivery',
			path: 'entrega-y-facturacion',
			meta: {
				step: 2,
			},
			component: () => import(/* webpackChunkName: "delivery" */ '@/components/order/delivery'),
			beforeEnter: (to, from, next) => {
				if (to.fullPath.includes('entrega-y-facturacion') && localStorage.getItem('ecommerce::token')) {
					next();
				} else {
					next({ name: 'page-home' });
				}
			},
		},
		{
			name: 'buy-payment',
			path: 'pago/:orderId?',
			meta: {
				step: 3,
			},
			component: () => import(/* webpackChunkName: "payment" */ '@/components/order/payment'),
			beforeEnter: (from, to, next) => {
				if (localStorage.getItem('ecommerce::token')) {
					next();
				} else {
					next({ name: 'page-home' });
				}
			},
		},
	],
};

export default route;
