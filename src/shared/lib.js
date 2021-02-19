const methods = {
	/* eslint-disable max-len */
	compose: (...fns) => (...args) => fns.reduceRight((res, fn) => [fn.call(null, ...res)], args)[0],
	getDeeper: (args) => {
		const propsFlow = args.split('.');
		return function innerGetDeeper(item) {
			let newItem = item;
			propsFlow.forEach((el) => {
				newItem = (newItem || {})[el];
			});
			return newItem;
		};
	},
	setNewProperty: (prop, v) => (...arg) => {
		const [newItem, index] = arg;
		newItem[prop] = typeof v === 'function' ? v(newItem, index) : v;
		return newItem;
	},
	decimals: d => n => Number(n.toFixed(d)),
	isEmpty: (arg) => {
		if (Array.isArray(arg)) {
			return arg.length === 0;
		}
		if (typeof arg === 'object' && arg !== null) {
			return Object.keys(arg).length === 0;
		}
		if (typeof arg === 'string' || typeof arg === 'number') {
			return !arg;
		}
		return !arg;
	},
	isNotEmpty: arg => !methods.isEmpty(arg),
	atLeastOneTrue: (...args) => args.some(a => a),
	find: (fn, arr) => arr.find(fn),
	findIndex: (fn, arr) => arr.findIndex(fn),
	map: (fn, arr) => arr.map(fn),
	/* eslint-disable prefer-const */
	equality: (...args) => {
		let [prop1, prop2] = args;
		if (!prop2) prop2 = prop1;
		return function equalityInner(item) {
			return typeof item === 'object' ? item[prop1] === prop2 : item === prop1;
		};
	},
	merge: (obj1, obj2) => Object.assign({}, obj1, obj2),

};

export const curry = (fn) => {
	const arity = fn.length;
	return function $curry(...args) {
		if (args.length < arity) {
			return $curry.bind(null, ...args);
		}
		return fn.call(null, ...args);
	};
};

export const { getDeeper, isEmpty, find, equality, setNewProperty, map, compose } = methods;

export default methods;
