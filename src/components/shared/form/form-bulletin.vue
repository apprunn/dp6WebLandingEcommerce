<template>
	<div class="form-bulletin">
		<div class="form-bulletin-description-company">
			<div class="content-date-company" @click="redirectToWhatsApp(getCommerceData.phone)" style="cursor: pointer;">
				<PhoneIcon/>
				<p
					:class="[
						'item-date-company',
						{ 'loading': indeterminate },
					]"
				>
					{{ getCommerceData.phone }}
				</p>
			</div>
			<div class="content-date-company" @click="sendEmail(getCommerceData.email)" style="cursor: pointer;">
				<EmailIcon/>
				<p
					:class="[
						'item-date-direction email',
						{ 'loading': indeterminate },
					]"
				>
					Correo: {{ getCommerceData.email }}
				</p>
			</div>
			<div class="content-date-company" @click="openMap(getCommerceData.address)" style="cursor: pointer;">
				<LocationIcon/>
				<p
					:class="[
						'item-date-direction',
						{ 'loading': indeterminate },
					]"
				>
					{{ getCommerceData.address }}
				</p>
			</div>
		</div>
	</div>
</template>


<script>
import { mapGetters } from 'vuex';
import EmailIcon from '@/components/shared/icons/email-component';
import LocationIcon from '@/components/shared/icons/location';
import PhoneIcon from '@/components/shared/icons/phone-component';

export default {
	name: 'form-bulletin',
	components: {
		EmailIcon,
		LocationIcon,
		PhoneIcon,
	},
	methods: {
		redirectToWhatsApp(phone) {
			const whatsappUrl = `https://wa.me/${phone}`;
			window.open(whatsappUrl, '_blank');
		},
		sendEmail(email) {
			const mailtoUrl = `mailto:${email}`;
			window.location.href = mailtoUrl;
		},
		openMap(address) {
			const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
			window.open(mapUrl, '_blank');
		},
	},
	computed: {
		...mapGetters([
			'getCommerceData',
			'indeterminate',
		]),
	},
};
</script>

<style lang="scss" scoped>
.button-form {
	background-color: color(dark);
	border-bottom-right-radius: 6px;
	border-top-right-radius: 6px;
	bottom: 1px;
	color: color(white);
	font-family: font(demi);
	font-size: size(medium);
	min-height: 39px;
	position: relative;
	width: 128px;
}

.text-subscription {
	color: color(dark);
	font-family: font(demi);
	font-size:  size(medium);
	margin-bottom: 45px;
	text-align: center;

	@media (max-width: 850px) {
		margin-bottom: 31px;
		text-align: center;
	}
}

.text-subscription::before {
		border-top: 1px solid color(base);
		content: '';
		color: color(dark);
		height: 3px;
		left: 10px;
		position: absolute;
		top: 9px;
		width: 110px;
	@media (max-width: 850px) {
		left: 15px;
		width: 80px;
	}

}

.text-subscription::after {
	border-top: 1px solid color(base);
	color: color(dark);
	content: '';
	height: 3px;
	position: absolute;
	right: 8px;
	top: 9px;
	width: 110px;

	@media (max-width: 850px) {
		right: 12px;
		width: 80px;
	}
}

.form-bulletin {
	align-items: center;
	box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.08);
	display: flex;
	justify-content: space-around;
	height: 209px;
	padding: 40px 0;
	width: 100%;
	z-index: 10px;
	@media (max-width: 768px) {
		flex-direction: column;
		height: 411px;
		padding: 15px 0;
	}
}

.item-date-company {
	color: color(dark);
	font-family: font(bold);
	font-size: 16px;
	margin: 0 0 0 20px;
	max-width: 136px;
	white-space: nowrap;

	@media (max-width: 850px) {
		font-size: size(xlarge);
		max-width: 151px;
		padding-top: 17px;
		white-space: break-spaces;
	}
}

.content-date-company {
	align-items: center;
	color: color(dark);
	display: flex;
	margin-top: 11px;

	@media (max-width: 850px) {
		flex-direction: column;
	}
}

.item-date-direction {
	font-size: size(minmedium);
	margin: 0 0 0 20px;
	max-width: 170px;

	@media (max-width: 850px) {
		padding-top: 17px;
		text-align: center;
	}
}

.input-form {
	border: 1px solid color(dark);
	border-radius: 6px;
	bottom: 1px;
	font-size: size(minmedium);
	left: 8px;
	min-height: 39px;
	padding-left: 13px;
	position: relative;
	width: 282px;

	@media (max-width: 650px) {
		font-size: size(minmedium);
		padding-left: 13px;
		width: 197px;
	}
}

.form-bulletin-description-company {
	display: flex;
	flex-direction: column;
	height: 100%;
	justify-content: space-around;
	width: 100%;
	@media (min-width: 768px) {
		align-items: center;
		flex-direction: row;
	}
}

.content-description {
	position: relative;
}

.content-email {
	align-items: center;
	display: flex;
}

.email {
	white-space: nowrap;
}
</style>
