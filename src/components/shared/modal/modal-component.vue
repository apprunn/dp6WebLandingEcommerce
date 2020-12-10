<template>
	<v-dialog
		:max-width="maxWidth"
		:value="value"
		@input="showModal"
		:persistent="persistent"
	>
		<slot></slot>
	</v-dialog>	
</template>
<script>

function showModal(val) {
	this.$emit('input', val);
}

export default {
	name: 'modal-component',
	methods: {
		showModal,
	},
	props: {
		maxWidth: {
			default: '80%',
			type: String,
		},
		value: null,
		persistent: {
			type: Boolean,
			default: false,
		},
	},
};
</script>
