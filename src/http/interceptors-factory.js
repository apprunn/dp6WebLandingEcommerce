export default function createInterceptors(store) {
	function pseudoLogout() {
		store.dispatch('clearUser');
		store.dispatch('DEFAULT_USER');
		store.dispatch('SET_DEFAULT_VALUES');
		// NO USAR localStorage.clear() porque borra los dominios (domains) y el ecommerce-data
		// que son necesarios para que la app siga funcionando/redirigiendo.
		const storageKey = process.env.STORAGE_USER_KEY || 'ecommerce';
		localStorage.removeItem(`${storageKey}::token`);
		localStorage.removeItem(`${storageKey}::ecommerce-user`);
	}

	return {
		httpRequestInterceptor(config) {
			store.dispatch('addService', config);

			const headers = config.headers || {};
			// const timestamp = new Date().toISOString();
			// console.log(`[HTTP Request] ${timestamp} - URL: ${config.url}`);
			// console.log(`[HTTP Request] Token en Store: ${store.state.token ? 'PRESENTE' : 'NULO/VACÍO'}`);
			// console.log(`[HTTP Request] usa Token Usuario (useUserToken): ${!!config.useUserToken}`);

			if (config.useUserToken && store.state.token) {
				headers.common = headers.common || {};
				headers.common.Authorization = `Bearer ${store.state.token}`;
				console.log('[HTTP Request] Inyectando Token de Usuario');
			} else if (store.state.token) {
				headers.common = headers.common || {};
				headers.common.Authorization = `Bearer ${store.state.token}`;
				console.log('[HTTP Request] Inyectando Token de Sesión (fallback)');
			} else {
				headers.common = headers.common || {};
				headers.common.Authorization = `Bearer ${process.env.TOKEN}`;
				console.log('[HTTP Request] Usando TOKEN PÚBLICO del .env');
			}

			store.dispatch('toggleLoading', true);
			return config;
		},
		httpResponseSuccessInterceptor(response) {
			store.dispatch('minusService', response);
			const counter = store.getters.loadingCounter;

			if (counter === 0 && store.getters.windowLoaded) {
				setTimeout(() => {
					store.dispatch('toggleLoading', false);
				});
			}
			return response;
		},
		httpResponseInterceptor(error) {
			store.dispatch('toggleLoading', false);
			store.commit('SET_IS_TOOGLE_BTN', false);
			store.dispatch('resetCounter');

			let text = 'Su sesión expiró.';
			const { status, statusText, data } = error.response || {};

			if (status === 401 && statusText === 'Unauthorized') {
				text = 'Correo o contraseña inválidos';
				pseudoLogout();
			} else if (status === 401) {
				pseudoLogout();
			} else if (status === 400) {
				if (error.response === 'USER_EXISTS') {
					text = 'El usuario ya existe';
				} else if (data.message === 'NO_UPDATE_BECAUSE_ORDER_FINALIZED') {
					text = 'Estimado usuario, su orden ya ha sido enviada. Refresque la página.';
				} else {
					text = 'Verifique que completó los datos requeridos';
				}
			} else if (status === 403) {
				text = 'No tiene suficientes permisos para realizar esta acción';
			} else if (status === 500) {
				text = 'No se logró completar la acción, intente de nuevo.';
			}

			store.dispatch('showSnackBar', {
				text,
				color: 'error',
				html: null,
				isBtn: false,
				timeout: 10000,
			});

			return Promise.reject(error.response);
		}
	};
}
