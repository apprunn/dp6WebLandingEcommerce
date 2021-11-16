export default function (code) {
	if (code === 'USER_EXISTS') {
		return 'El usuario ya existe';
	} else if (code.data.message === 'NO_UPDATE_BECAUSE_ORDER_FINALIZED') {
		return 'La orden se encuentra finalizada';
	}
	return 'Verifique que completó los datos requeridos';
}
