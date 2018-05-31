const MEETUP_SEARCH_URL = 'https://api.meetup.com/find/upcoming_events';

const MAPS_SEARCH_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

const MAPS_API_KEY = 'AIzaSyAPy0e7dVS6hPQaHYgSHd6n7cSPkkwxZt0';

//endpoints and api key above
//empty  variables below

var map;

var searchQuery;

var radius;

var searchLat;

var searchLon;

var infowindow;

var markersArray = [];

//end of empty variables

function setupQueryListener() { 

//listens for click on submit
//grabs values from form on click
//creates variables
//starts geocoding location

	$('#js-form').submit(function(event){
		event.preventDefault();

		searchQuery = $('#js-topics').val();
		const location = $('#js-location').val();
		radius = $('#js-radius').val();
		geocodeLocation(location);
	});
};

//function to take user input location and return lat/long values
//lat/long values stored in empty variables from above
//runs getDataFromApi as callback function

function geocodeLocation(location) {
	const settings = {
		url: MAPS_SEARCH_URL,
		data: {
			address: location,
			key: MAPS_API_KEY
		},
		dataType: 'json',
		type: 'GET',
		success: function(data) {
			searchLat = data.results[0].geometry.location.lat;
			searchLon = data.results[0].geometry.location.lng;
			getDataFromApi(searchQuery, searchLat, searchLon);
		}
	};
	$.ajax(settings);
};

//uses geocoded location to search meetup.com API for event data
//runs displayAndRenderData as callback

function getDataFromApi(searchQuery, lat, lon) {
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

//initializes map

function initMap(){

	map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: searchLat, lng: searchLon},
        zoom: 12,
        gestureHandling: 'greedy'
    });
};

//calls function to create map
//uses API data to create results that are displayed in infowindows
//runs function to attach info to each marker

function displayAndRenderData(data) {

	initMap();
	let eventsHtml = '';
	var localMarkersArray = [];
	var eventMap = {};
	for (let i=0; i < data.data.events.length; i++) {
		let eachEvent = data.data.events[i];
		let eachEventHtml = renderEvent(eachEvent);
		if (!(eachEvent.name in eventMap)) {
			eventMap[eachEvent.name] = 1
			if (data.data.events[i].venue && data.data.events[i].venue.lat && data.data.events[i].venue.lat) {
				let eachEventLat = data.data.events[i].venue.lat;
				let eachEventLon = data.data.events[i].venue.lon;
				eventsHtml += eachEventHtml;

				var marker = new google.maps.Marker({
		  			position: {lat: eachEventLat, lng: eachEventLon},
		  			map: map,
		  			label: `${i+1}`
		  		});
		  		localMarkersArray.push(marker);
		  		infowindow = new google.maps.InfoWindow({
		  			content: eachEvent.description
		  		});
		  		var html = 
		  			`<div class="infowindow">
		  				<a href="#${eachEvent.name}">
		  					<h3>${eachEvent.name}</h3>
		  				</a>
						<h4>Description:</h4>
						${eachEvent.description}
					</div>`
				bindAndCloseInfoWindow(marker, map, infowindow, html)
			};
			markersArray = localMarkersArray;
			centerMap();
		}
	}
	$('#js-results').html(eventsHtml);
};

//centers map when user clicks on a marker

function centerMap() {
	var bounds = new google.maps.LatLngBounds();
	$.each(markersArray, function (index, marker) {
		bounds.extend(marker.position);
	});
	map.fitBounds(bounds);
};

//attachs the infowindow to each marker as for loop is run
//also adds functionality to close infowindow when user clicks outside the infowindow

function bindAndCloseInfoWindow(marker, map, inforwindow, html) {
	marker.addListener('click', function() {
		map.panTo(marker.getPosition());
		infowindow.setContent(html);
		infowindow.open(map, this);
	});
	google.maps.event.addListener(map, "click", function(event) {
		    infowindow.close();
	});
};

//displays event data in the results section

function renderEvent(eachEvent){
	var epochTime = eachEvent.time
	var d = new Date(epochTime);
	//d.setUTCSeconds(epochTime);
	var formattedDate = d.toLocaleDateString() + " @ " + d.toLocaleTimeString();
	let eachEventHtml = 
		`<div class="results-div">
			<a href="${eachEvent.link}" name="${eachEvent.name}" aria-label="${eachEvent.name}">
				<h1 class="results-title">${eachEvent.name}</h1>
			</a>
			<h2 class="results-datetime">
				When: ${formattedDate}
			</h2>
			<div class="results-description">
			${eachEvent.description}
			</div>
			<a href="#back-to-the-top"><p class="return">Return to the top</p></a>
		</div>`

	return eachEventHtml;
}

$(setupQueryListener);

