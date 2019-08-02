<template>
	<layout-admin>
		<router-view></router-view>
		<component-chat
		icon="/static/img/icons/icon-conversation.svg"
		:background="baseColor"
		></component-chat>
	</layout-admin>
</template>

<script>
const componentChat = () => import('@/components/shared/buttons/component-chat');

function data() {
	return {
		baseColor: process.env.COLOR_BASE,
	};
}

export default {
	data,
	name: 'page-home',
	components: {
		componentChat,
	},
};
</script>
