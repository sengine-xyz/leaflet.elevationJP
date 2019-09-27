var ElevitionJP = L.Control.extend({
	options: {
		position: 'bottomright'
	},
	demApiURL: '//cyberjapandata2.gsi.go.jp/general/dem/scripts/getelevation.php',
	onAdd: function(map){
		this._container = L.DomUtil.create('div', 'l_elevitionjp');
		L.DomEvent.disableClickPropagation(this._container);
		map.on('mousemove', this._onMouseMove, this);

		var me = this;
		me._lazyDem = _.debounce(function(){
			var requestData = {
				lat: me.currentLatLng.lat,
				lon: me.currentLatLng.lng,
				outtype: 'JSON'
			};
			$.ajax({
				url: me.demApiURL,
				dataType: 'json',
				data: requestData,
				beforeSend: function(jqXHR, settings){
					jqXHR.requestData = requestData;
				}
			}).done(function(data, textStatus, jqXHR) {
				if(jqXHR.requestData.lat == me.currentLatLng.lat && jqXHR.requestData.lon == me.currentLatLng.lng) {
					me.currentDem = data;
					me.resetHtml();
				}
			});
		}, 300);

		me.currentLatLng = {lon: null, lng: null};

		return me._container;
	},

	onRemove: function(map){
		var me = this;
		map.off('mousemove', me._onMouseMove, me);
	},

	_onMouseMove: function(e){
		var me = this;
		me.currentLatLng = e.latlng.clone();
		me.currentDem = {elevation: '-----', hsrc: '-----'};
		me._lazyDem();
		me.resetHtml();
	},

	resetHtml: function(){
		var me = this;
		var zoom = me.currentZoom;
		var lat = me.currentLatLng.lat;
		var lng = me.currentLatLng.lng;
		var html = _.template([
			'<table>', 
			'	<tr><td colspan="2" style="text-align: left;"><%=elevation=="-----" ? "標高: -----" : "標高: " + Math.round(elevation*3.28084) + " ft　" + elevation + " m" %></td></tr>', 
			'	<tr><td><%=lat10%></td><td><%=lng10%></td></tr>', 
			'	<tr><td><%=lat60%></td><td><%=lng60%></td></tr>', 
			'</table>'
		].join('\n'))(_.extend({
			lat10: lat ? me.convertLat2NS(lat, 5) : '',
			lng10: lng ? me.convertLng2EW(lng, 5) : '',
			lat60: lat ? me.convertLat2DMS(lat)   : '',
			lng60: lng ? me.convertLng2DMS(lng)   : '',
			zoom: zoom,
			elevation: '-----',
			hsrc: '-----'
		}, me.currentDem));
		me._container.innerHTML = html;
	},

	convertLng2EW: function(lng, precision) {
		lng = this.getLng0_360(lng);
		if (Math.abs(lng) <= 0.00000001) {
			return (0).toFixed(precision);
		} else if (Math.abs(lng - 180) <= 0.00000001) {
			return (180).toFixed(precision);
		} else if (lng < 180) {
			return(lng.toFixed(precision) + 'E');
		} else {
			return((360 - lng).toFixed(precision) + 'W');
		}
	},
	convertLat2NS: function(lat, precision) {
		if (Math.abs(lat) <= 0.00000001) {
			return (0).toFixed(precision);
		} else if (lat < 0) {
			return((Math.abs(lat)).toFixed(precision) + 'S');
		} else {
			return(lat.toFixed(precision) + 'N');
		}
	},
	convertLng2DMS: function(lng) {
		lng = this.getLng0_360(lng);
		if (Math.abs(lng) <= 0.00000001) {
			return "0°00′00″";
		} else if (Math.abs(lng - 180) <= 0.00000001) {
			return "180°00′00″";
		} else if (lng < 180) {
			return this.convert2DMS(lng) + 'E';
		} else {
			return this.convert2DMS(360 - lng) + 'W';
		}
	},
	convertLat2DMS: function(lat) {
		if (Math.abs(lat) <= 0.00000001) {
			return '0°00′00″';
		} else if (lat < 0) {
			return this.convert2DMS(Math.abs(lat)) + 'S';
		} else {
			return this.convert2DMS(lat) + 'N';
		}
	},
	convert2DMS: function(val) {
		var degrees = Math.floor(val);
		var tmp = (val - degrees) * 60;
		var minutes = Math.floor(tmp);
		var tmp = (tmp - minutes) * 60;
		var seconds = Math.round(tmp);
		if(minutes < 10) minutes = '0' + minutes;
		if(seconds < 10) seconds = '0' + seconds;
		return [degrees, '°', minutes, '′', seconds, '″'].join('');
	},
	getLng0_360: function(lng) {
		if (lng < 0) {
			while (lng < 0) lng += 360;
		} else {
			while (lng > 360) lng -= 360;
		}
		return lng;
	}

});