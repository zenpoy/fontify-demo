/* This is poster.js */

function wrap_text(context, text, x, y, maxWidth, lineHeight, is_simulation) {
    is_simulation= typeof is_simulation !== 'undefined' ? is_simulation : false;
    var cars = text.split("\n");
    var lines_counter = 1;
    for (var ii = 0; ii < cars.length; ii++) {

        var line = "";
        var words = cars[ii].split(" ");

        for (var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + " ";
            var metrics = context.measureText(testLine);
            var testWidth = metrics.width;

            if (testWidth > maxWidth) {
            	if (!is_simulation)
                	context.fillText(line, x, y);
                lines_counter++
                line = words[n] + " ";
                y += lineHeight;
            }
            else {
                line = testLine;
            }
        }
        if (!is_simulation)
        	context.fillText(line, x, y);
        lines_counter++;
        y += lineHeight;
    }
    return lines_counter;
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

	
	clear_canvas(canvas);
	
	ctx.fillStyle = data.colorset[0];
    ctx.fillRect (0, 0, canvas.width, canvas.width);

	font_size = 500;
	ctx.font = font_size + "px " + data.font;
	
	lines = 100;

	while (lines > (canvas.height / (font_size + 10)))
	{
		font_size--;
		ctx.font = font_size + "px " + data.font;
		lines = wrap_text(ctx, data.term, 50, font_size, canvas.width - 50, font_size + 10, true);
	}

	ctx.fillStyle = data.colorset[1];

	wrap_text(ctx, data.term, 50, font_size, canvas.width - 50, font_size + 10);
};

var pusher = new Pusher('b66e206fbe2cbb7a98bc'); // uses your APP KEY
var channel = pusher.subscribe('posters_channel');
channel.bind('new_poster', create_poster);