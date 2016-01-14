var currentIx=100;

$(function(){
	//window activation
	$('.desktop').on('touchdown mousedown','.winder',function(){		
		currentIx++;
		$('.winder').removeClass('active');
		$(this).css({"z-index":currentIx}).addClass('active');
    $(this).addClass('clicked')
	});
  $('.desktop').on('mouseup dragend resizeend','.winder,.windowhandle,.windowtitle',function(){
    $('.winder').removeClass('clicked');
    console.log('window release');
  });
	//resize or drag: put an invisible div over the window to prevent iframe problems
	$('.desktop').on('resizestart dragstart','.winder',function(){
		$('.winder').prepend('<div class="draghider"></div>');
	});
	$('.desktop').on('resizestop dragstop','.winder,.windowhandle',function(){
		$('body').find(".draghider").remove();
	});

	//close behavior
	$('.desktop').on('click','.closebutton',function(){
		var theTaskId = $(this).parent().parent().parent().data('taskId');
		$(this).parent().parent().parent().remove();
		$('.taskbar').find('.taskbarItem').each(function(){
			if ($(this).data('taskId')==theTaskId){
				$(this).remove();
			}
		});		
	});
	//minimize behavior
	$('.desktop').on('click','.minimizebutton',function(){
		$(this).parent().parent().parent().css({
			"display":"none"			
		});				
	});
	//maximize
	$('.desktop').on('click','.maximizebutton',function(){
		var theWindow = $(this).parent().parent().parent();
		var width = $('.desktop').width();
		var height = $('.desktop').height();
		//if window is maximized... un-max it
		if (theWindow.width()>=(width-10)&&theWindow.height()>=(height-10)){
			theWindow.removeClass('fullscreen');
			theWindow.css({
				"top":theWindow.height()/4+"px",
				"left":theWindow.width()/4+"px",
				"width":theWindow.width()/2+"px",
				"height":theWindow.height()/2+"px"
			});
		}
		//window not maximized... max it
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
  //launcher open / close   
  function toggleLauncher(){
		$('.launcher').toggleClass('launcher-hidden');
    $('.startbutton').toggleClass('active');
  }
  function closeLauncher(){
		$('.launcher').addClass('launcher-hidden');
    $('.startbutton').removeClass('active');
	}
  
	$('.startbutton').on('click',toggleLauncher);
	$('.desktop').on('click drag resize mouseenter',closeLauncher);
  
	//taskbar clicks
	$('.taskbar').on('click','.taskbarItem',function(){
		var theUniqueId= $(this).data('taskId');
		currentIx++;
		$('.winder').removeClass('active');
		$("#"+theUniqueId).css({'display':'flex',"z-index":currentIx}).addClass('active');
	});
	
});

//application code
$(function(){	
	
  var links = [
    {
      url:"https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/179666085%3Fsecret_token%3Ds-z3byT&amp;auto_play=true&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true",
      icon:'/img/waves.jpg',
      title:'Chiptune Music'
    },
    {
      url:"https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/179665508%3Fsecret_token%3Ds-zMDjT&amp;auto_play=true&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true",
      icon:'/img/waves.jpg',
      title:'Calming Music'
    },
    {
      url:"/window",
      icon:'/img/conure.svg',
      title:'Weather'
    },
    {
      url:"http://www.duckduckgo.com/",
      icon:'/img/conure2.svg',
      title:'Search'
    },
    {
      url:'/about',
      icon:'/img/conure.svg',
      title:'About'
    },
    {
      url:'/calculator',
      icon:'/img/conure.svg',
      title:'Calculator'
    }
    /*,
    {
      url:"https://www.youtube.com/embed/GCZMfYNWcp4",
      icon:'/img/conure.svg',
      title:'Youtube'
    }*/
  ];
  
  //create launcher and desktop links
  links.forEach(function(link){
    var launcherItem = $('<li data-url="'+link.url+'" data-title="'+link.title+'"><img src="'+link.icon+'"></img><span>'+link.title+'</span></li>');
    $('.launcher ul').append(launcherItem);
    
    var desktopItem = $('<span class="desktop-icon" data-url="'+link.url+'" data-title="'+link.title+'"><img src="'+link.icon+'"></img><span class="title">'+link.title+'</span></span>');
    $('.desktop').append(desktopItem);
  });
  
  //register click listeners for those links
  $('.launcher').on('click','li',function(e){
    var $this = $(this)
    createWindow($('<iframe src="'+$this.data('url')+'" allowfullscreen></iframe>'),$this.data('title') );
  });
  $('.desktop-icon').on('click',function(e){
    var $this = $(this);
    createWindow($('<iframe src="'+$this.data('url')+'" allowfullscreen></iframe>'),$this.data('title') );
  });
	
});


//create a window out of a jquery element
function createWindow(jqobj,windowTitle){
	if(!windowTitle){windowTitle="New Window"}
		
	var uniqueId = (new Date().getTime());	
	
	var newWindow=$('<div class="winder" id="'+uniqueId+'">'
					+'<div class="windowhandle">'
						+'<div class="windowtitle">'+windowTitle+'</div>'
						+'<div class="windowactions">'
							+'<div class="minimizebutton"></div>'
							+'<div class="maximizebutton"></div>'
							+'<div class="closebutton"></div>'
						+'</div>'
					+'</div>'
					+'<div class="windowcontent"></div>'
				+'</div>'
			).data('taskId',uniqueId);	
	newWindow.resizable({handles:"all",containment:"parent"}).draggable({handle:".windowtitle",containment:"parent"}).css({'z-index':currentIx});
	if(jqobj.prop('tagName')=="IFRAME"){
		jqobj.addClass('windowContent').attr('frameborder','0');
		newWindow.find('.windowcontent').replaceWith(jqobj);
	}
	else{
		newWindow.find('.windowcontent').append(jqobj);
	}
	$('.winder').removeClass("active");
	newWindow.addClass('active');
	$('.desktop').append(newWindow);
	var newTaskbarItem=$('<div class="taskbarItem">'+windowTitle+'</div>').data('taskId',uniqueId);
	$('.taskbar').append(newTaskbarItem);
};