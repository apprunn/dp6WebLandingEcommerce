<template>
	<div>
		<section class="user-header">
			<edit-component @click="editing" class="mr-3" :active="editActive"/>
			<UploadImage
				text
				no-input
				transparent
				@url-image="updateUserAvatar"
			/>
		</section>
		<section>
			<h3
				:style="`color: ${globalColors.primary};`"
				class="section-title"
			>Mis datos personales</h3>
		</section>
		<router-view></router-view>
	</div>
</template>
<script>
import cameraComponent from '@/components/shared/icons/camera-component';
import editComponent from '@/components/shared/icons/edit-component';
import { mapGetters } from 'vuex';
import UploadImage from '@/components/shared/upload-image';

function created() {
	this.loadGeoData();
}

async function loadGeoData() {
	const { provinceId, cityId } = this.user;
	this.$store.dispatch('LOAD_DEPARTMENTS', this);
	if (provinceId) {
		this.$store.dispatch('LOAD_PROVINCES', { context: this, provinceId });
	}
	if (cityId) {
		this.$store.dispatch('LOAD_DISTRICTS', { context: this, cityId });
	}
}

function editing() {
	this.$router.push({ name: 'edit-user-data' });
}

async function updateUserAvatar(urlImage) {
	const url = 'customers-public';
	const body = { urlImage };
	try {
		await this.$httpSales.patch(url, body);
		this.getCustomerData();
		this.showNotification('Imagen de usuario actualizada', 'success');
	} catch (err) {
		this.showNotification('No fue posible actualizar la imagen de usuario', 'error');
	}
}

async function getCustomerData() {
	const { data: userInfo } = await this.$httpSales.get('customers/current');
	this.$store.dispatch('setUser', userInfo);
	this.setLocalData('ecommerce::ecommerce-user', userInfo);
	this.setLocalData('ecommerce-user', userInfo);
	this.$userInfo = this.$store.getters.user;
}

function routeHandler(newRoute) {
	this.editActive = newRoute === 'edit-user-data';
}

function data() {
	return {
		editActive: false,
	};
}

export default {
	name: 'user-data',
	components: {
		cameraComponent,
		editComponent,
		UploadImage,
	},
	computed: {
		...mapGetters([
			'user',
		]),
	},
	created,
	data,
	methods: {
		getCustomerData,
		editing,
		updateUserAvatar,
		loadGeoData,
		routeHandler,
	},
	watch: {
		'$route.name': routeHandler,
	},
};
</script>
<style lang="scss" scoped>
	.user-header {
		display: flex;
		margin-bottom: 20px;
		margin-left: 40px;
	}

	.section-title {
		font-family: font(bold);
		font-size: size(large);
		margin-bottom: 50px;
		margin-left: 40px;
		text-transform: uppercase;

		@media (max-width: 500px) {
			margin-bottom: 20px;
		}
	}

	.info-container {
		align-items: flex-start;
		display: grid;
		font-family: font(medium);
		grid-column-gap: 50px;
		grid-template-columns: 1fr 1fr;
		margin: 0 auto;
		width: 280px;
	}

	.user-content {
		color: color(dark);
		font-size: size(medium);
	}
</style>

