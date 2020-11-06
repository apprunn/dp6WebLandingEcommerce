<template>
	<div class="modal-login">
		<div>
			<span class="label-modal">¿Tienes una cuenta?</span>
			<app-button
				data-cy="appButtonLogin"
				thin
				class="mb-3"
				action="Iniciar Sesión"
				@click="goToLink('login')"
				:background="globalColors.primary"
				/>
			<span class="label-modal">¿No tienes una cuenta?</span>
			<app-button 
				thin
				background="white"
				action="Crear cuenta"
				@click="goToLink('register')"
				:color="globalColors.base"
				:border="globalColors.base"
			/>
		</div>
	</div>
</template>
<script>
import appButton from '@/components/shared/buttons/app-button';

function goToLink(name) {
	const { fullPath } = this.$route;
	this.setLocalData('route-after-login', fullPath);
	this.goTo(name);
	this.$emit('close-modal');
}

export default {
	name: 'modal-login',
	components: {
		appButton,
	},
	methods: {
		goToLink,
	},
};
</script>
<style lang="scss" scoped>
	.modal-login {
		align-items: center;
		background-color: color(white);
		border-radius: 7px;
		box-shadow: inset 0 0 3px 0 rgba(0, 0, 0, 0.18);
		display: flex;
		height: 190px;
		justify-content: center;
		width: 246px;
	}

	.label-modal {
		color: color(base);
		font-family: font(regular);
		font-size: size(xsmall);
	}
</style>


