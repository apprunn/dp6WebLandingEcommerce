<template>
	<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25">
		<g :style="`fill:${active ? 'white' : globalColors.primary};`">
			<path d="M16.349 8.132C16.349 3.64 12.702 0 8.183 0 3.67 0 0 3.648 0 8.132c0 4.502 3.67 8.164 8.183 8.164 1.716 0 3.4-.55 4.787-1.555l1.326 1.326-.303.3a.43.43 0 0 0-.003.609l4.358 4.395a2.15 2.15 0 0 0 3.271-.274c.605-.839.477-2.055-.296-2.828l-4.292-4.329a.43.43 0 0 0-.642.036c-.019.02-.08.084-.266.272l-1.33-1.33a8.18 8.18 0 0 0 1.556-4.786zm-1.442 7.33l-1.265-1.264c.213-.192.416-.395.608-.608l1.266 1.266c-.18.18-.384.383-.61.606zM.86 8.132C.86 4.122 4.145.86 8.183.86c4.029 0 7.306 3.263 7.306 7.273 0 3.997-3.247 7.305-7.306 7.305C4.145 15.437.86 12.16.86 8.132zm15.87 6.725l3.984 4.018c.48.48.569 1.219.208 1.72a1.29 1.29 0 0 1-1.965.17l-4.054-4.089c.515-.51 1.32-1.307 1.827-1.819z"/>
		</g>
	</svg>
</template>
<script>
export default {
	name: 'search-component',
	props: {
		active: {
			default: false,
			type: Boolean,
		},
	},
};
</script>
