const route = {
	path: '/:id/detalle-producto/:shoper?',
	name: 'detail-product',
	component: () => import(/* webpackChunkName: "page-detail-product" */'@/pages/page-detail-product'),
	props: true,
};

export default route;
