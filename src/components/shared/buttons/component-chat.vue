<template>
	<div class="component-chat-opacity">
		<div class="circle-opacity">
			<div class="circle-conversation" :style="`background-color: ${background}`">
				<img :src="icon" alt="">
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'component-chat',
	props: {
		icon: String,
		background: String,
	},
};
</script>

<style lang="scss" scoped>
.circle-conversation {
	align-items: center;
	border-radius: 50%;
	display: flex;
	height: 82px;
	justify-content: center;
	width: 82px;
}

.circle-opacity {
	align-items: center;
	background: rgba(244, 43, 23, 0.5);
	border-radius: 50%;
	display: flex;
	height: 94px;
	justify-content: center;
	width: 94px;
}

.component-chat-opacity {
	align-items: center;
	background: rgba(244, 43, 23, 0.3);
	border-radius: 50%;
	display: flex;
	height: 106px;
	justify-content: center;
	position: absolute;
	width: 106px;
}
</style>
