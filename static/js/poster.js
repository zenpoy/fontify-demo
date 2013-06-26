/* This is poster.js */

var pusher = new Pusher('b66e206fbe2cbb7a98bc'); // uses your APP KEY
var channel = pusher.subscribe('posters_channel');
channel.bind('new_poster', function(data) {
	alert(	"term: "+ data.term + "\n" +
			"timestamp: "+ data.timestamp + "\n" +
			"font: "+ data.font + "\n" +
			"colorset: "+ data.colorset + "\n"
		);
});