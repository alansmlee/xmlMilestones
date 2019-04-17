/*
 * ****************
 * Global enum like
 * ****************
 */
function Global(){}

Global.Constant = {
  TEXT_SHOW_ALL:'show all',
  TEXT_NOT_DONE:'NOT DONE',
  STATUS_DONE:'done',
  EMPTY_STR:''
}

/*
 * ************************************************
 * Common javascripts
 * ************************************************
 */
function init_common(){
  init_catchAllErrors();
  init_workarounds();
  init_datepicker();  // dataHelper.js
  init_bootstrap_contextmenu(); // bootstrap-contextmenu.js
}

/*
 * ***************************************************
 * Special objects as helpers
 * ***************************************************
 */
function BooleanHolder(){}
// usage: pass by reference
BooleanHolder.instance = function(){
  return {isValid:true};
}

/*
 * ***************************************************
 * Catch all errors
 * ***************************************************
 */
function init_catchAllErrors(){
  window.onerror = function (message, file, line, col, error) {
     alert("Error occurred: " + error.message);
     return false;
  };
  window.addEventListener("error", function (e) {
     alert("Error occurred: " + e.error.message);
     return false;
  });
  // Globally declare ajax error handling
  $.ajaxSetup({
    error: function(x,e){
      if (x.status == 0) {
        alert('Check Your Network.');
      } else if (x.status == 404) {
        alert('Requested URL not found.');
      } else if (x.status == 500) {
        alert('Internel Server Error.');
      }  else {
         alert('Unknow Error.\n' + x.responseText);
      }
    }
  });
}

/*
 * ***************************************************
 * Workarounds because something did at work in IE etc
 * ***************************************************
 */
function init_workarounds() {
  
  // BEGIN: string startsWith() and endsWith() functions
  // because they do not work in some IE example IE11
  if (typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function(str) {
    return str.length > 0 && this.substring( 0, str.length ) === str;
  }};

  if (typeof String.prototype.endsWith != 'function') {
    String.prototype.endsWith = function(str) {
    return str.length > 0 && this.substring( this.length - str.length, this.length ) === str;
  }};
  // END: string startsWith() and endsWith() functions
}

/*
 * ***************************************************
 * General functions
 * ***************************************************
 */
function swapStyleSheet(sheet) {
  document.getElementById('pagestyle').setAttribute('href', sheet);
}
 
function changeThemeColor(color) {
  var metaThemeColor = document.querySelector("meta[name=theme-color]");
  metaThemeColor.setAttribute("content", color);
}

/*
 * This function completely replace the <htm> as if the whole page is reloaded with a new HTML document
 */
function completelyReplaceHTML(htmlText, postReplaceFunction){
  
  var newDoc = document.open("text/html", "replace");
  newDoc.write(htmlText);
  newDoc.close();
  postReplaceFunction(newDoc);  // Now that the HTML is replaced, we must initialise it like we do in $( document ).ready(function(){...});
}

// This is the url path (i.e without the file) you see in the address bar
function getAbsoluteUrlPath() {
  var loc = window.location;
  var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
  return loc.href.substring(0, loc.href.length - ((loc.pathname + loc.search + loc.hash).length - pathName.length));
}

/*
 * Generates a GUID string.
 * @returns {String} The generated GUID.
 * @example af8a8416-6e18-a307-bd9c-f2c947bbb3aa
 * @author Slavik Meltser (slavik@meltser.info).
 * @link http://slavik.meltser.info/?p=142
 */
function guid() {
    function _p8(s) {
        var p = (Math.random().toString(16)+"000000000").substr(2,8);
        return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
    }
    return _p8() + _p8(true) + _p8(true) + _p8();
}


/*
 * Triggers validation of all the HTML5 form fields
 */
 function validateForm($form){
  // This is a generic method
  // .....................................
  // BEGIN: logic to trigger HTML5 element validations and show errors
  // var $form = $('#milestoneEditForm')[0]; // Needs [0] because $('#id') returns a Set.
  if ($form.checkValidity()==false){
    /*
     * IMPORTANT: must not have the following otherwise HTML5 validation errors will not show on screen
     * 1. event.preventDefault();
     * 2. event.stopPropagation();
     */
    $form.find("button[type='submit']")[0].click(); // required to trigger HTML5 validation error on screen
    return false;
  }
  return true;
  // END: logic to trigger HTML5 element validations and show errors
  // .....................................
}


/*
 * Copy string to clipboard
 */
function copyStringToClipboard(stringToCopy, str_desc, optional_extra_desc){
   // Create new element
   var el = document.createElement('textarea');
   // Set value (string to be copied)
   el.value = stringToCopy;
   // Set non-editable to avoid focus and move outside of view
   el.setAttribute('readonly', '');
   el.style = {position: 'absolute', left: '-9999px'};
   document.body.appendChild(el);
   // Select text inside element
   el.select();
   // Copy text to clipboard
   document.execCommand('copy');
   // Remove temporary element
   document.body.removeChild(el);
   
   var alertStr = str_desc + " is copied to the clipboard";
   if (optional_extra_desc){
     alertStr += '\n\n' + optional_extra_desc;
   }
   alert(alertStr);
}

/*
 * ***************************************************
 * Specialised areas
 * ***************************************************
 */
