
export default {
	appConfig: {
		loadingCounter: [],
		isLoading: false,
		snackbar: {
			text: '',
			isVisible: false,
			color: 'primary',
		},
	},
	banners: [],
	bannerTypes: {
		Category: 1,
		Product: 2,
		Home: 3,
		Top: 4,
	},
	catAttributes: [],
	colors: {},
	commerce: {},
	currencyDefault: null,
	directions: [
		{ id: 0, addressLine1: 'Nueva dirección', name: 'Nueva dirección' },
	],
	genders: [
		{ id: 1, title: 'Femenino' },
		{ id: 2, title: 'Masculino' },
	],
	geo: {
		departments: [],
		districts: [],
		provinces: [],
	},
	openSignInModal: false,
	order: {
		bankAccountsRelated: null,
		bill: null,
		customerAddressId: 0,
		customerAddress: null,
		delivery: null,
		details: null,
		flagBill: false,
		flagPickUp: 1,
		flagStatusOrder: null,
		gatewayErrorCode: null,
		gatewayAuthorizationResponse: null,
		id: null,
		list: [],
		order: null,
		orderStates: null,
		orderStatus: null,
		paymentLink: null,
		paymentMethod: {
			bankAccountId: null,
			wayPayment: null,
		},
		products: [],
		responsible: null,
		shippingCost: {
			flagTaxe: false,
			price: 0,
			tax: 0,
			taxAmount: 0,
		},
		status: [],
		total: null,
		waysPayments: null,
	},
	pollData: {
		progress: 0,
	},
	profile: {
		address: [],
		favorites: [],
		flagAddVoucher: false,
		onlineTransactions: [],
		userData: null,
	},
	products: {
		lastPage: 0,
		list: [],
		params: {
			flagGrouper: false,
			filters: null,
			limit: 20,
			page: 1,
			search: null,
		},
		relateds: [],
	},
	productIdToRate: null,
	token: null,
	topLocationModal: 0,
	user: {
		email: '',
		logo: '/static/img/user.svg',
		profileImage: '',
		username: '',
	},
	categories: [],
	productsSelected: null,
	totalProducts: 0,
	warehouses: [
		{ id: 0, name: 'Seleccione una tienda' },
	],
	filters: null,
	windowLoaded: false,
};
