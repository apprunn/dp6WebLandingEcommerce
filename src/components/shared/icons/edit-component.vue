<template>
	<button type="button" @click="clicked" class="edit-user-button">
		<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
			<g
				:fill="colorChange"
				fill-rule="nonzero"
			>
				<path d="M8.872 17.354a.407.407 0 0 0 .167-.1L19.655 6.64c.46-.46.46-1.208 0-1.668L15.03.345a1.181 1.181 0 0 0-1.668 0L2.745 10.961a.404.404 0 0 0-.1.166l-2.627 8.36A.398.398 0 0 0 .393 20h17.572c.505 0 .505-.786 0-.786H2.955l5.917-1.86zm-.111-.933l-.614-.614.167-1.87 2.4-2.4c.36-.36-.197-.916-.556-.557l-2.405 2.406-1.388.24.22-1.405 7.34-7.34 1.167 1.166-2.723 2.723c-.359.358.197.914.556.556l2.723-2.723 1.465 1.465-8.352 8.353zm3.17-13.534l1.438 1.437-7.338 7.338-1.782.247-.67-.67 8.352-8.352zM13.917.9a.394.394 0 0 1 .556 0L19.1 5.527a.394.394 0 0 1 0 .556L17.671 7.51 12.489 2.33 13.917.901zM3.203 11.976l.628.627c.087.088.21.129.332.112l1.583-.22-.243 1.552a.399.399 0 0 0 .456.448l1.54-.267-.151 1.692c-.01.116.031.23.113.313l.563.563-3.039.955a4.995 4.995 0 0 0-2.737-2.737l.955-3.038zm-1.191 3.791a4.188 4.188 0 0 1 2.22 2.22L.994 19.007l1.018-3.239zM19.524 19.048a.48.48 0 0 0-.476.476c0 .259.217.476.476.476a.482.482 0 0 0 .476-.455.481.481 0 0 0-.476-.497z"/>
				<path d="M11.905 10.476a.482.482 0 0 0-.476.476c0 .26.217.477.476.477a.481.481 0 0 0 .475-.456.481.481 0 0 0-.475-.497z"/>
			</g>
		</svg>
		<span :style="`color:${colorChange} !important`">Editar</span>
	</button>
</template>
<script>
function clicked() {
	this.$emit('click');
}

function colorChange() {
	return this.active ? this.globalColors.primary : this.globalColors.title;
}

export default {
	name: 'edit-component',
	computed: {
		colorChange,
	},
	methods: {
		clicked,
	},
	props: {
		active: {
			default: false,
			type: Boolean,
		},
	},
};
</script>
<style lang="scss" scoped>
	.edit {
		fill: color(dark);
	}

	.active {
		fill: color(primary);
	}

	.edit-user-button {
		align-items: center;
		display: flex;
		justify-content: flex-start;

		svg {
			margin-right: 10px;
		}
	}
</style>

