import l, { isEmpty } from '@/shared/lib';
import GlobalFeatures from '@/class/globalFeatures';

class ProductDetails {
	constructor(childrens, priceListSelectedId) {
		this.childrens = childrens;
		this.filteredFeatures = [];
		this.globalFeatures = new GlobalFeatures(childrens);
		this.selectedFeatures = {};
		this.selectedProduct = {};
		this.selectedProductsArray = [];
		this.unitId = 0;
		this.parentProduct = {};
		this.pictureNotFound = '/static/icons/no-picture-found.svg';
		this.priceListId = priceListSelectedId;
		this.selectedUnit = {};
	}
	get brand() {
		return this.selectedProduct.warehouseProduct.brand.name;
	}
	get code() {
		return this.selectedProduct.code;
	}
	get conversions() {
		return this.selectedProduct.conversions;
	}
	get description() {
		return this.selectedProduct.description;
	}
	get flagFavorite() {
		return this.selectedProduct.flagFavorite;
	}
	get image() {
		return this.selectedProduct.imagePresentation;
	}
	get isService() {
		return this.selectedProduct.typeInfo.code === 'servicios';
	}
	get name() {
		return this.selectedProduct.name;
	}
	get price() {
		return this.selectedProduct.price;
	}
	get priceDiscount() {
		return this.selectedProduct.priceDiscount;
	}
	get quantity() {
		return this.selectedProduct.quantity;
	}
	get rating() {
		return this.selectedProduct.rating;
	}
	get stock() {
		return this.selectedProduct.stockWarehouse;
	}
	get total() {
		return Number((this.quantity * this.price).toFixed(2));
	}
	get unit() {
		return this.selectedProduct.unit;
	}
	buyingProduct() {
		return { ...this.selectedProduct };
	}
	clearFilteredFeatures() {
		this.filteredFeatures = [];
	}
	clearSelectedFeatures() {
		this.selectedFeatures = {};
	}
	getFeatures() {
		return this.globalFeatures.get();
	}
	getImages() {
		const allProductsImages = this.getProductDetails().images;
		const imgsBySelectedUnitId = allProductsImages.filter(img => img.unitId === this.unitId);
		if (isEmpty(imgsBySelectedUnitId)) {
			const imgs = this.getImgsWithoutUnitId.call(this, allProductsImages);
			this.setImagePresentation.call(this, imgs[0].urlImage);
			return imgs;
		}
		this.setImagePresentation.call(this, imgsBySelectedUnitId[0].urlImage);
		return imgsBySelectedUnitId;
	}
	getImgsWithoutUnitId(allImgs) {
		const baseUnitId = this.getProductDetails().unitId;
		const selectedUnitId = this.unitId;
		if (baseUnitId === selectedUnitId) {
			const imgsWithoutUnitId = isEmpty(allImgs) ? [] : allImgs.filter(img => !img.unitId);
			const productUrlImage = this.getProductDetails().urlImage || this.pictureNotFound;
			const mainImg = { urlImage: productUrlImage, select: false };
			return [].concat(mainImg, imgsWithoutUnitId);
		}
		return [{ urlImage: this.pictureNotFound, select: false }];
	}
	getProductDetails() {
		return { ...this.selectedProduct };
	}
	featureSelected(feature) {
		if (isEmpty(this.selectedFeatures)) {
			this.globalFeatures.features = this.globalFeatures.features.filter(f =>
				f.values && f.values.length > 0);
			this.globalFeatures.allUnSelected();
		}
		this.updateSelectedFeatures.call(this, feature);
		this.setFilteredProducts.call(this);
		if (this.selectedProductsArray.length === 0) {
			this.globalFeatures.allUnSelected();
			this.clearFilteredFeatures.call(this);
			this.clearSelectedFeatures.call(this);
			this.updateSelectedFeatures.call(this, feature);
			this.setFilteredProducts.call(this);
			this.productSelected.call(this, this.selectedProductsArray[0]);
		} else {
			this.globalFeatures.update(this.filteredFeatures);
		}
	}
	firstProductSelected(product) {
		const { unitId } = product;
		this.parentProduct = product;
		this.globalFeatures.init(product);
		if (isEmpty(this.childrens)) {
			this.updateSelectedProducts([product]);
		} else {
			this.productSelected(product);
		}
		this.updateUnitId.call(this, unitId);
		this.updateQuantity.call(this, 1);
		this.setImagePresentation.call(this, product.urlImage);
	}
	productSelected(product) {
		if (product.features.length > 0) {
			product.features.forEach(this.featureSelected.bind(this));
		} else {
			this.updateSelectedProducts([product]);
		}
	}
	setFilteredProducts() {
		let localCache = [this.parentProduct, ...this.childrens];
		const features = [];
		Object.values(this.selectedFeatures).forEach((f) => {
			const products = [];
			localCache.forEach((c) => {
				const index = c.features.findIndex(fea => fea.value === f.value);
				if (index > -1) {
					products.push(c);
					c.features.forEach((eleFea) => {
						const indexFeatures = features.findIndex(el => el.value === eleFea.value);
						if (indexFeatures === -1) {
							features.push(eleFea);
						}
					});
				}
			});
			localCache = [...products];
		});
		this.updateFilteredFeatures(features);
		this.updateSelectedProducts(localCache);
	}
	setImagePresentation(urlImage) {
		this.selectedProduct.imagePresentation = urlImage;
	}
	updateSelectedFeatures(feature) {
		this.selectedFeatures[feature.id] = feature;
	}
	updateSelectedProducts(productsCollection) {
		[this.selectedProduct] = productsCollection;
		if (l.isNotEmpty(this.selectedProduct)) {
			this.updateQuantity(1);
			this.updateUnitId(this.selectedProduct.unitId);
		}
		this.selectedProductsArray = productsCollection;
	}
	updateFilteredFeatures(features) {
		const newFeatures = features.map((feature) => {
			const selectedFeatures = Object.values(this.selectedFeatures);
			const isSelected = selectedFeatures.some(f => f.value === feature.value);
			return l.setNewProperty('isSelected', isSelected)(feature);
		});
		this.filteredFeatures = [...newFeatures];
	}
	updateProductPrices() {
		const priceList = this.selectedProduct.priceList[this.priceListId];
		let { discount } = priceList;
		const { units, price } = priceList;
		const rightConversion = units[this.selectedProduct.unitSelected];
		this.selectedProduct.price = rightConversion ? rightConversion.price : price;
		discount = rightConversion ? rightConversion.discount : discount;
		if (discount) {
			const priceDiscount = (1 - (discount / 100)) * this.selectedProduct.price;
			this.selectedProduct.priceDiscount = Number(priceDiscount.toFixed(2));
		} else {
			this.selectedProduct.priceDiscount = this.selectedProduct.price;
			this.selectedProduct.price = null;
		}
	}
	updateProductSelected(prop, val) {
		this.selectedProduct[prop] = val;
		this.updateProductPrices.call(this);
	}
	updateQuantity(q) {
		this.updateProductSelected.call(this, 'quantity', q);
	}
	updateUnitId(unitId) {
		this.unitId = unitId;
		this.updateProductSelected.call(this, 'unitSelected', unitId);
	}
	updateUnit(unit) {
		this.unitId = unit.id;
		this.selectedUnit = unit;
		this.updateProductSelected.call(this, 'unit', unit);
		this.updateUnitId.call(this, unit.id);
	}
}

export default ProductDetails;
