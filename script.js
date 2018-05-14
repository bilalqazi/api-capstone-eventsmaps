const MEETUP_SEARCH_URL = 'https://api.meetup.com/find/upcoming_events';

const MAPS_SEARCH_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

const MAPS_API_KEY = 'AIzaSyAPy0e7dVS6hPQaHYgSHd6n7cSPkkwxZt0';

var map;

var searchQuery;

var radius;

var searchLat;

var searchLon;

var infowindow;

var markersArray = [];

function setupQueryListener() {

	$('#js-form').submit(function(event){
		event.preventDefault();

		searchQuery = $('#js-topics').val();
		const location = $('#js-location').val();
		radius = $('#js-radius').val();
		console.log(searchQuery, location, radius);
		geocodeLocation(location);
	});
};

function geocodeLocation(location) {
	console.log(location);
	const settings = {
		url: MAPS_SEARCH_URL,
		data: {
			address: location,
			key: MAPS_API_KEY
		},
		dataType: 'json',
		type: 'GET',
		success: function(data) {
			console.log(data.results[0].geometry.location.lat, data.results[0].geometry.location.lng);
			searchLat = data.results[0].geometry.location.lat;
			searchLon = data.results[0].geometry.location.lng;
			console.log(searchQuery, searchLat, searchLon);
			getDataFromApi(searchQuery, searchLat, searchLon);
		}
	};
	$.ajax(settings);
};

function getDataFromApi(searchQuery, lat, lon) {
	console.log(radius);
	const settings = {
		url: MEETUP_SEARCH_URL,
		data: {
			lat: searchLat,
			lon: searchLon,
			order: 'time',
			page: 32,
			radius: radius, 
			text: searchQuery,
			key: '501f552e7131947b686e2e3b1a149'
		},
		dataType: 'jsonp',
		type: 'GET',
		success: displayAndRenderData
	};
	$.ajax(settings);
};

function initMap(){

	map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: searchLat, lng: searchLon},
        zoom: 12
    });
};

function displayAndRenderData(data) {

	initMap();
	let eventsHtml = '';
	var localMarkersArray = [];
	for (let i=0; i < data.data.events.length; i++) {
		let eachEvent = data.data.events[i];
		let eachEventHtml = renderEvent(eachEvent);
		
		if (data.data.events[i].venue && data.data.events[i].venue.lat && data.data.events[i].venue.lat) {
			let eachEventLat = data.data.events[i].venue.lat;
			let eachEventLon = data.data.events[i].venue.lon;
			eventsHtml += eachEventHtml;

			var marker = new google.maps.Marker({
	  			position: {lat: eachEventLat, lng: eachEventLon},
	  			map: map
	  		});
	  		localMarkersArray.push(marker);
	  		infowindow = new google.maps.InfoWindow({
	  			content: eachEvent.description
	  		});
	  		//google.maps.event.addListener(marker, 'click', function () {
	  			
	  			//infowindow.setContent(eachEvent.description);
	  			//infowindow.open(map, this);
	  		//});
	  		var html = 
	  			`<div class="infowindow">
	  				<a href="#${eachEvent.name}">
	  					<h3>${eachEvent.name}</h3>
	  				</a>
					<h4>Description:</h4>
					${eachEvent.description}
				</div>`
			bindInfoWindow(marker, map, infowindow, html)
		};
		markersArray = localMarkersArray;
		centerMap();
	}
	$('#js-results').html(eventsHtml);
};

function centerMap() {
	var bounds = new google.maps.LatLngBounds();
	$.each(markersArray, function (index, marker) {
		bounds.extend(marker.position);
	});
	map.fitBounds(bounds);
};

function bindInfoWindow(marker, map, inforwindow, html) {
	marker.addListener('click', function() {
		map.panTo(marker.getPosition());
		infowindow.setContent(html);
		infowindow.open(map, this);
		google.maps.event.addListener(map, "click", function(event) {
		    infowindow.close();
		});
	});
}



function renderEvent(eachEvent){
	
	let eachEventHtml = 
		`<div class="results-div">
			<a href="${eachEvent.link}" name="${eachEvent.name}">
				<h1 class="results-title">${eachEvent.name}</h1>
			</a>
			<h2 class="results-datetime">
				When: ${eachEvent.local_date} @ ${eachEvent.local_time}
			</h2>
			<div class="results-description">
			${eachEvent.description}
			</div>
			<a href="#back-to-the-top"><p class="return">Return to the top</p></a>
		</div>`

	return eachEventHtml;
}

$(setupQueryListener);

