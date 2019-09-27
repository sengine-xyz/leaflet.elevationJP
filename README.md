# leaflet.elevationJP

A simple leaflet plugin for mouse point elevation.
Only wonk in japan area.
Based on https://maps.gsi.go.jp/development/api.html.

Here is the [demo](https://sengine.xyz/static/ElevitionJP/demo.html) site.

Depend on jquery underscore.js.

##Usage

load the src/ElevitionJP.js in your page.

```
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

```

