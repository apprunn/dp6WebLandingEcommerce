<template>
	<GmapMap
		:center="center"
		:zoom="zoom"
		style="width:100%;height:400px;"
		@click="setCoords"
	>
	<GmapMarker
		:key="index"
		v-for="(m, index) in markers"
		:position="m.location"
		:clickable="true"
		:draggable="true"
		@dragend="updateCoordinates($event.latLng)"
		@click="selectedMarker(m)"
	/>
	</GmapMap>	
</template>
<script>

function selectedMarker(args) {
	this.$store.commit('SET_DELIVERY_PLACE', args);
}

function updateCoordinates(location) {
	const coordinates = {
		lat: location.lat(),
		lng: location.lng(),
	};
	this.$store.commit('UPDATE_LOCATION', coordinates);
}

function setCoords() {}

export default {
	name: 'map-component',
	methods: {
		setCoords,
		selectedMarker,
		updateCoordinates,
	},
	props: {
		center: {
			default() {
				return {
					lat: -12.1192694,
					lng: -77.0290169,
				};
			},
			type: Object,
		},
		markers: {
			default: () => [],
			type: Array,
		},
		zoom: {
			default: 12,
			type: Number,
		},
	},
};
</script>
