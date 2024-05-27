import l, { isEmpty, setNewProperty } from '@/shared/lib';
import GlobalFeatures from '@/class/globalFeatures';
import TypeProduct from '@/shared/enums/typeProduct';

class ProductDetails {
	constructor(childrens, priceListSelectedId, commercePriceListId) {
		this.childrens = childrens;
		this.filteredFeatures = [];
		this.globalFeatures = new GlobalFeatures(childrens);
		this.selectedFeatures = {};
		this.selectedProduct = {};
		this.selectedProductsArray = [];
		this.unitId = 0;
		this.parentProduct = {};
		this.pictureNotFound = '/static/icons/no-picture-found.svg';
		this.priceListId = commercePriceListId || priceListSelectedId;
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
		if (ProductDetails.isComposedType(this.selectedProduct)) {
			return this.selectedProduct.stockComposite;
		}
		if (ProductDetails.isVariationType(this.selectedProduct)) {
			return this.selectedProduct.stockWarehouse;
		}
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
			if (imgs.length > 0) {
				this.setImagePresentation.call(this, imgs[0].urlImage);
			}
			return imgs;
		}
		this.setImagePresentation.call(this, imgsBySelectedUnitId[0].urlImage);
		return imgsBySelectedUnitId;
	}
	getImgsWithoutUnitId(allImgs) {
		const baseUnitId = this.getProductDetails().unitId;
		const selectedUnitId = this.unitId;
		const defaultImage = [{ urlImage: this.pictureNotFound, select: false }];
		if (baseUnitId === selectedUnitId) {
			const imgsWithoutUnitId = isEmpty(allImgs)
				? defaultImage : allImgs.filter(img => !img.unitId);
			return imgsWithoutUnitId;
		}
		return defaultImage;
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
			this.setImagePresentation.call(this, product.urlImage);
		} else {
			const isVariationType = ProductDetails.isVariationType(product);
			if (isVariationType) {
				const child = this.childrens[0];
				this.productSelected(child);
				const img = child.images[0] ? child.images[0].urlImage : this.pictureNotFound;
				this.setImagePresentation.call(this, img);
			} else {
				this.productSelected(product);
				this.setImagePresentation.call(this, product.urlImage);
			}
		}
		this.updateUnitId.call(this, unitId);
		this.updateQuantity.call(this, 1);
	}
	static isComposedType(product) {
		const { typeInfo: { code } } = product;
		return code === TypeProduct.compose;
	}
	static isVariationType(product) {
		const { typeInfo: { code } } = product;
		return code === TypeProduct.variation;
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
			return setNewProperty('isSelected', isSelected)(feature);
		});
		this.filteredFeatures = [...newFeatures];
	}
	updateProductPrices() {
		const priceList = this.selectedProduct.priceList[this.priceListId] || null;
		if (!priceList) {
			this.selectedProduct.price = null;
			this.selectedProduct.priceDiscount = null;
			return;
		}
		let { discount } = priceList;
		const { units, price } = priceList;
		if (!units) {
			this.selectedProduct.price = price || null;
			this.selectedProduct.priceDiscount = price || null;
			return;
		}
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

	getWholeSalePrice() {
		const selectedProduct = this.selectedProduct;
		if (!selectedProduct ||
			!selectedProduct.priceList || !selectedProduct.priceList[this.priceListId]) {
			return [];
		}
		const priceList = selectedProduct.priceList[this.priceListId];
		const units = priceList.units;
		if (!units || !units[selectedProduct.unitSelected]) {
			return [];
		}
		const rightRanges = units[selectedProduct.unitSelected];
		const ranges = rightRanges ? rightRanges.ranges : priceList.ranges;
		const resultRanges = ranges || [];
		return resultRanges;
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
