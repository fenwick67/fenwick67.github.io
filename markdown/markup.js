//this will mark up its parent with the markdown provided in the querystring

function markup(){
  var fromUrl = getParameterByName('mdsrc');
    
  if (!fromUrl){
    return console.error('bad from url');
  }
  
  $.ajax({
    url:fromUrl,
    method:'GET',
    success:function(data){
      var converter = new showdown.Converter(),
      html = converter.makeHtml(data);
      $('#markdown').html(html);
      
      // get page title from the first header in the markup
      var title = $('#markdown').find('h1,h2,h3,h4,h5,h6').first().html();
      if(title){
        $('title').html(title);
      }
      
      // if it's a github url, parse it and add a "view on github" banner
      var cdnIdx = fromUrl.indexOf('cdn.rawgit.com/');
      if (cdnIdx >= 0){
        githubIdx = ( 15 + cdnIdx);//15 is the length of cdn.rawgit.com/
        var masterIdx = fromUrl.indexOf('/master/');
        var userRepo = fromUrl.slice(githubIdx,masterIdx);
        var url = "https://www.github.com/"+userRepo;
        var banner = $('<div id="fork-me"><a href="'+url+'">View on Github</a></div>');
        $('body').append(banner);
      }
    },
    error:function(){
      console.error(arguments);
    }
  });
  
}

markup();

function getParameterByName( name )
{
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return "";
  else
    return decodeURIComponent(results[1].replace(/\+/g, " "));
}

//break out links
$('body').on('click','a',function(){  
    window.open(this.href);
});
