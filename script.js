const MEETUP_SEARCH_URL = 'api.meetup.com/find/upcoming_events';

const MAPS_SEARCH_URL = 'dtjd';

function setupQueryListener() {

	$('#js-form').submit(function(event){
		event.preventDefault();

		const query = $('#js-topics').val();
		const location = $('#js-location').val();
		console.log(query, location);

	});

};

$(setupQueryListener);