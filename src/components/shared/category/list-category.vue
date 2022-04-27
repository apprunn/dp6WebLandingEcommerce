<template>
	<div class="list-category">
		<div
			class="wrapper-name-category"
			:style="idSelect(data.id) ? `border-color: ${globalColors.primary}` : `border-color: ${globalColors.base}`"
		>
			<button
				:title="data.title"
				class="title-category mr-5" 
				:style="idSelect(data.id) ? `color: ${globalColors.primary}` : `color: ${globalColors.dark}`"
				@click="$emit('change-category', data)"	
			>
				<img :src="data.webImage" class="mr-3" width="25">
				<span>{{data.title}}</span>
			</button>
			<button
				v-if="data.detail.length"
				@click="$emit('open-category', data.id)"
				class="simple-svg-container"
			>
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
			<div v-if="data.detail.length && (idSelect(data.id) || data.open)" class="wrapper-subcategory">
				<v-treeview
					:items="data.detail"
					item-children="detail"
					open-all
					item-text="title"
					expand-icon="fiber_manual_record"
					item-key="id"
					activatable
					@update:active="goToCategories"
					return-object
				>
					<template slot="label" slot-scope="{ item }">
						<button
							:style="`color:${idSelect(item.id) ? globalColors.secondary : globalColors.title}`"
						>
							{{item.title}}
						</button>
					</template>
				</v-treeview>
			</div>
		</transition>
	</div>
</template>
<script>

function idSelect(id) {
	return this.breadcrumbs.find(b => b.id === id);
}

function goToCategories(item) {
	if (item.length) {
		const id = item[0];
		this.$emit('change-category', id);
	}
}

export default {
	name: 'list-category',
	methods: {
		idSelect,
		goToCategories,
	},
	props: {
		data: {
			type: Object,
			default: () => {},
		},
		breadcrumbs: {
			data: {
				type: Array,
				default: () => [],
			},
		},
	},
};
</script>
<style lang="scss" scoped>
	.list-category {
		margin-bottom: 30px;

		.wrapper-name-category {
			border-bottom: 1px solid;
			display: flex;
			justify-content: space-between;
			margin-bottom: 15px;
			padding-bottom: 10px;

			@media (max-width: 986px) {
				padding: 7px 25px;
			}
		}

		.title-category {
			align-items: center;
			display: flex;
			font-family: font(bold);
			font-size: size(medium);

			span {
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}

		.wrapper-subcategory {
			padding-left: 27px;

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

	.simple-svg-container {
		width: 1rem;
	}
</style>