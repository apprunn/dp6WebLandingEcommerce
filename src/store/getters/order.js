import lib, { isEmpty, getDeeper, setNewProperty, map } from '@/shared/lib';

const twoDecimals = lib.decimals(2);

const getters = {
	getProductToBuy(state) {
		if (state.order.products) {
			const products = map(
				setNewProperty(
					'total',
					({ price, salePrice, priceDiscount, quantity }) =>
						twoDecimals(quantity * (salePrice || priceDiscount || price)),
					({ priceList, salePrice, priceDiscount, quantity, wholeSalePrice }) => {
						if (wholeSalePrice.length > 0 && wholeSalePrice[0].price !== 0
							&& quantity >= wholeSalePrice[0].from && quantity <= wholeSalePrice[0].to) {
							return twoDecimals(quantity * wholeSalePrice[0].price);
						}
						return twoDecimals(quantity * (salePrice || priceDiscount || priceList.price));
					},
				),
				state.order.products,
			);
			return products;
		}
		return [];
	},
	getOrderId(state) {
		return state.order.id;
	},
	getTotalToBuy(state) {
		const { products, order } = state.order;
		const newProducts = isEmpty(order) ? products : order.details;
		if (newProducts) {
			return newProducts.reduce(
				(acc, { priceList, priceDiscount, salePrice, quantity, wholeSalePrice }) => {
					if (wholeSalePrice && wholeSalePrice.length > 0 &&
						wholeSalePrice[0].price !== 0 &&
						quantity >= wholeSalePrice[0].from &&
						quantity <= wholeSalePrice[0].to) {
						return twoDecimals(wholeSalePrice[0].price * quantity) + acc;
					}
					const priceToShow = (priceDiscount || salePrice || priceList.price) || priceDiscount;

					return twoDecimals(priceToShow * quantity) + acc;
				}, 0);
		}
		return 0;
	},
	getTotalQuantityProducts(state) {
		const { products } = state.order;
		return products ? products.length : 0;
	},
	getTotalItems(state) {
		const { products } = state.order;
		const totalItems = products.reduce((acc, { quantity }) => acc + quantity, 0);
		return totalItems;
	},
	getFlagPickUp(state) {
		return state.order.flagPickUp;
	},
	getDeliveryAddress(state) {
		return state.order.delivery;
	},
	invalidOrder(state) {
		const {
			responsible,
			delivery,
			flagBill,
			bill,
			shippingCost,
			shippingCostError,
			flagPickUp,
			customerAddress,
		} = state.order;
		const invalidResponsible = isEmpty(responsible);

		const invalidDelivery = isEmpty(delivery);

		const invalidNewDelvery = getDeeper('id')(delivery) === 0
			? isEmpty(customerAddress) : false;

		const invalidBill = flagBill ? isEmpty(bill) : false;

		let invalidShippingCost = false;
		if (flagPickUp === 1) {
			invalidShippingCost = shippingCost.price < 0 || shippingCostError;
		}
		return lib.atLeastOneTrue(
			invalidResponsible,
			invalidDelivery,
			invalidBill,
			invalidShippingCost,
			invalidNewDelvery,
		);
	},
	getFlagBill(state) {
		return state.order.flagBill;
	},
	getOrders(state) {
		return state.order.list;
	},
	getStates(state) {
		return state.order.orderStates;
	},
	getOrderDetails(state) {
		const { products, order } = state.order;
		const newProducts = isEmpty(order) ? products : order.details;
		return newProducts;
	},
	getResponsible(state) {
		const { name, lastname, dni, phone, email } = state.order.responsible || {};
		const fullname = `${name} ${lastname}`;
		return { name, lastname, fullname, dni, phone, email };
	},
	getShippingCost(state) {
		const { price, taxAmount } = state.order.shippingCost;
		if (price >= 0 && taxAmount >= 0) {
			return price + taxAmount;
		}
		return null;
	},
	getOrderStateId(state) {
		return state.order.orderStateId;
	},
	getPaymentStateId(state) {
		return state.order.paymentStateId;
	},
	getShippingTaxAmount(state) {
		return state.order.shippingCost.taxAmount;
	},
	getShippingFlagTax(state) {
		return !!state.order.shippingCost.flagTax;
	},
	getShippingTax(state) {
		return state.order.shippingCost.tax;
	},
	getCustomerAddress(state) {
		return state.order.customerAddress;
	},
	getCustomerAddressId(state) {
		return state.order.customerAddressId;
	},
	getBillingData(state) {
		return state.order.bill;
	},
	getOrderStatus(state) {
		return state.order.orderStatus;
	},
	getWayPayment(state) {
		return state.order.paymentMethod;
	},
	getOrderInfo(state) {
		return state.order.order;
	},
	getFlagStatusOrder(state) {
		return state.order.flagStatusOrder;
	},
	getWaysPayments(state) {
		return state.commerce.wayPaymentCommerce;
	},
	getBankAccounts(state) {
		const bankAccounts = state.commerce.bankAccountsRelated;
		return bankAccounts.reduce((acum, bank) => {
			const newAcum = [...acum];
			const newBank = { ...bank };
			const index = newAcum.findIndex(n => n.bankId === bank.bankId);
			if (index > -1) {
				newAcum[index].accounts.push(bank);
			} else {
				newBank.accounts = [{ ...bank }];
				newAcum.push(newBank);
			}
			return newAcum;
		}, []);
	},
	getGatewayAuthorizationResponse(state) {
		return state.order.gatewayAuthorizationResponse;
	},
	getGatewayErrorCode(state) {
		return state.order.gatewayErrorCode;
	},
	getPaymentLink(state) {
		return state.order.paymentLink;
	},
	getAdditionalInformation(state) {
		const { order: { additionalInformation } } = state;
		return additionalInformation || null;
	},
	getWayPaymentDetailCode(state) {
		const { order: { wayPaymentDetailCode } } = state;
		return wayPaymentDetailCode || '';
	},
	getLocationAddress(state) {
		return state.order.locationAddress;
	},
	getComments(state) {
		return state.order.comments;
	},
};

export default getters;
