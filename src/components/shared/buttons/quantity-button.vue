<template>
	<div class="quantity-button">
		<button
			data-cy="less-quantity"
			class="item"
			@click="$emit('click', 'less')"
		>
			-
		</button>
		<input
			v-if="product.category.type === 2"
			class="input-number"
			type="number"
			v-model="number"
			@input="$emit('input', $event.target.value )"
		></input>
		<div
			v-else
			data-cy="quantity-to-buy"
			class="item item-number"
			:style="`color:${globalColors.title}`"
		>
			{{ number }}
		</div>
		<button
			data-cy="more-quantity"
			:disabled="maxQuantity"
			class="item"
			@click="$emit('click', 'more')"
		>
			+
		</button>
	</div>
</template>
<script>

export default {
	name: 'quantity-button',
	props: {
		number: {
			default: () => 1,
			type: Number,
		},
		maxQuantity: {
			type: Boolean,
			default: false,
		},
		product: {
			type: Object,
		},
	},
};
</script>
<style lang="scss" scoped>
.quantity-button {
	border: 1px solid color(base);
	border-radius: 5px;
	color: color(base);
	display: flex;
	font-family: font(bold);
	font-size: size(medium);
	height: 27px;
	width: 116px;

	.item {
		flex: 1 1 auto;
	}

	.item-number {
		align-items: center;
		border-left: 1px solid color(base);
		border-right: 1px solid color(base);
		display: flex;
		font-family: font(heavy);
		justify-content: center;
	}

	button:hover {
		background-color: color(border);
	}

	.input-number {
		width: 50px;
		text-align: center;
		border-left: 1px solid color(base);
		border-right: 1px solid color(base);
		font-family: font(heavy);
	}
}
</style>
