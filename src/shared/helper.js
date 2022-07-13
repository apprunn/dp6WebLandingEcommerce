import { format } from 'date-fns';
import { getDeeper, isEmpty } from '@/shared/lib';
import waysDeliveries from '@/shared/enums/waysDeliveries';
import TypeProduct from '@/shared/enums/typeProduct';

function isComposed(product) {
	const composeCode = getDeeper('typeInfo.code')(product);
	return composeCode === TypeProduct.compose;
}

function isService(product) {
	const serviceode = getDeeper('typeInfo.code')(product);
	return serviceode === TypeProduct.service;
}

function isVariation(product) {
	const variationCode = getDeeper('typeInfo.code')(product);
	return variationCode === TypeProduct.variation;
}

function noStock(product) {
	if (isComposed(product)) {
		const { stockComposite } = product;
		return stockComposite === 0;
	}
	if (isService(product)) {
		return false;
	}
	if (isVariation(product)) {
		const { stockVirtual } = product;
		return stockVirtual === 0;
	}
	const { stock } = product;
	return stock <= 0;
}

function stockGreaterThanCero(product) {
	if (isComposed(product)) {
		const { stockComposite } = product;
		return stockComposite === 0;
	}
	if (isService(product)) {
		return false;
	}
	if (isVariation(product)) {
		const { stockVirtual } = product;
		return stockVirtual === 0;
	}
	const { stock } = product;
	return stock <= 0;
}

function exactDate(date, formatter = 'DD-MM-YYYY', splitBy = 'T') {
	if (date) {
		const dateSplit = date.split(splitBy);
		const dateComplete = dateSplit[0].split('-');
		const year = dateComplete[0];
		const month = dateComplete[1] - 1;
		const day = dateComplete[2];
		const newDate = format(new Date(year, month, day), formatter);
		return newDate;
	}
	return null;
}

function formatDate(date, formatter = 'DD-MM-YYYY') {
	const newDate = format(new Date(date), formatter);
	return newDate;
}

function generateBlob(data, contentType = 'application/pdf') {
	return new Blob([data], { type: contentType });
}

function getLocalData(key) {
	return JSON.parse(localStorage.getItem(`${process.env.STORAGE_USER_KEY}::${key}`));
}

function getLocalStorage() {
	return JSON.parse(localStorage.getItem(`${process.env.STORAGE_USER_KEY}`));
}

function getLocalToken() {
	return localStorage.getItem(`${process.env.STORAGE_USER_KEY}::token`);
}

function removeLocalData(key) {
	return localStorage.removeItem(`${process.env.STORAGE_USER_KEY}::${key}`);
}

function setLocalData(key, data) {
	return localStorage.setItem(`${process.env.STORAGE_USER_KEY}::${key}`, JSON.stringify(data));
}

function showDownloadDialog(blob, name, extension) {
	const currentDate = format(new Date(), 'YYYY-MM-DD');
	const link = document.createElement('a');
	link.download = `${name}_${currentDate}.${extension}`;
	link.href = window.URL.createObjectURL(blob);
	link.click();
}

