function CommonFile(){}

CommonFile.checkHasReader=function(){
  // Check for the various File API support.
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    // Great success! All the File APIs are supported.
    return true;
  } else {
    alert('The File APIs are not fully supported in this browser.');
    return false;
  }
}

/* ******************************************
<form>
  <input id='loadMyFile' type='file' />
</form>

var $fileInputEle = $('#loadMyFile');
var promise = CommonFile.loadFromInput($fileInputEle);
promise.then(function(data){
  var fileContent = data;
  alert(fileContent);
  // Do something with fileContent
}, function(error){
  alert(error);
});
 * ******************************************
 */
CommonFile.loadFromInput=function($fileInputEle){
  // returns a Promise object
  var file = $fileInputEle.get(0).files[0];
  return CommonFile.load(file);
}

/* ******************************************
 * fileObject has structure of CommonFile.FileInstance()
 */
CommonFile.load=function(fileObject){
  // returns a Promise object
  var promise = new Promise(function(resolve,reject){
    if (fileObject){
      // create reader
      var reader = new FileReader();
      reader.onload = function(e) {
        var data = e.target.result; // fileContent
        resolve(data);
      };
      reader.readAsText(fileObject);
    } else {
      reject(Error('Unable to load file'));
    }
  });
  return promise;
}