function getObjType(obj){
  return typeof obj;
}

function json2String(obj){
  return JSON.stringify(obj);
}
 
function string2Json(str){
  try{
    str = str.replace(/'/g, "\"");  // replace all single quote with double quote
    return JSON.parse(str);
  }catch(e){
    alert("Error JSON.parse("+str+") : \n" + e);
  }
}
 
function json2FormattedXml(json){
    var xml = json2xml(json, "");
    var formattedXml = formatXml(xml);
    return escapeXml(formattedXml);
}

/*
 * Format XML (beautify it)
 */
function formatXml(xml) {
    var formatted = '';
    var reg = /(>)(<)(\/*)/g;
    xml = xml.replace(reg, '$1\r\n$2$3');
    var pad = 0;
    jQuery.each(xml.split('\r\n'), function(index, node) {
        var indent = 0;
        if (node.match( /.+<\/\w[^>]*>$/ )) {
            indent = 0;
        } else if (node.match( /^<\/\w/ )) {
            if (pad != 0) {
                pad -= 1;
            }
        } else if (node.match( /^<\w[^>]*[^\/]>.*$/ )) {
            indent = 1;
        } else {
            indent = 0;
        }

        var padding = '';
        for (var i = 0; i < pad; i++) {
            padding += '  ';
        }

        formatted += padding + node + '\r\n';
        pad += indent;
    });
   return formatted;
}

/*
 * Escaping XML
 */
function escapeXml(xml){
  //return formattedXml.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/ /g, '&nbsp;').replace(/\n/g,'<br />');
  return xml.replace(/&/g,'&amp;');
}

// Caller needs to catch exception on error (see validateXml())
function xml2Obj(xmlText){
  var parser = new DOMParser();
  var dom = parser.parseFromString(xmlText, "text/xml");
  return dom;
}

function validateXml(xmlText){
  try{
    var dom = xml2Obj(xmlText);
    if (dom.documentElement.nodeName == 'parsererror'){
      alert("XML text is invalid");
      return false;
    }
    return true;
  }catch(e){
    alert("XML text is invalid:\n" + e.message);
    return false;
  }
}

/*
 * HTML
 */
function ensureGoodHtml(html){
  return removeWhitespaceBetweenTags(correctHtml(html));
}

function correctHtml(html){
  return html.replace(/<br>/g,'<br/>'); // replace <br> with <br/>
}

function removeWhitespaceBetweenTags(html){
  return html.replace(/\n/g, "")  // remove newline / carriage return
    .replace(/[\t ]+\</g, "<")    // remove whitespace (space and tabs) before tags
    .replace(/\>[\t ]+\</g, "><") // remove whitespace between tags
    .replace(/\>[\t ]+$/g, ">");  // remove whitespace after tags
}

/*
 * *************************************
 * XSL & XML
 * Credit to Tomalak
 * 
 * loadXml           - asynchronously loads an XML document from a URL and calls onSuccessFunc
 * transformXml      - applies and XSL to an XML and returns the result
 * xmlToString       - takes an XML document and returns a string
 * stringToXml       - takes a string and returns an XML document
 * setElementContent - sets an element's content
 *
 * Usage:
 *  var xml = loadXml('xml/dust2nons.xml'),
 *      xsl = loadXml('xml/dust2stats.xsl'),
 *      target = document.getElementById('dust2');
 *      setElementContent(target, transformXml(xml, xsl)); 
 *
 * *************************************
 */
function XslXml(){}

XslXml.loadXml=function(xmlUrl, onSuccessFunc){
  $.get( xmlUrl, function( data ) {
    var xml = new XMLSerializer().serializeToString(data);
    onSuccessFunc(xml);
  })
  .fail(function(){
    alert('Unable to load url: ' + xmlUrl);
  });
}


XslXml.transformXml=function(xml, xsl) {
  var xsltProcessor;
  if (typeof xml === "string") xml = XslXml.stringToXml(xml);
  if (typeof xsl === "string") xsl = XslXml.stringToXml(xsl);
  if (window.XSLTProcessor) {
      xsltProcessor = new XSLTProcessor();
      xsltProcessor.importStylesheet(xsl);
      var resultDocument = xsltProcessor.transformToFragment(xml, document);
      return resultDocument;
  } else if ("ActiveXObject" in window) {
      return xml.documentElement.transformNode(xsl);
  } else {
      alert("Failed to transform XML.");
      throw new Error("Failed to transform XML.");
  }
}

XslXml.xmlToString=function(input) {
  var str;
  if (window.XMLSerializer) {
      return (new XMLSerializer()).serializeToString(input);
  } else if (input.xml) {
      return input.xml;
  } else {
      alert("Failed to convert input to string.");
      throw new Error("Failed to convert input to string.");
  }
  return str;
}

XslXml.stringToXml=function(input) {
  var xml;
  if ("ActiveXObject" in window) {
      xml = new ActiveXObject("Microsoft.XMLDOM");
      xml.async=false;
      xml.loadXML(input);
      return xml;
  } else if (window.DOMParser) {
      return (new DOMParser()).parseFromString(input, "text/xml");
  } else {
      alert("Failed to convert input to XML document.");
      throw new Error("Failed to convert input to XML document.");
  }
}

