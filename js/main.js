var currentIx=100;
$(function(){
	//window activation
	$('desktop').on('click dragstart resizestart mousedown','winder',function(){		
		currentIx++;
		$('winder').removeClass('active');
		$(this).css({"z-index":currentIx}).addClass('active');

	});
	//resize or drag: put an invisible div over the window to prevent iframe problems
	$('desktop').on('resizestart dragstart','winder',function(){
		$(this).prepend('<div id="draghider"></div>');
		$(this).find('#draghider').height($(this).height()).width(10000).css({"position":"absolute"});
	});
	$('desktop').on('resizestop dragstop','winder',function(){	
		$(this).find("#draghider").remove();
	});

	//close behavior
	$('desktop').on('click','closebutton',function(){
		var theTaskId = $(this).parent().parent().parent().data('taskId');
		$(this).parent().parent().parent().remove();
		$('taskbar').find('.taskbarItem').each(function(){
			if ($(this).data('taskId')==theTaskId){
				$(this).remove();
			}
		});		
	});
	//minimize behavior
	$('desktop').on('click','minimizebutton',function(){
		$(this).parent().parent().parent().css({
			"display":"none"			
		});				
	});
	//maximize
	$('desktop').on('click','maximizebutton',function(){
		var theWindow = $(this).parent().parent().parent();
		var width = $('desktop').width();
		var height = $('desktop').height();
		//if window is maximized
		if (theWindow.width()>=(width-10)&&theWindow.height()>=(height-10)){
			theWindow.removeClass('fullscreen');
			theWindow.css({
				"top":theWindow.height()/4+"px",
				"left":theWindow.width()/4+"px",
				"width":theWindow.width()/2+"px",
				"height":theWindow.height()/2+"px"
			});
		}
		//window not maximized
		else{
			theWindow.addClass('fullscreen');
			theWindow.css({
				"top":"0",
				"left":"0",
				"width":(width)+"px",
				"height":(height)+"px"
			});	
		}
			
	});	
	//open launcher
	$('startbutton').on('click',function(){
		$('launcher').css({
			"display":"block"
		});
	});
	//close launcher
	$('desktop').on('click drag resize',function(){
		$('launcher').css({
			"display":"none"
		});
	});
	//taskbar clicks
	$('taskbar').on('click','.taskbarItem',function(){
		var theUniqueId= $(this).data('taskId');
		currentIx++;
		$('winder').removeClass('active');
		$("#"+theUniqueId).css({'display':'flex',"z-index":currentIx}).addClass('active');
	});
	
});

//this implementation stuff
$(function(){	
	
	$('#newWindowButton').on('click',function(){
		createWindow($('<div>YOU OPENED A NEW WINDOW<br>YOU ARE SOO COOL</div>'),"Word Up");
	});
	$('#newHtmlWindowButton').on('click',function(){
		createWindow($('<div>YOU OPENED A NEW HTML WINDOW<br>YOU ARE SOO COOL<img src="https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.cameraegg.org%2Fwp-content%2Fuploads%2F2013%2F03%2FCanon-EOS-100D-Rebel-SL1-Sample-Image.jpg&f=1"></img></div>'),'html window');
	});
	$('#newYoutubeWindowButton').on('click',function(){
		createWindow($('<iframe src="https://www.youtube.com/embed/GCZMfYNWcp4" frameborder="0" allowfullscreen></iframe>'),'YouTube');
	});
	
		createWindow($('<iframe src="http://www.duckduckgo.com"></iframe>'),'Web');	
	
});


//create a window out of a div or anything
function createWindow(jqobj,windowTitle){
	if(!windowTitle){windowTitle="New Window"}
		
	var uniqueId = (new Date().getTime());	
	
	var newWindow=$('<winder id="'+uniqueId+'">'
					+'<windowhandle>'
						+'<windowtitle>'+windowTitle+'</windowtitle>'
						+'<windowactions>'
							+'<minimizebutton></minimizebutton>'
							+'<maximizebutton></maximizebutton>'
							+'<closebutton></closebutton>'
						+'</windowactions>'
					+'</windowhandle>'
					+'<windowcontent></windowcontent>'
				+'</winder>'
			).data('taskId',uniqueId);	
	newWindow.resizable({handles:"all",containment:"parent"}).draggable({handle:"windowHandle",containment:"parent"}).css({'z-index':currentIx});
	if(jqobj.prop('tagName')=="IFRAME"){
		jqobj.addClass('windowContent');
		newWindow.find('windowcontent').replaceWith(jqobj);
	}
	else{
		newWindow.find('windowcontent').append(jqobj);
	}
	$('winder').removeClass("active");
	newWindow.addClass('active');
	$('desktop').append(newWindow);
	var newTaskbarItem=$('<div class="taskbarItem">'+windowTitle+'</div>').data('taskId',uniqueId);
	$('taskbar').append(newTaskbarItem);
};