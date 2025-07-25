/* eslint-disable no-param-reassign */
import axios from 'axios';
import helper from '@/shared/helper';

/**
 * Crea una instancia Axios con baseURL fija
 */
export function createFixedAxios(baseURL, interceptors, headers = {}) {
	const instance = axios.create({ baseURL, headers });

	instance.interceptors.request.use(interceptors.httpRequestInterceptor);
	instance.interceptors.response.use(
		interceptors.httpResponseSuccessInterceptor,
		interceptors.httpResponseInterceptor
	);
	return instance;
}

/**
 * Crea una instancia Axios con baseURL obtenida dinámicamente (por ejemplo, desde localStorage)
 */
export function createDynamicAxios(storageKey, interceptors, headers = {}) {
	const instance = axios.create();

	instance.interceptors.request.use((config) => {
		const storageValue = helper.getDomainDynamic(storageKey);

		if (storageValue && storageValue.endPoint) {
			config.baseURL = storageValue.endPoint;
		}

		config.headers = {
			...config.headers,
			...headers,
		};

		return config;
	});

	instance.interceptors.request.use(interceptors.httpRequestInterceptor);
	instance.interceptors.response.use(
		interceptors.httpResponseSuccessInterceptor,
		interceptors.httpResponseInterceptor
	);
	return instance;
}
