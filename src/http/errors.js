export default function (code) {
	if (code === 'USER_EXISTS') {
		return 'El usuario ya existe';
	} else if (code.data.message === 'NO_UPDATE_BECAUSE_ORDER_FINALIZED') {
		return 'Estimado usuario, su orden ya ha sido enviada refresque la página';
	}
	return 'Verifique que completó los datos requeridos';
}
