<template>
<div
v-if="webImage || mobileImage"
class="app-banner-plans"
:class="[big ? 'big' : null, small ? 'small' : null]">
			<div
			:class="[
			'banner-plans-height',
			big ? 'big' : null, small ? 'small' : null,]">
				<div class="opacity">
					<picture>
						<source :srcset="webImage" media="(min-width: 600px)">
						<a 
					v-if="webLink"
					:href="webLink"
					target="_blank"
					class="link-plans"
					>
					</a>
						<img :src="mobileImage">
					</picture>
				</div>
		</div>
</div>
</template>

<script>
import { getDeeper } from '@/shared/lib';

function webLink() {
	return getDeeper('webLink')(this.data);
}

function webImage() {
	return getDeeper('webImage')(this.data);
}

function mobileImage() {
	return getDeeper('mobileImage')(this.data);
}

export default {
	name: 'app-banner-plans',
	computed: {
		webImage,
		webLink,
		mobileImage,
	},
	props: {
		data: {
			type: Object,
			default: () => {},
		},
		big: {
			type: Boolean,
			default: false,
		},
		small: {
			type: Boolean,
			default: false,
		},
	},
};
</script>

<style lang="scss" scoped>
.app-banner-plans {
	background-color: color(white);
	height: 379px;

	@media (max-width: 764px) {
		padding: 7px 5%;
	}

	&.big {
		padding: 0;
		position: relative;

		@media (max-width: 764px) {
			height: 400px;
		}
	}

	&.small {
		padding: 0;
	}
}

.big {
	height: 378px;

	@media (max-width: 764px) {
		height: 420px;
	}
}

img {
	height: 378px;
	object-fit: fill;
	width: 100%;
}

.banner-plans-height {
	height: 100%;
	position: relative;
}

.opacity::before {
	content: '';
	position: absolute;
	top: 0;
	right: 0;
	left: 0;
	bottom: 0;
}

.link-plans {
	bottom: 0;
	display: block;
	height: 100%;
	left: 0;
	position: absolute;
	right: 0;
	top: 0;
	width: 100%;
}
</style>