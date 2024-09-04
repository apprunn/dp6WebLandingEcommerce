<template>
	<div
		:class="[
			'container-company-data',
			'padding-container',
			{ 'loading loading-company': indeterminate },
		]"
		:style="
			`background: ${indeterminate ? 'transparent' : globalColors.primary}`
		"
	>
		<media-company-data
			v-if="!indeterminate"
			image="https://apprunn-acl.s3.amazonaws.com/icons/phone-icon.svg"
			image-height="20"
			item="call"
			border-right="#ffffff"
			family="medium"
			:description="getCommerceData.phone"
		></media-company-data>
		<media-company-data
			v-if="!indeterminate"
			image="https://apprunn-acl.s3.amazonaws.com/icons/location-icon.svg"
			image-height="20"
			item="location_on"
			border-right="#ffffff"
			family="medium"
			:description="getCommerceData.address"
		></media-company-data>
		<media-company-data
			v-if="!indeterminate"
			image="https://apprunn-acl.s3.amazonaws.com/icons/open-email-icon.svg"
			image-height="20"
			item="email"
			family="medium"
			:description="getCommerceData.email"
		></media-company-data>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import mediaCompanyData from '@/components/shared/company/media-company-data';

export default {
	name: 'container-company-data',
	components: {
		mediaCompanyData,
	},
	computed: {
		...mapGetters(['getCommerceData', 'indeterminate']),
	},
};
</script>

<style lang="scss" scoped>
.padding-container {
	border-radius: 5px;
	padding: 9px 0;

	@media (max-width: 860px) {
		padding: 5px 0;
	}
}

.container-company-data {
	align-items: center;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	// padding: 10px 15px;
	height: 86px;
	justify-content: space-around;
	width: 901px;

	@media screen and (max-width: 860px) {
		min-height: 52px;
		width: 95%;
	}
}

.loading-company {
	filter: brightness(0.9);
}
</style>
