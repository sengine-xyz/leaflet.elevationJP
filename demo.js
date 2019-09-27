$(document).ready(function(){


	var map = L.map('map', {
		zoomAnimation: false,
		zoomControl: false,
		inertia: false,
		maxZoom: 18, 
		minZoom: 6,
		maxBounds: [[80, 0], [-80, 360]],
		maxBoundsViscosity: 1,
		worldCopyJump: false,
		preferCanvas: false,
		zoomSnap: 1,
		zoomDelta: 1,
		wheelPxPerZoomLevel: 240,
		padding: 0,
		doubleClickZoom: false,
		renderer: L.canvas()
	}).setView(new L.LatLng(35.681236, 139.767125), 12);


	new ElevitionJP().addTo(map);

	var tile = L.tileLayer('https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}', {
		attribution: "<a href='https://developers.google.com/maps/documentation' target='_blank'>Google Map</a>"
	});
	map.addLayer(tile);



});