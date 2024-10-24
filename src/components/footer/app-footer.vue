<template>
	<div class="app-footer">
		<section-links :menu="helperCenter"></section-links>
		<div class="content-company-footer">
			<p class="company-footer">© 2019 power by Apprunn.com</p>
			<router-link :to="{ name: 'reclamaciones' }" v-if="isPeru">
				Libro de Reclamaciones
			</router-link>
			<div>
				<a
					v-for="social in getCommerceData.socialNetworks"
					:key="social.id"
					:href="social.link"
					target="_blank"
				>
					<img
						v-if="social.logo"
						:src="getSocial(social.code)"
						alt="logo-redes-sociales"
						class="social-logo"
					/>
				</a>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import sectionLinks from '@/components/footer/section-links';

function helperCenter() {
	if (this.getCommerceData && this.getCommerceData.helperCenter) {
		return this.getCommerceData.helperCenter.reduce((acum, hc) => {
			const newHc = { ...hc };
			const section = { ...newHc.section[0] };
			delete newHc.section;
			const sectionIndex = acum.findIndex(a => a.id === section.id);
			if (sectionIndex > -1) {
				acum[sectionIndex].details.push({ ...newHc });
			} else {
				const newSection = {
					code: section.code,
					id: section.id,
					name: section.name,
					details: [{ ...newHc }],
				};
				acum.push(newSection);
			}
			return acum;
		}, []);
	}
	return [];
}

export default {
	name: 'app-footer',
	data() {
		return {
			socialIcons: {
				facebook: '/static/img/icons/facebook.svg',
				youtube: '/static/img/icons/youtube.svg',
				instagram: '/static/img/icons/instagram.svg',
				twitter: '/static/img/icons/twitter.svg',
				tiktok: '/static/img/icons/tiktok.svg',
			},
		};
	},
	components: {
		sectionLinks,
	},
	computed: {
		...mapGetters(['getCommerceData']),
		helperCenter,
	},
	methods: {
		getSocial(code) {
			return (
				this.socialIcons[code.toLowerCase()] || '/static/img/icons/error.svg'
			);
		},
	},
};
</script>

<style lang="scss" scoped>
.company-footer {
	color: color(base);
	font-family: font(regular);
	font-size: size(small);
	margin-bottom: 0;

	@media (max-width: 750px) {
		padding-left: 0;
		text-align: center;
	}
}

.content-company-footer {
	align-items: center;
	border-top: 1px solid color(base);
	display: flex;
	justify-content: space-between;
	padding: 17px 35px;
}

.app-footer {
	width: 100%;
	@media (max-width: 669px) {
		margin-bottom: 50px;
	}
}

.social-logo {
	height: 30px;
	margin-left: 10px;
	object-fit: cover;
}
</style>
