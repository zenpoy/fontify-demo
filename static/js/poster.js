/* This is poster.js */
var fonts = [
                    "Chewy",
                    "Permanent Marker",
                    "Pacifico",
                    "Rock Salt",
                    "Handlee",
                    "PT Serif",
                    "Merriweather",
                    "Lora",
                    "Vollkorn",
                    "Goudy Bookletter 1911",
                    "MedievalSharp",
                    "UnifrakturCook",
                    "Modern Antiqua",
                    "Arvo",
                    "Rokkitt",
                    "Cutive Mono",
                    "Inconsolata"
                ];

WebFontConfig = {
                active: load_random_poster,
                google: {
                      families:  fonts
                }
            };
        
(function() {
    var wf = document.createElement('script');
    wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
        '://ajax.googleapis.com/ajax/libs/webfont/1.4.8/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
})();

var posterIntervalTime = 120000;

const COLOR_FONT = 0;
const COLOR_FONT_SHADOW = 3;
const COLOR_BG = 1;
const COLOR_GRAD_1 = 1;
const COLOR_GRAD_2 = 2;

function load_random_poster() {
    var myXmlhttpObj;
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        myXmlhttpObj = new XMLHttpRequest();
    }
    else {// code for IE6, IE5
        myXmlhttpObj = new ActiveXObject("Microsoft.XMLHTTP");
    }
    myXmlhttpObj.onreadystatechange = function() {
        if (myXmlhttpObj.readyState==4 && myXmlhttpObj.status==200) {
            create_poster(JSON.parse(myXmlhttpObj.responseText));
        }
    };
    myXmlhttpObj.open("GET","/Poster/random.json",true);
    myXmlhttpObj.send();
};

function wrap_text(context, text, x, y, maxWidth, lineHeight, is_simulation, alignment) {
    is_simulation= typeof is_simulation !== 'undefined' ? is_simulation : false;
    alignment= typeof alignment !== 'undefined' ? alignment : "centered";
    var cars = text.split("\n");
    var lines_counter = 1;
    for (var ii = 0; ii < cars.length; ii++) {

        var line = "";
        var words = cars[ii].split(" ");

        for (var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + " ";
            var metrics = context.measureText(testLine);
            var testWidth = metrics.width;

            if ((testWidth + x) > maxWidth) {
            	if (!is_simulation) {
                    if (alignment == "centered")
                        context.fillText(line, x + (maxWidth - context.measureText(line).width) / 2, y);
                    else
                        context.fillText(line, x, y);
                }
             lines_counter++
             line = words[n] + " ";
             y += lineHeight;
         }
         else {
            line = testLine;
        }
    }
    if (!is_simulation) {
        if (alignment == "centered")
            context.fillText(line, x + (maxWidth - context.measureText(line).width) / 2, y);
        else
            context.fillText(line, x, y);
    }

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
    window.clearInterval(posterIntervalHandle);
	var canvas = document.getElementById("poster_canvas");
	var ctx=canvas.getContext("2d");

	clear_canvas(canvas);

    // Create gradient
    if (data.is_gradient) {
        var grd = ctx.createLinearGradient(0,0,0,canvas.height);
        grd.addColorStop(0,data.colorset[COLOR_GRAD_1]);
        grd.addColorStop(1,data.colorset[COLOR_GRAD_2]);
    	ctx.fillStyle = grd;
    } else {
        ctx.fillStyle = data.colorset[COLOR_BG];
    }
    ctx.fillRect (0, 0, canvas.width, canvas.width);

    font_size = 500;
    ctx.font = font_size + "px " + data.font;

    lines = 100;

    while (lines > (canvas.height / (font_size + 10)))
    {
      font_size-=2;
      ctx.font = font_size + "px " + data.font;
      lines = wrap_text(ctx, data.term, 50, font_size, canvas.width - 50, font_size + 10, true) ;
    }

    if (lines - 1 <= 3) {
        //Add shadow...
        ctx.shadowColor = data.colorset[COLOR_FONT_SHADOW];
        ctx.shadowOffsetX = 10 - lines;
        ctx.shadowOffsetY = 7 - lines;
        ctx.shadowBlur = 5 - lines;
    } else {
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = 0;
    }

    ctx.fillStyle = data.colorset[COLOR_FONT];
    var alignment = "centered";
    if (lines - 1 > 4)
        alignment = "right";
    wrap_text(ctx, data.term, 50, font_size, canvas.width - 50, font_size + 10, false, alignment);
    posterIntervalHandle = window.setInterval(load_random_poster, posterIntervalTime);
};

var pusher = new Pusher('b66e206fbe2cbb7a98bc'); // uses your APP KEY
var channel = pusher.subscribe('posters_channel');
channel.bind('new_poster', create_poster);

//This will show different poster for differnt pages
var posterIntervalHandle = window.setInterval(load_random_poster, posterIntervalTime);
