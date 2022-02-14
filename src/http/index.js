import store from '@/store';
import errors from './errors';


export function httpRequestInterceptor(config) {
	store.dispatch('addService', config);
	const headers = config.headers;
	if (store.state.token) {
		headers.common.Authorization = `Bearer ${store.state.token}`;
	} else {
		headers.common.Authorization = `Bearer ${process.env.TOKEN}`;
	}
	store.dispatch('toggleLoading', true);
	return config;
}

export function httpResponseSuccessInterceptor(response) {
	store.dispatch('minusService', response);
	const counter = store.getters.loadingCounter;
	if (counter === 0 && store.getters.windowLoaded) {
		setTimeout(() => {
			store.dispatch('toggleLoading', false);
		});
	}
	return response;
}

function pseudoLogout() {
	store.dispatch('clearUser');
	store.dispatch('DEFAULT_USER');
	store.dispatch('SET_DEFAULT_VALUES');
	localStorage.clear();
}

export function httpResponseInterceptor(error) {
	store.dispatch('toggleLoading', false);
	store.commit('SET_IS_TOOGLE_BTN', false);
	store.dispatch('resetCounter');
	let text = 'Su sesión expiró.';
	const { status, statusText } = error.response;
	if (status === 401 && statusText === 'Unauthorized') {
		text = 'Correo o contraseña inválidos';
		pseudoLogout();
	} else if (status === 401) {
		pseudoLogout();
	} else if (status === 400) {
		text = errors(error.response);
	} else if (status === 403) {
		text = 'No tiene suficientes permisos para realizar ésta acción';
	} else if (status === 500) {
		text = 'No se logró completar la acción, intente de nuevo.';
	}
	store.dispatch('showSnackBar', { text, color: 'error', html: null, isBtn: false, timeout: 10000 });
	return Promise.reject(error.response);
}
