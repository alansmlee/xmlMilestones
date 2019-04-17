/**
 * ********************************************
 * Generic Drag and Drop of milestone artefacts
 * targetEleClass points to the ultimate element to be dragged
 * https://www.webdesignerdepot.com/2013/08/how-to-use-html5s-drag-and-drop/
 * ********************************************
 */
function MilestoneDnD(){}  // Milestone drag and drop
 
MilestoneDnD.ondragstart = function(evt, targetEleClass){
  // Will handle this event here, so stop bubbling up
  evt.stopPropagation();
  var $srcEle = $(evt.target).closest(targetEleClass);
  $srcEle.css('opacity', '0.6');
  // Save targetEleClass
//  evt.dataTransfer.setData('srcTargetEleClass', targetEleClass);
  // Save source element id
  evt.dataTransfer.setData('srcEleId', $srcEle.attr('id'));
}

MilestoneDnD.ondragenter = function(evt){
  // stop propagation and prevent default drag behavior
  // to show that our target lists are valid drop targets
  evt.stopPropagation();
  evt.preventDefault();
  return false;  
}

MilestoneDnD.ondrop = function(evt, targetEleClass){
  // NOTE: Data can only be read in 'onDrop' (not 'onDragOver')
  //evt.preventDefault();
  evt.stopPropagation();  // to prevent many browsers' default attempts to navigate to a dropped url-like thing
/*  
  var srcTargetEleClass = evt.dataTransfer.getData('srcTargetEleClass');
  if (srcTargetEleClass != targetEleClass){
    return false; // dropped to unexpected target
  }
*/  
  var $destEle = $(evt.target).closest(targetEleClass);
  // Get source row id
  var srcEleId = evt.dataTransfer.getData('srcEleId');
  // Get the source row object
  var $srcEle = $('#'+srcEleId);
  // Perform the move of source element to be placed after dest element
  $destEle.after($srcEle);
  // Clear the drag data cache (for all formats/types)
  evt.dataTransfer.clearData();
  // Refresh the table after the move
  refresh_milestone_table();
  return false;
 }
 
MilestoneDnD.ondragover = function(evt){
  // Will handle this event here, so stop bubbling up
  evt.stopPropagation();
  evt.preventDefault(); // required to identify the element as a drop target
  return false;
 }

MilestoneDnD.ondropleave = function(evt){
  // Will handle this event here, so stop bubbling up
  evt.stopPropagation();
}

MilestoneDnD.ondragend = function(evt, targetEleClass){
  // Will handle this event here, so stop bubbling up
  evt.stopPropagation();
  // Reset all row's opacity (because ondragstart has changed it)
  $(targetEleClass).css('opacity', 1);
}
