/* This is poster.js */

function wrap_text(context, text, x, y, maxWidth, lineHeight) {
    var cars = text.split("\n");

    for (var ii = 0; ii < cars.length; ii++) {

        var line = "";
        var words = cars[ii].split(" ");

        for (var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + " ";
            var metrics = context.measureText(testLine);
            var testWidth = metrics.width;

            if (testWidth > maxWidth) {
                context.fillText(line, x, y);
                line = words[n] + " ";
                y += lineHeight;
            }
            else {
                line = testLine;
            }
        }

        context.fillText(line, x, y);
        y += lineHeight;
    }
 };

function clear_canvas(canvas) {
	var ctx=canvas.getContext("2d");
	ctx.save();

	// Use the identity matrix while clearing the canvas
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Restore the transform
	ctx.restore();
};

function create_poster(data) {	
	var canvas = document.getElementById("poster_canvas");
	var ctx=canvas.getContext("2d");

	font_size = Math.sqrt((canvas.width * canvas.height) / data.term.length);


	clear_canvas(canvas);
	
	ctx.fillStyle = data.colorset[0];
    ctx.fillRect (0, 0, canvas.width, canvas.width);

	ctx.font = font_size + "px " + data.font;
	ctx.fillStyle = data.colorset[1];

	wrap_text(ctx, data.term, 50, font_size + 10, canvas.width - 50, font_size + 10);
};

var pusher = new Pusher('b66e206fbe2cbb7a98bc'); // uses your APP KEY
var channel = pusher.subscribe('posters_channel');
channel.bind('new_poster', create_poster);