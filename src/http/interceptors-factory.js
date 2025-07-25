export default function createInterceptors(store) {
	function pseudoLogout() {
		store.dispatch('clearUser');
		store.dispatch('DEFAULT_USER');
		store.dispatch('SET_DEFAULT_VALUES');
		localStorage.clear();
	}

	return {
		httpRequestInterceptor(config) {
			store.dispatch('addService', config);

			const headers = config.headers || {};

			if (store.state.token) {
				headers.common = headers.common || {};
				headers.common.Authorization = `Bearer ${store.state.token}`;
			} else {
				headers.common = headers.common || {};
				headers.common.Authorization = `Bearer ${process.env.TOKEN}`;
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
