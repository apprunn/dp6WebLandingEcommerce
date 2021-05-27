<template>
	<div class="opinion">
		<div class="container-avatar" :style="`border-color: ${globalColors.primary}`">
			<img 
				:src="opinion.additionalInformation.customerImage ||
					'https://quipu-admin.s3.amazonaws.com/user-min.svg'" 
				:alt="opinion.additionalInformation.name"
				class="opinion-avatar">
		</div>
		<div class="container-message">
			<div class="container-rating">
				<v-rating
					background-color="#f8e71c"
					color="#f8e71c"
					v-model="opinion.rating"
					readonly
				>
				</v-rating>
			</div>
			<p class="opinion-name">{{opinion.additionalInformation.name}}</p>
			<div class="opinion-text">{{opinion.description}}</div>
		</div>
	</div>
</template>
<script>

export default {
	name: 'opinion',
	props: {
		opinion: {
			type: Object,
			default: () => {},
		},
	},
};
</script>
<style lang="scss" scoped>
	.opinion {
		border: 1px solid color(border);
		border-radius: 3px;
		display: flex;
		margin-bottom: 30px;
		padding: 36px 22px;

		@media screen and (max-width: 996px) {
			padding: 10px 12px;
		}
	}

	.opinion-avatar {
		height: 70%;
		width: 70%;
	}

	.opinion-name {
		font-family: font(bold);
		font-size: size(large);
		margin-right: 10px;
	}

	.opinion-text {
		font-size: size(medium);
	}

	.container-avatar {
		align-items: center;
		border:1px solid;
		border-radius: 50%;
		display: flex;
		height: 94px;
		justify-content: center;
		margin-right: 20px;
		width: 94px;

		@media screen and (max-width: 996px) {
			height: 62px;
			width: 62px;
		}
	}

	.container-message {
		width: calc(100% - 114px);

		@media screen and (max-width: 996px) {
			width: calc(100% - 82px);
		}
	}

	.container-rating {
		text-align: right;
	}

</style>


