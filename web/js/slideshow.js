// Slideshow
var num = 0, // Slides numerator
	count = 7 * 3, // Slides count
	ch = null, // Child HTML of main DIV in Slide
	arSlides = {}; // Slides object

// Timers
var show = null, // Flag of showing slideshow
	timeout = 3000, // Timeout of slideshow
	timer = null, // Flag of showing controls
	timersec = 1500; // Timeout of showing controls

// DOM
var content, ct, st, stl;

// Dimensions
var widthToHeight = 4 / 3; // Aspect ratio
var padding = 60; // Padding of slides
var posl = 0, posr = 0; // Slide tab position
var slpos = 0; // Position of current slide

/*********************************************
 * 
 *         STRUCTURE
 * 
 ********************************************/
// Slide object
function slide(num, title) {
	this.title = title;
	this.num = num;	
	// DOM
	this.head = $('<h3 />').text(title);
	this.elem = $('<div />').attr('id', 'slide-' + num).attr('class', 'slides');
	this.elem.append(this.head);
}

// *********************************************** TEST
var i = 1;
while(i<=count) {
	arSlides[i] = new slide(i,"Picture");
	ch = $('<img />').attr('src', 'img/slidepic.jpg');
	arSlides[i].elem.append(ch);
	
	i++;
	
	arSlides[i] = new slide(i,"Table");
	ch = $('<table />');
	ch.html('<tr> \
			<td>Header1</td> \
			<td>Header2</td> \
			</tr> \
			<tr> \
			<td>Text1</td> \
			<td>Text2</td> \
			</tr>');
	arSlides[i].elem.append(ch);
	
	i++;
	
	arSlides[i] = new slide(i,"List");
	ch = $('<ul />');
	ch.html('<li>Fish 1</li> \
		<li>Fish 2</li> \
		<li>Fish 3</li>');
	arSlides[i].elem.append(ch);
	
	i++;
}

/*********************************************
 * 
 *         MANIPULATION
 * 
 ********************************************/

// ******* Slide Handling *******
function nextSlide() {	
	$('#slide-tab-' + num).toggleClass('selected');
	if(num >= count) {
		num = 1;
		slideToBegin();
	} else {
		num++;
		slideTabRight();
	}	
	changeSlide();		
}
function prevSlide() {
	$('#slide-tab-' + num).toggleClass('selected');
	if(num <= 1) {
		num = count;
		slideToEnd();
	} else {
		num--;
		slideTabLeft();
	}	
	changeSlide();
}
function changeSlide() {
	content.empty();
	content.prepend(arSlides[num].elem);
	var sltab = $('#slide-tab-' + num);
	sltab.toggleClass('selected');	
	resizeSlide();
}
function slideTabLeft() {
	var pl = $('#slide-tab-' + num).width() + 26; 
	slpos  = pl * num;
	if(posl >= slpos) {
		stl.stop();
		stl.animate({'margin-left': (parseInt(stl.css('margin-left')) + pl) + 'px'}, 500);
		posr = slpos;
		posl -= pl;
	}
}
function slideTabRight() {
	var pl = $('#slide-tab-' + num).width() + 26; 
	slpos  = pl * num;
	if(posr < slpos) {
		stl.stop();
		stl.animate({'margin-left': (parseInt(stl.css('margin-left')) - pl) + 'px'}, 500);
		posr = slpos;
		posl += pl;
	}
}
function slideToBegin() {
	stl.stop();
	stl.animate({'margin-left': '0px'}, 1000); // Slide-tab left
}
function slideToEnd() {
	stl.stop();
	stl.animate({'margin-left': ($(window).innerWidth() - stl.width()) + 'px'}, 1000); // Slide-tab right
}

function resizeSlide() {
	var element = arSlides[num==0 ? 1 : num].elem;	
    var newWidth = $(window).innerWidth();//window.innerWidth;
    var newHeight = $(window).innerHeight();//window.innerHeight;
    var newWidthToHeight = newWidth / newHeight;
    
    if (newWidthToHeight > widthToHeight) {
        newWidth = newHeight * widthToHeight;
        element.css('height', (newHeight - padding) + 'px');
        element.css('width', (newWidth - padding) + 'px');
    } else {
        newHeight = newWidth / widthToHeight;
        element.css('width', (newWidth - padding) + 'px');
        element.css('height', (newHeight - padding) + 'px');
    }
}
function slidesList(newWidth, newHeight) {
	var s = $('#slides-list');
	for (var key in arSlides) {
		var element = arSlides[key].elem.clone();
		element.attr('id','slide-tab-' + key);
		element.attr('data-num', key);
		element.removeClass('slides');
		element.addClass('slides-mini');		
		s.append(element);	    
	    newWidth = newHeight * widthToHeight;
	    element.css('height', newHeight + 'px');
	    element.css('width', newWidth + 'px');
	    element.click(function(){
	    	showControls();
	    	$('#slide-tab-' + num).toggleClass('selected');
	    	num = $(this).data('num');
	    	changeSlide();
	    });
	}
	stl.width(120 * key);
}

//******* Slide Show *******
function stop(event){
	if(show != null) {
		clearInterval(show);
		show = null;
		$('#b-stop').hide();
		$('#b-start').show();
	}
}
function play(event){	
	if(show == null) {		
		$('#b-start').hide();
		$('#b-stop').show();
		fullScreen();
		show = setInterval('nextSlide()', timeout);
	}
}
function fullScreen() {
	var el = document.getElementById('content'), 
	rfs = // for newer Webkit and Firefox
		el.requestFullScreen
		|| el.webkitRequestFullScreen
		|| el.mozRequestFullScreen
		|| el.msRequestFullScreen
		;
	if(typeof rfs!="undefined" && rfs){
		rfs.call(el);
	} else if(typeof window.ActiveXObject!="undefined"){
		// for Internet Explorer
		var wscript = new ActiveXObject("WScript.Shell");
		if (wscript!=null) {
			wscript.SendKeys("{F11}");
		}
	}
}

function showControls(){
	if(timer == null) {
		ct.fadeIn('slow');st.fadeIn('slow');
		timer = setTimeout("ct.fadeOut('slow');st.fadeOut('slow');timer=null", timersec);
	} else {
		clearTimeout(timer);
		timer = setTimeout("ct.fadeOut('slow');st.fadeOut('slow');timer=null", timersec);
	}
}

/*********************************************
 * 
 *         ONLOAD
 * 
 ********************************************/

$(document).ready(function(){
	content = $('#content');
	ct = $('#control-tab');
	st = $('#slides-tab');
	stl = st.children();	
	posr = $(window).innerWidth();
	
	slidesList(70, 70);
	nextSlide();
	
	content.dblclick(function(event){		
		play(event);
	});			
	
	//window.addEventListener('resize', resizeSlide, false);
	//window.addEventListener('orientationchange', resizeSlide, false);
	$(window).bind({
		resize: resizeSlide,
		orientationchange: resizeSlide
	});	
	
	// ******* Controls *******
	showControls();	
	$(document).mousemove(function(e){        	
		showControls();
		if(stl.width() > $(window).innerWidth()) {
			if(e.pageY <= 100) {				
				var p = $(window).innerWidth() / 3;
				if(e.pageX <= p) {						
					slideToBegin();					
				} else if(e.pageX >= ($(window).innerWidth() - p)) {
					slideToEnd();
				}
			}
		}			
	});
});