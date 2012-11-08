//
// onLoad  - set the main() function to be started once the page has been fully loaded
//
var debug = utils.debug;
var sprintf = utils.string.sprintf;

$("document").ready( function() {
// window.onload = function() {
//  "use strict";
//  alert("main.js: open console window and hit OK to start");

  try {

  debug.setLevelVerbose();

  function myTest(n,s,a){
    debug.traceArgs(n,s,a);
    return;
  }

  debug.trace("#date field innerhtml = "+document.getElementById("date").innerHTML);
        
  myTest(3,"hello world",[1,2,3]);
  
  var firstTime = true;
  var elementToMove = $("#movedisplay");
  var elementToEdit = $("#moveabletext");
  
// example using localStorage (persists between sessions)
// try load the position of the slider from the last session
// localStorage uses key/value string pairs, directly accessible as hash objects. 
// here its "hvalue":"100"
// so localStorage.hvalue === 100;
  var hVal = parseInt(localStorage.hvalue);
  if(!hVal) {
    debug.trace("no stored hvalue found. setting horizontal slider to 0" );
    hVal = 0;
  }
  else   
    debug.trace("found previously stored  hvalue of "+hVal );

  var lastUsedString = localStorage.lastused;
  if(lastUsedString){
    var lastUsedDate = new Date(Date.parse(localStorage.lastused));
    debug.trace("found: last used date = "+lastUsedDate );
  }
  localStorage.lastused = (new Date()).toUTCString();
  
// display and setup events for a the jQuery UI slider widget   
  $("#horizslider").slider({
              orientation: "horizontal",
              value: hVal,
              min: 0,
              max:200,
              slide: function( event, ui ) {
                hVal = ui.value;
                
                if( hVal % 10 == 0) debug.traceVerbose(  "movingtext new left = " + hVal );
                
                if (firstTime) {
                  elementToEdit.text( elementToEdit.text()+" (more text)");
                  firstTime= false;
                }
                elementToMove.css( "left", hVal *4 );
                return true;
              },
              stop: function( event, ui ){
                debug.traceVerbose(  "movingtext stopped at " + hVal+". saving position to disk" );
                localStorage.hvalue = hVal;
              }
              
  });
            
  $("#vertslider").slider({
              orientation: "vertical",
              value: 100,
              min: 0,
              max:100,
              slide: function( event, ui ) {
                $( "#myvalue" ).val( ui.value );
                $("#fading").fadeTo( 0 ,ui.value/100);
              }
  });

  // try a jQuery UI theme special effect - bounce first line of text then toggle hide/show, when user clicks on it
  $( "#hidetext" ).click(function() {
            $( "#hidetext" ).hide( "bounce", { times: 4 }, "slow" );
  });
  
  } catch(error) {
    switch (error.name) {
      case 'SyntaxError':
        alert("caught a " + error.name + ": " + error.message);
        //handle error…
        break;
      case 'EvalError':
        alert("caught a " + error.name + ": " + error.message);
        //handle error…
        break;
        case 'ReferenceError':
        alert("caught a " + error.name + ": " + error.message);
        //handle error…
        break;
      default:
        alert("caught a " + error.name + ": " + error.message);
        //handle all other error types here…
        break;
    }// switch
    
  } finally{
  
  // any tidy up
  } // finally


  
  
}); // document(ready)



//
// doSomething Function
//
// @param object event 
//
function doSomething( event ){
          debug.traceArgs( event );
          
          // first try modify the document using DOM and raw javascript fundamentals
          //
          if(document.getElementById("date").innerHTML == undefined ) debugger;
          document.getElementById("date").innerHTML += " I did something";  
          
          // now try some jQuery document manipulations
          //
          $("#mytest").hide("slow"); // hide the Bob text
          
          event.preventDefault(); // prevent the browser following any link the button has in the html
          
} // doSomething


/*
 * mySearch function.
 * 
 * @param Object event  
 */
