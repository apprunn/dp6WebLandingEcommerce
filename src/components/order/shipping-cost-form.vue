<template>
	<div class="form-container">
		<form @submit.prevent="shippingCostCalc">
			<fieldset>
				<label for="department" class="label-form">Departamento</label>
				<AppSelect light placeholder="Departamento" name="department"/>
			</fieldset>
			<fieldset>
				<label for="province" class="label-form">Provincia</label>
				<AppSelect light placeholder="Provincia" name="province"/>
			</fieldset>
			<fieldset>
				<label for="district" class="label-form">Distrito</label>
				<AppSelect light placeholder="Distrito" name="district"/>
			</fieldset>
			<button class="calc-btn">Calcular</button>
		</form>
	</div>
</template>
<script>
	import AppSelect from '@/components/shared/inputs/app-select';

	function shippingCostCalc() {}

	export default {
		name: 'shipping-cost-form',
		components: {
			AppSelect,
		},
		methods: {
			shippingCostCalc,
		},
	};
</script>
<style lang="scss" scoped>
	.form-container {
		transform-origin: top;
		width: 100%;
	}

	.label-form {
		color: color(dark);
		font-family: font(demi);
		font-size: size(small)
	}

	fieldset {
		border: none;
		margin-bottom: 10px;
		padding: 0;
	}

	.calc-btn {
		background-color: color(white);
		border: 1px solid color(primary);
		border-radius: 4px;
		color: color(primary);
		height: 33px;
		width: 100%;
	}
</style>