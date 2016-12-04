//todo: refactor for native APIs
$('.reading').on('click','.continue-reading',function(e){
  e.delegateTarget.classList.add('expanded');
  this.style.display="none";
});

var toggle = document.getElementById('nav-toggle');
var navMenu = document.getElementById('nav-menu');

toggle.addEventListener('click',function(){
  toggle.classList.toggle('is-active');  
  navMenu.classList.toggle('is-active'); 
})