/* eslint-disable */
function debounce(func, wait = 800, immediate) {
	var timeout;
	return function () {
		var context = this, args = arguments;
		var later = function () {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

function setPrices(product, priceListId, flag) {
	const priceList = product.priceList || {};
	const { price, discount } = priceList[priceListId] || {};
	const newDiscount = discount || 0;
	const priceDiscount = Number(((1 - (newDiscount / 100)) * price).toFixed(2));
	const objPrice = { price: discount ? price : 0, priceDiscount: priceDiscount || 0 };
	return objPrice[flag];

}

function updateOrderDetailsInLocalStorage(products) {
	const localOrder = JSON.parse(localStorage.getItem('ecommerce-order'));
	debugger;
	if (!isEmpty(localOrder)) {
		localOrder.details = [...products];
		localStorage.setItem('ecommerce-order', JSON.stringify(localOrder));
	}
}

function buildOrderBody(flagFinish, getters) {
	const { id, name, address } = getters.getCommerceData.settings.defaultWarehouse;
	const { getDeliveryAddress, getCustomerAddress, getCustomerAddressId } = getters;
	const isStore = getters.getFlagPickUp === waysDeliveries.store.value;
	const storeAddress = isStore ? getDeliveryAddress : null;
	const placeAddress = getCustomerAddressId ? getDeliveryAddress : getCustomerAddress;
	const deliveryAddress = isStore ? storeAddress : placeAddress;
	const body = {
		additionalInfo: getters.getAdditionalInformation,
		costShipping: getters.getShippingCost,
		costShippingFlagTax: getters.getShippingFlagTax,
		costShippingTax: getters.getShippingTax,
		costShippingTaxAmount: getters.getShippingTaxAmount,
		customerAddressId: isStore ? null : getCustomerAddressId,
		customerAddress: getCustomerAddressId || isStore ? null : getCustomerAddress,
		customerBill: getters.getFlagBill ? getters.getBillingData : null,
		deliveryAddress,
		details: getOrderDetails(getters.getOrderDetails, id, name),
		flagPickUp: getters.getFlagPickUp,
		responsiblePickUp: getters.getResponsible,
		warehouseId: id,
		warehouseName: name,
		warehouseAddress: address,
		wayPaymentDetailCode: getters.getWayPaymentDetailCode,
		comments: getters.getComments,
	};
	if (flagFinish) {
		body.orderStateId = 1;
	} else {
		body.orderStateId = getters.getOrderStatus && getters.getOrderId ? getters.getOrderStatus : 8;
	}
	if (getters.getOrderId && getters.getOrderStatus) {
		// body.orderStateId = getters.getOrderStatus;
		// body.flagStatusOrder = flagFinish ? 3 : getters.getFlagStatusOrder;
		body.bankAccountId = null;
		// body.bankAccountId = flagFinish ? getters.getWayPayment.bankAccountId : null;
		body.wayPaymentId = flagFinish ? getters.getWayPayment.wayPayment : null;
	} else {
		body.commerceCode = process.env.COMMERCE_CODE;
	}
	return body;
}

function getOrderDetails(products, warehouseId, warehouseName) {
	return products.map((p) => {
		const { taxes, conversions } = p;
		const extractConversions = conversions ? Object.values(conversions) : null;
		const unitConversion = extractConversions ? extractConversions.find(conv => conv.code === p.unit.code) : { quantity: p.unitConversion };
		const newTaxes = setTaxes(taxes);
		const newP = {
			alternateCode: p.alternateCode,
			brandId: getDeeper('warehouseProduct.brandId')(p) || p.brandId,
			brandName: getDeeper('warehouseProduct.brand.name')(p) || p.brandName,
			categoryId: p.categoryId,
			categoryName: getDeeper('category.name')(p) || p.categoryName,
			codeTaxes: taxes[0].code,
			description: p.description,
			discount: p.discount || 0,
			discountPercentage: p.discountPercentage || 0,
			product: {
				id: p.productId || p.id,
				taxes: [...newTaxes],
				type: getDeeper('typeInfo.id')(p) || getDeeper('product.type')(p),
			},
			productCode: p.code || p.productCode,
			productId: p.productId || p.id,
			productImage: p.urlImage || p.productImage,
			productName: p.name || p.productName,
			quantity: p.quantity,
			salePrice: p.priceDiscount || p.salePrice || p.price,
			stockQuantity: p.stock,
			taxes: newTaxes,
			unit: p.unit,
			unitCode: p.unit.code,
			unitConversion: unitConversion ? unitConversion.quantity : 1,
			unitId: p.unit.id,
			unitName: p.unit.name,
			unitQuantity: p.quantity,
			warehouseId,
			warehouseName,
		};
		return newP;
	});
}

function setTaxes(taxes) {
	const newTaxes = [];
	if (!taxes && taxes.length === 0) {
		newTaxes[0] = {
			code: '01',
			codeTable: 'TABLE17',
			codePercentage: '01',
			flagSales: true,
			flagPurchases: false,
			percentage: 0,
		};
	} else {
		const tax = taxes[0];
		newTaxes[0] = {
			code: tax.code,
			codeTable: tax.codeTable,
			codePercentage: tax.codePercentage,
			flagSales: Boolean(tax.flagSales),
			flagPurchases: Boolean(tax.flagPurchases),
			percentage: tax.percentage,
		};
	}
	return newTaxes;
}

function copyFn(node) {
	const range = document.createRange();
	range.selectNodeContents(node);
	window.getSelection().removeAllRanges();
	window.getSelection().addRange(range);
	document.execCommand('copy');
	window.getSelection().removeRange(range);
}

const methods = {
	buildOrderBody,
	copyFn,
	debounce,
	exactDate,
	formatDate,
	generateBlob,
	getLocalData,
	getLocalStorage,
	getLocalToken,
	isComposed,
	noStock,
	removeLocalData,
	setLocalData,
	setPrices,
	showDownloadDialog,
	stockGreaterThanCero,
	updateOrderDetailsInLocalStorage,
};

export default methods;
