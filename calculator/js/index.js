$(function(){
  var builtString = '';
  var numberDisplay = '';
  
  $('.btn').on('click',function(){
    var action = $(this).attr('action');
    if(action ==='clear'){
      builtString = '';
      numberDisplay = '';
      setDisplay('');
    }else if(action === '='){
      calculate();
    }else if(action === '%'){
       //noop???
    }else if(action === '*' || action === "/" || action === '-' | action === '+'){
      //operator
      builtString += action;
      numberDisplay = '';
    }else{//is number or decimal
      builtString +=action;
      numberDisplay+=action;
      setDisplay(numberDisplay);
    }
    
    //update display
    
  });
  
  function calculate(){//equals was pressed
    try{
      var result = eval(builtString);
    }
    catch(e){
      var result = 'ERR'
    }
    builtString = '';
    numberDisplay='';
    setDisplay(result);
  }
  function setDisplay(str){
    $('.results').html(str);
  }
  
  
  
});