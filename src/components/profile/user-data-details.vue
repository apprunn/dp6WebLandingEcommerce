<template>
	<section class="info-container">
		<div class="col">
			<p>
				<span class="label">Nombre:</span>
				<span class="user-content">{{user.name}}</span>
			</p>
			<p>
				<span class="label">Apellidos:</span>
				<span class="user-content">{{user.lastname}}</span>
			</p>
			<p>
				<span class="label">Género:</span>
				<span class="user-content">{{getGenderName(user.gender)}}</span>
			</p>
			<p>
				<span class="label">Teléfono:</span>
				<span class="user-content">{{getValue('phone', user)}}</span>
			</p>
			<p>
				<span class="label">{{countryLabels.province}}:</span>
				<span class="user-content">{{provinceHandler()}}</span>
			</p>
			<p>
				<span class="label">Correo:</span>
				<span class="user-content">{{getValue('email', user)}}</span>
			</p>
		</div>
		<div class="col">
			<p>
				<span class="label">{{labelCountry}}:</span>
				<span class="user-content">{{getValue('typePerson.documentNumber', user)}}</span>
			</p>
			<p>
				<span class="label">RUC:</span>
				<span class="user-content">{{getValue('ruc', user)}}</span>
			</p>
			<p>
				<span class="label">Código postal:</span>
				<span class="user-content">{{getValue('postalCode', user)}}</span>
			</p>
			<p>
				<span class="label">{{countryLabels.department}}:</span>
				<span class="user-content">{{departmentsHandler()}}</span>
			</p>
			<p>
				<span class="label">{{countryLabels.district}}:</span>
				<span class="user-content">{{districtsHandler()}}</span>
			</p>
		</div>
	</section>
</template>
<script>
import { mapGetters } from 'vuex';
import { getDeeper, isEmpty, equality, find } from '@/shared/lib';
import userDataValidation from '@/mixins/userDataValidation';

function getGenderName(id) {
	const { title } = find(equality('id', id), this.genders) || {};
	return title;
}

function getValue(route, user) {
	return getDeeper(route)(user);
}

function departmentsHandler() {
	if (isEmpty(this.departments)) {
		return '--';
	}
	const { name } = find(equality('id', this.user.provinceId), this.departments) || {};
	return name;
}

function districtsHandler() {
	if (isEmpty(this.districts)) {
		return '--';
	}
	const { name } = find(equality('id', this.user.parishId), this.districts) || {};
	return name;
}

function provinceHandler() {
	if (isEmpty(this.provinces)) {
		return '--';
	}
	const { name } = find(equality('id', this.user.cityId), this.provinces) || {};
	return name;
}

function labelCountry() {
	return getDeeper('company.country.countryCode')(this.user) === 'ECU' ? 'Cédula' : 'DNI';
}

export default {
	name: 'user-data-details',
	computed: {
		...mapGetters([
			'departments',
			'districts',
			'genders',
			'provinces',
			'user',
		]),
		labelCountry,
	},
	mixins: [userDataValidation],
	methods: {
		departmentsHandler,
		districtsHandler,
		getGenderName,
		getValue,
		provinceHandler,
	},
	watch: {
		departments: departmentsHandler,
		districts: districtsHandler,
		provinces: provinceHandler,
	},
};
</script>
<style lang="scss" scoped>
	.info-container {
		align-items: flex-start;
		display: grid;
		font-family: font(medium);
		grid-column-gap: 50px;
		grid-template-columns: 1fr 1fr;
		margin: 0 auto;
		width: 280px;
	}

	.label {
		color: color(base);
		display: block;
		font-size: size(small);
	}

	.user-content {
		color: color(dark);
		font-size: size(medium);
	}
</style>