function mySearch(event){
  var search,
  resultField;
 
  debug.traceArgs( event );

  search = $("#searchtext").val();
  debug.trace("search text input: "+search);

  // search and Display the HTML in the element.
  getSearchResult( search, "#searchresult", "#searchtitle", "#searchcontent");
  event.preventDefault();
  debug.trace("mySearch() returning");
  
} // mySearch


/*
 * getSearchResults function.
 * Pass the user's input to a server-side script on Google which can return an search result
 * 
 * @param String searchText - the text to search for 
 */
function getSearchResult( searchText, resultField, titleField, contentField) {
    var url, 
        response,
        data,
        jqxhr,
        i,
        item;
        
    debug.traceArgs( searchText );

    // If the browser does not support the XMLHttpRequest object, do nothing
    if (!window.XMLHttpRequest) return;

    
    // Encode the user's input as query parameters in a URL
    var url = "http://ajax.googleapis.com/ajax/services/search/web"+
              "?v=1.0"+
              "&q="+searchText+
              "&callback=?"; // must add this to get a JSONP response, where the JSON is surrounded by "fnc()""
    
    debug.trace("getSearchResults(): JSON API call URL = "+url );
    
    // Fetch the contents of that URL 
    
    debug.assert( typeof($.getJSON) == "function", "getJSON not defined");
   
    jqxhr = $.getJSON( url, function(data) {
        debug.trace("getJSON anonymous callback. success");
        debug.trace("getJSON anonymous callback status="+jqxhr.status+" "+(jqxhr.status== 200? "OK":"fail") );
        debug.trace("getJSON anonymous callback statusText="+jqxhr.statusText);
        console.log( data );

        debug.trace("getJSON anonymous callback data.responseStatus="+data.responseStatus );
        debug.trace( "url[0] = "+data.responseData.results[0].url );
        debug.trace( "visibleUrl[0] = "+data.responseData.results[0].visibleUrl );
        debug.trace( "cacheUrl[0] = "+data.responseData.results[0].cacheUrl );
        debug.trace( "title[0] = "+data.responseData.results[0].title );
        debug.trace( "titleNoFormatting[0] = "+data.responseData.results[0].titleNoFormatting );
        debug.trace( "content[0] = "+data.responseData.results[0].content );

        debug.trace( "url[1] = "+data.responseData.results[1].visibleUrl );
        debug.trace( "url[2] = "+data.responseData.results[2].visibleUrl );

        debug.trace( "resultCount = "+data.responseData.cursor.resultCount );
        debug.trace( "searchResultTime = "+data.responseData.cursor.searchResultTime );
        debug.trace( "currentPageIndex = "+data.responseData.cursor.currentPageIndex );
        debug.trace( "moreResultsUrl = "+data.responseData.cursor.moreResultsUrl );
        
        $.each(data, function(i,item){
          debug.trace( "item: "+item );        
          debug.trace( "i: "+i );
        }) // $.each();
        
        // Find the element to display the result in
        debug.trace("getJSON anonymous callback: resultField = "+resultField );
        debug.assert( $(resultField), "can't find #searchresult tag" );
        $(resultField).text( data.responseData.results[0].visibleUrl );
        $(titleField).html( data.responseData.results[0].titleNoFormatting );
        $(contentField).html( data.responseData.results[0].content );
        
      
      } // anon callback function
    ); // getJSON()

    jqxhr.success(function(){ 
      debug.trace("getJSON success()");
    }); // success()
  
    jqxhr.error(function(){ 
      debug.trace("getJSON error()");
    }); // error()
  
    jqxhr.complete(function(){ 
      debug.trace("getJSON complete() jqxhr.status="+jqxhr.status+" "+(jqxhr.status== 200? "OK":"fail") );
      debug.trace("getJSON complete() jqxhr.statusText="+jqxhr.statusText);


  }) // complete;
  
  debug.trace("getSearchResults(): JSON API call sent asyncronously" );
}; // getSearchResults 


/*
 * convert function.
 * currency conversion
 * 
 * @param Object event  
 */
