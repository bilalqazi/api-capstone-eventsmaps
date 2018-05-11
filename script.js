const MEETUP_SEARCH_URL = 'https://api.meetup.com/find/upcoming_events';

const MAPS_SEARCH_URL = 'dtjd';

const MAPS_API_KEY = 'AIzaSyAPy0e7dVS6hPQaHYgSHd6n7cSPkkwxZt0';

var map;

function setupQueryListener() {

	$('#js-form').submit(function(event){
		event.preventDefault();

		const query = $('#js-topics').val();
		const location = $('#js-location').val();
		console.log(query, location);
		getDataFromApi(query, location);
	});
};

function getDataFromApi(query, location) {
	const settings = {
		url: MEETUP_SEARCH_URL,
		data: {
			zip: location,
			text: query,
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
          center: {lat: 30.22, lng: -97.75},
          zoom: 12
    });
};

function displayAndRenderData(data) {
	console.log(data.data.city.lat, data.data.city.lon);
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