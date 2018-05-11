const MEETUP_SEARCH_URL = 'https://api.meetup.com/find/upcoming_events';

const MAPS_SEARCH_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

const MAPS_API_KEY = 'AIzaSyAPy0e7dVS6hPQaHYgSHd6n7cSPkkwxZt0';

var map;

var searchQuery;

var searchLat;

var searchLon;

function setupQueryListener() {

	$('#js-form').submit(function(event){
		event.preventDefault();

		searchQuery = $('#js-topics').val();
		const location = $('#js-location').val();
		console.log(searchQuery, location);
		geocodeLocation(location);
	});
};

function geocodeLocation(location) {
	console.log(location);
	const settings1 = {
		url: MAPS_SEARCH_URL,
		data: {
			address: location,
			key: MAPS_API_KEY
		},
		dataType: 'json',
		type: 'GET',
		success: getLatAndLong
	};
	$.ajax(settings1);
};

function getLatAndLong(data) {
	console.log(data.results[0].geometry.location.lat, data.results[0].geometry.location.lng);
	searchLat = data.results[0].geometry.location.lat;
	searchLon = data.results[0].geometry.location.lng;
	console.log(searchQuery, searchLat, searchLon);
	getDataFromApi(searchQuery, searchLat, searchLon);
};

function getDataFromApi(searchQuery, lat, lon) {
	
	const settings = {
		url: MEETUP_SEARCH_URL,
		data: {
			lat: searchLat,
			lon: searchLon,
			text: searchQuery,
			key: '501f552e7131947b686e2e3b1a149',
			radius: 15
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
	for (let i=0; i < data.data.events.length; i++) {
		let eachEvent = data.data.events[i];
		let eachEventHtml = renderEvent(eachEvent);
		eventsHtml += eachEventHtml;



	}
	$('#js-results').html(eventsHtml);
};

function renderEvent(eachEvent){
	
	let eachEventHtml = `
		<div>
			<h1>
				Name: ${eachEvent.name}
			</h1>
			<!-- <p>Description:</p> 
			${eachEvent.description}
			<p>
				When: ${eachEvent.local_date} @ ${eachEvent.local_time}
			</p> -->
		</div>
	`
	return eachEventHtml;
}

$(setupQueryListener);