function convert(event){
  var inCur, 
  outCur, 
  amount, 
  resultField;
 
  debug.traceArgs(  );

  inCur = $("#incur").val();
  debug.trace("input currency: "+inCur);
  outCur= $("#outcur").val();
  debug.trace("output currency: "+outCur);
  amount = $("#amount").val();
  debug.trace("input amount: "+amount);


  // convert amount and Display the HTML in the element from above.
  getExchangeRate(inCur, outCur, amount );
  event.preventDefault();
  debug.trace("convert() returning");
  
} // convert

/*
 * getExchangeRate function.
 * Pass the user's input to a server-side script on Yahoo which can return an image
 * 
 * @param String searchName - the person to search for an image of 
 */
function getExchangeRate( inCur, outCur, amount ) {
    var url, 
        response,
        data,
        jqxhr;
        
    debug.traceArgs(  inCur, outCur, amount );

    // If the browser does not support the XMLHttpRequest object, do nothing
    if (!window.XMLHttpRequest) return;

    
    // Encode the user's input as query parameters in a URL
    // this DOESNT WORK as 
    // a) the currency API only returns JSON and doesnt return JSONP
    // b) the JSON response is not correctly formatted 
    var url = "http://www.google.com/ig/calculator?hl=en&q="+
              amount+
              inCur+
              "=?"+
              outCur+
              "&callback=?";
    
    debug.trace(  "JSON API call URL = "+url );
    
    // Fetch the contents of that URL 
    
    debug.assert( typeof($.getJSON) == "function", "getJSON not defined");
   
    jqxhr = $.getJSON( url, function(data) {
        console.log( data );
/*        debug.trace(  "getJSON callback success. received "+data.length+ " bytes");
        debug.trace(  "getJSON data received: "+data.toString() );
/*
      $.each(data.items, function(i,item){
        debug.trace( "item: "+item );        
        debug.trace( "i: "+i );
        response = $.parseJSON(data);
        
      // Find the element to display the result in
      resultField = $("#myresult");
      debug.assert( resultField, "can't find #myresult tag" );
//      resultField.val = reponse.rhs;
      });
*/
  });

  jqxhr.success(function(){ 
    debug.trace("getJSON callback: success()");
    alert("success");
  });
  
  jqxhr.error(function(){ 
    debug.trace("getJSON callback: error()");
  });
  
  jqxhr.complete(function(data){ 
    debug.trace("getJSON callback: complete() status="+jqxhr.status+" "+(jqxhr.status== 200? "OK":"fail") );
    debug.trace("getJSON callback: complete() statusText="+jqxhr.statusText);

/*      $.each(data.items, function(i,item){
        debug.trace( "item: "+item );        
        debug.trace( "i: "+i );
//        response = $.parseJSON(data);
      });
*/
// the keys lhs, rhs, error and icc are not enclosed in quotes, causing PHP’s json_decode to fail (to return NULL).
// replace("/((\"?[^\"]+\"?)[ ]*:[ ]*([^,\"]+|\"[^\"]*\")(,?))/i", '"\\2": \\3\\4', str_replace(array('{', '}'), array('','')));
    
    debug.trace("getJSON callback: complete() responseHdrs="+jqxhr.getAllResponseHeaders());
    debug.trace("getJSON callback: complete() responseText="+jqxhr.responseText);
    debug.trace("getJSON callback: complete() responseXML="+jqxhr.responseXML);
    debug.trace("getJSON callback: complete() data="+data );
    debug.trace("getJSON callback: complete() data[0]="+data[0] );
    debug.trace("getJSON callback: complete() data.len="+data.length );
    debug.trace("getJSON callback: complete() parseJSON(data)="+$.parseJSON(data) );
    debug.trace("getJSON callback: complete() data.lhs="+data.lhs );
    debug.trace("getJSON callback: complete() parseJSON(responeHdrs)="+$.parseJSON(jqxhr.getAllResponseHeaders()) );
  });
  
  debug.trace(  "JSON API call sent asyncronously" );
}; // getExchangeRate



