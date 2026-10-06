<template>
	<div
		class="whatsapp-button"
		v-if="ecommerceLocal && ecommerceLocal.whatsappNumber"
		@click="openWhatsApp"
	>
		<a href="https://wa.me/11234567890" target="_blank" class="whatsapp-icon">
			<img
				src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
				alt="WhatsApp"
				width="60"
				height="60"
			/>
		</a>
	</div>
</template>

<script>
export default {
	name: 'app-botton-whatsapp',
	created() {
		this.ecommerceLocal = this.getLocalStorage('ecommerce::ecommerce-data');
	},
	data() {
		return {
			ecommerceLocal: null,
		};
	},
	methods: {
		openWhatsApp() {
			window.open(
				`https://wa.me/${this.ecommerceLocal.whatsappNumber}`,
				'_blank',
			);
		},
	},
};
</script>
<style lang="scss" scoped>
.whatsapp-button {
	position: fixed;
	bottom: 40px;
	right: 20px;
	z-index: 1000;
	cursor: pointer;
}

.whatsapp-icon {
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: #25d366;
	border-radius: 50%;
	padding: 10px;
	box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
	transition: background-color 0.3s ease;
}

.whatsapp-icon img {
	width: 40px;
	height: 40px;
}

.whatsapp-icon:hover {
	background-color: #128c7e;
}
</style>

