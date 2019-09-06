<template>
	<div class="list-category">
		<div class="wrapper-name-category" :style="`border-color: ${globalColors.primary}`">
			<button 
				class="title-category mr-5" 
				:style="data.selectFirst ? `color: ${globalColors.primary}` : `color: ${globalColors.dark}`"
				@click="$emit('change-category', data.id)"	
			>
				<img :src="data.webImage" :alt="data.title" class="mr-3">
				{{data.title}}
			</button>
			<button @click="$emit('open-category', data.id)">
				<simple-svg
					filepath="/static/img/arrow-left.svg"
					:fill="globalColors.primary"
					width="11"
					class="icon"
					:class="{'rotate-icon': data.open}"
				/>
			</button>
		</div>
		<transition  name="slide">
			<div v-if="data.detail.length && data.open" class="wrapper-subcategory">
				<div v-for="subCategory in data.detail" :key="subCategory.id">
					<button 
						class="text-subcategory mb-1"
						:style="subCategory.selectSecond ? `color: ${globalColors.secondary}` : `color: ${globalColors.base}`"
						@click="$emit('change-sub-category', data.id, subCategory.id)"
					>{{subCategory.title}}</button>
					<div v-if="subCategory.detail.length" class="wrapper-subsubcategory">
						<button 
							v-for="subSubCategory in subCategory.detail" 
							:key="subSubCategory.id"
							@click="$emit('change-sub-sub-category', data.id, subCategory.id, subSubCategory.id)"
							:style="subSubCategory.selectThird ? `color: ${globalColors.secondary}` : `color: ${globalColors.base}`"
							class="text-subsubcategory">{{subSubCategory.title}}</button>
					</div>
				</div>
			</div>
		</transition>
	</div>
</template>
<script>
export default {
	name: 'list-category',
	props: {
		data: {
			type: Object,
			default: () => {},
		},
	},
};
</script>
<style lang="scss" scoped>
	.list-category {
		margin-bottom: 30px;

		.wrapper-name-category {
			border-bottom: 2px solid;
			display: inline-flex;
			margin-bottom: 15px;
			padding-bottom: 3px;

			@media (max-width: 986px) {
				display: flex;
				justify-content: space-between;
				padding: 7px 25px;
			}
		}

		.title-category {
			align-items: center;
			display: flex;
			font-family: font(bold);
			font-size: size(xlarge);
		}

		.wrapper-subcategory {
			padding-left: 27px;

			@media (max-width: 986px) {
				padding-left: 0px;
			}
		}

		.text-subcategory {
			color: color(base);
			position: relative;

			&::before {
				content: '';
				background: color(black);
				border-radius: 50%;
				height: 5px;
				left: -12px;
				position: absolute;
				top: 7px;
				width: 5px;

				@media (max-width: 986px) {
					left: 22px;
					top: 30px;
				}	
			}

			@media (max-width: 986px) {
				border-bottom: 1px solid color(secondary);
				display: block;
				padding: 22px 22px 22px 40px;
				text-align: left;
				width: 100%;
			}
		}

		.text-subsubcategory {
			color: color(base);
			display: block;

			@media (max-width: 986px) {
				border-bottom: 1px solid color(border);
				padding: 14px 0 14px 15%;
				text-align: left;
				width: 100%;
			}
		}
		
		.wrapper-subsubcategory {
			margin: 8px 0;
			padding-left: 20px;

			@media (max-width: 986px) {
				padding-left: 0px;
			}
		}

		&:first-child {
			margin-top: 50px;

			@media (max-width: 986px) {
				margin-top: 30px;
			}
		}
		
		.icon {
			transform: rotateZ(270deg);

			&.rotate-icon {
				transform: rotateZ(450deg);
			}
		}
	}
</style>