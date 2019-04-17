/*
 * *****************
 * Milestone editing
 *
 * Requires: bootstrap-contextmenu.js
 * *****************
 */
function init_milestone_editing() {
  
  MilestoneSummaryModal.init();
  StatusKeywordDescModal.init();
  MilestoneNoteSummaryModal.init();
  
  MilestoneDeliverableSummaryModal.initContextMenu();
  MilestoneDeliverableItemModal.initContextMenu();
  
  MilestoneNoteSummaryModal.initContextMenu();
  MilestoneNoteItemModal.initContextMenu();
  
  MilestoneLoad.init_LoadPageFromXmlFileBtn();
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Milestone load from XML
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function MilestoneLoad(){}

MilestoneLoad.init_LoadPageFromXmlFileBtn=function(){

  // Register the file select modal 'submit' button
  $("#milestoneLoadXmlModal").on('submit', function(event){
    event.preventDefault();
    var $fileInputEle = $('#input_ms_load_xml_file');
    
    var promise = CommonFile.loadFromInput($fileInputEle);
    promise.then(function(data){
      var fileContent = data;
      if (!MilestoneLoad.validateFileSignature(fileContent)) {
        //return Promise.reject(new Error('Unable to load file.\nIt does not have the expected signature and major version !!!'));
        throw new Error('Unable to load file.\nIt does not have the expected signature and major version !!!');
      }
      MilestoneLoad.xml2Page(fileContent);
      return 'done';
    }, function(err){
      alert(err.message);
    })
    .catch(function(err){
      alert(err.message);
    });
  });

  // Register the button that user clicks to pop up the file select modal
  $('#milestone-loadPageFromXmlFile-btn').on('click', function(){
    if (!CommonFile.checkHasReader()){
      return;
    }
    // Pop up the modal
    $("#milestoneLoadXmlModal").modal();
  });
}

MilestoneLoad.validateFileSignature=function(fileText){
  // Expected pattern: <signature id="cabc-revitalisation-milestones" major-version="xyz" 
  // Can have whitespace and ' or " example: <signature  id  =  'cabc-revitalisation-milestones'   major-version  =  'xyz'
  // 
  if (fileText){
    var pattern = ".*(\\s)*(<signature)(\\s)+(id)(\\s)*=(\\s)*('|\")(REPLACEME_ID)('|\")(\\s)+(major-version)(\\s)*=(\\s)*('|\")(REPLACEME_MAJOR_VERSION)('|\").*";
    pattern = pattern.replace("REPLACEME_ID", MilestonesToJson.Signature.ID);
    pattern = pattern.replace("REPLACEME_MAJOR_VERSION", MilestonesToJson.Signature.MAJOR_VERSION);
    var regexp = new RegExp(pattern, "i");  // case insensitive match
    return regexp.test(fileText);
  }
  return false;
}

MilestoneLoad.xml2Page=function(xml){
  var urlPath = getAbsoluteUrlPath();
  var xsl = XslXml.loadXml('milestones.xsl', function(xsl){
    var resultDocument = XslXml.transformXml(xml, xsl);
    var serializer = new XMLSerializer();
    var htmlText = serializer.serializeToString(resultDocument);
    completelyReplaceHTML(htmlText, function(newDoc){
      init_all(); // Now that the HTML is replaced, we must initialise it like we do in $( document ).ready(function(){...});
    });
  });
}


// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Milestone Summary Editing
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// Declare Function object
function MilestoneSummaryModal() {}

MilestoneSummaryModal.init = function(){
  // init right click menu
  MilestoneSummaryModal.initContextMenu();
  // init the create milestone button (should only show up when no milestones are visible)
  MilestoneSummaryModal.init_create_btn();
  // Place cursor on input when Bootstrap Modal is shown
  $('#milestoneSummaryModal').on('shown.bs.modal', function () {
      $('#input_ms_category').focus();
  }) 
}

// Init the milestone create button (this button should only show up if there is no visible milesstones are there)
MilestoneSummaryModal.init_create_btn = function(){
  $('#create-milestone-btn').on('click', function(){
    // Prepare modal view
    MilestoneSummaryModal.prepareModalViewForInsert();
    // Prepare the milestone row
    var $cloned = MilestoneHtmlTemplate.Milestone();
    // Grab the invisible template row as reference position
    var $ms_tr = $('#milestone_html_template').closest('.milestone_tr');
    // Pop up the modal to create the milestone (use .one() because this Modal is also used by others, so handle on the fly)
    $("#milestoneSummaryModal").one('submit', function(event){
      /*
       * Note that javascript closure is used here to get access to $ms_tr and $cloned objects
       */
      if (MilestoneSummaryModal.OnSubmitPopulateHTML(event, $cloned)){
        $ms_tr.after($cloned);
        refresh_milestone_table();
      }
    }).modal();
  });
}

// Declare Function object's static method
MilestoneSummaryModal.clearModal = function(){
  $('#input_ms_deadline').val('');
  $('#input_ms_category').val('');
  $('#input_ms_status').val('');
  $('#input_ms_owner').val('');
  $('#input_ms_title').val('');
}

// Declare Function object's static method
MilestoneSummaryModal.refresh_milestone_summary_modal_dropdowns = function(){
  fill_datalist_options('.milestone_category','#ms_category_datalist', false);
  fill_datalist_options('.milestone_status','#ms_status_datalist', false);
  fill_datalist_options('.milestone_owner','#ms_owner_datalist', false);
}

// Declare Function object's static method
MilestoneSummaryModal.populateModalView = function($ms_tr){
  // Fill modal dialog inputs
  var deadline = $ms_tr.find('.milestone_deadline').text();
  var category = $ms_tr.find('.milestone_category').text();
  var status = $ms_tr.find('.milestone_status').text();
  var owner = $ms_tr.find('.milestone_owner').text();
  var title = $ms_tr.find('.milestone_title').text();
  $('#input_ms_deadline').val(deadline.trim());
  $('#input_ms_category').val(category.trim());
  $('#input_ms_status').val(status.trim());
  $('#input_ms_owner').val(owner.trim());
  $('#input_ms_title').val(title.trim());
  MilestoneSummaryModal.refresh_milestone_summary_modal_dropdowns();
}

// Declare Function object's static method
MilestoneSummaryModal.OnSubmitPopulateHTML = function(event, $ms_tr){
    var $form = $('#milestoneSummaryModalForm')[0]; // Needs [0] because $('#id') returns a Set.
    // Trigger form validation
    if (!validateForm($form)){
      return false; // Does not seem to end up here if validation fails, but it works!!! (i.e. screen highlights errors)
    }
    // Here - Form validation AOK (so process input)
    var deadline = $('#input_ms_deadline').val().trim();
    var category = $('#input_ms_category').val().trim();
    var status = $('#input_ms_status').val().trim();
    var owner = $('#input_ms_owner').val().trim();
    var title = $('#input_ms_title').val().trim();
    //alert(deadline + ', ' + category + ', ' + status + ', ' + owner + ', ' + title);
    $ms_tr.find('.milestone_deadline').attr('data-code',deadline).text(deadline);
    $ms_tr.find('.milestone_category').attr('data-code',category).text(category);
    $ms_tr.find('.milestone_status').attr('data-code',status).text(status);
    $ms_tr.find('.milestone_owner').attr('data-code',owner).text(owner);
    $ms_tr.find('.milestone_title').text(title);
    // update milestone table dropdowns (in case new value added)
    refresh_milestone_table();
    // Needed to hide the modal because clicking Submit did not close it (or you can use $('#MilestoneSummaryEditModal').modal('hide');)
    $('#milestoneSummaryModal').modal('toggle');
    // Needed somehow to ensure edited values shows, otherwise, edited values shows briefly then reverts back to original.
    event.preventDefault();
    // Does not need this. Added for completion sake.
    event.stopPropagation();
    return true;
};

// Declare Function object's static method
MilestoneSummaryModal.prepareModalViewForInsert = function(){
  MilestoneSummaryModal.refresh_milestone_summary_modal_dropdowns();
}

// Declare Function object's static method
MilestoneSummaryModal.OnSubmitProcessInsert = function(event, isInsertAbove, $ms_tr, $cloned){
  if (MilestoneSummaryModal.OnSubmitPopulateHTML(event, $cloned)){
    if (isInsertAbove){
      $ms_tr.before($cloned);
    }else{
      $ms_tr.after($cloned);
    }
  }
}

// Declare Function object's static method
MilestoneSummaryModal.OnSubmitAddDeliverable = function(event, $ms_tr, $clonedDeliverable){
  if (StatusKeywordDescModal.OnSubmitPopulateHTML(event, $clonedDeliverable)){
    MilestoneHtmlTemplate.KeywordDescDecorator($clonedDeliverable);
    $ms_tr.find('.milestone-deliverables').append($clonedDeliverable);
    var $icon = CollapsibleView.getCollapsibleCtrlIcon($clonedDeliverable);
    CollapsibleView.refreshControlIcon($icon, true);
  }
}

// Declare Function object's static method
MilestoneSummaryModal.OnSubmitAddNote = function(event, $ms_tr, $clonedNote){
  if (MilestoneNoteSummaryModal.OnSubmitPopulateHTML(event, $clonedNote)){
    $ms_tr.find('.milestone_notes').append($clonedNote);
    var $icon = CollapsibleView.getCollapsibleCtrlIcon($clonedNote);
    CollapsibleView.refreshControlIcon($icon, true);
  }
}

// Milestone summary context menu actions
MilestoneSummaryModal.initContextMenu = function() {
  // Init milestone top level context menu
  // Init context menu to show up when any of the following classes are right-clicked
  $(".ms_deadline_td, .ms_category_td, .ms_status_td, .ms_owner_td, .milestone_title").contextMenu({
    menuSelector: "#milestone_summary_modal_contextmenu",  // the html to display when right-clicked
    menuSelected: function (invokedOn, selectedMenu) {
        // invokedOn    <- the element clicked
        // selectedMenu <- @data-action of the element clicked
        /*
        var msg = "Selected context menu text[" + selectedMenu.text() + 
                  "] with data-action[" + selectedMenu.data('action') +
                  "] on the element with value[" + invokedOn.text() + "]";
        alert(msg);
        */
        MilestoneSummaryModal.clearModal();
        var $ms_tr = invokedOn.closest('.milestone_tr');
        var action = selectedMenu.data('action');
        switch(action) {
          case 'edit':
            // Prepare modal view
            MilestoneSummaryModal.populateModalView($ms_tr);
            // The magic happens below (register submit onclick 'once' with event.data = $ms_tr (as param) when event triggered; then start the modal())
            // (use .one() because this Modal is also used by others, so handle on the fly)
            $("#milestoneSummaryModal").one('submit', $ms_tr, function(event){
              MilestoneSummaryModal.OnSubmitPopulateHTML(event, event.data);
            }).modal();
            break;
          case 'clone':
            var $cloned = $ms_tr.clone(true);
            $cloned.attr('id', guid());
            $ms_tr.after($cloned);
            break;
          case 'insertAbove':
            // Prepare modal view
            MilestoneSummaryModal.prepareModalViewForInsert();
            var $cloned = MilestoneHtmlTemplate.Milestone();
            // The magic
            // (use .one() because this Modal is also used by others, so handle on the fly)
            $("#milestoneSummaryModal").one('submit', {isInsertAbove:true, ms_tr:$ms_tr, cloned:$cloned}, function(event){
              MilestoneSummaryModal.OnSubmitProcessInsert(event, event.data.isInsertAbove, event.data.ms_tr, event.data.cloned);
            }).modal();
            break;
          case 'insertBelow':
            // Prepare modal view
            MilestoneSummaryModal.prepareModalViewForInsert();
            var $cloned = MilestoneHtmlTemplate.Milestone();
            // The magic
            // (use .one() because this Modal is also used by others, so handle on the fly)
            $("#milestoneSummaryModal").one('submit', {isInsertAbove:false, ms_tr:$ms_tr, cloned:$cloned}, function(event){
              MilestoneSummaryModal.OnSubmitProcessInsert(event, event.data.isInsertAbove, event.data.ms_tr, event.data.cloned);
            }).modal();
            break;
          case 'delete':
            if (confirm("You are about to delete the entire milestone and its deliverables!")) {
              $ms_tr.remove();
              refresh_milestone_table();
            }
            break;
          case 'addDeliverable':
            MilestoneDeliverableSummaryModal.prepareModalViewForInsert('Milestone deliverable');
            var $clonedDeliverable = MilestoneHtmlTemplate.Deliverable();
            MilestoneDeliverableSummaryModal.refresh_deliverable_modal_dropdown();
            // (use .one() because this Modal is also used by others, so handle on the fly)
            $("#statusKeywordDescModal").one('submit', {ms_tr:$ms_tr, clonedDeliverable:$clonedDeliverable}, function(event){
              MilestoneSummaryModal.OnSubmitAddDeliverable(event, event.data.ms_tr, event.data.clonedDeliverable);
            }).modal();
            break;
          case 'addNote':
            MilestoneNoteSummaryModal.prepareModalViewForInsert();
            var $cloned = MilestoneHtmlTemplate.Note();
            // (use .one() because this Modal is also used by others, so handle on the fly)
            $("#milestoneNoteSummaryModal").one('submit', {isInsertAbove:false, ms_tr:$ms_tr, cloned:$cloned}, function(event){
              MilestoneSummaryModal.OnSubmitAddNote(event, event.data.ms_tr, event.data.cloned);
            }).modal();
            break;
          default:
            alert("This action[ " + action + " ] is not implemented yet");
            break;
        }
    }
  });
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// GENERIC Helper: StatusKeywordDescModal for editing STATUS, KEYWORD, DESC
// Works with id="statusKeywordDescModal"
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// Declare Function object
function StatusKeywordDescModal() {}

StatusKeywordDescModal.init = function(){
  // Place cursor on input when Bootstrap Modal is shown
  $('#statusKeywordDescModal').on('shown.bs.modal', function () {
      $('#input_ms_status2').focus();
  }) 
}

StatusKeywordDescModal.clearModal = function(){
  $('#input_ms_status2').val('');
  $('#input_ms_keyword').val('');
  $('#input_ms_desc').val('');
}

StatusKeywordDescModal.populateModalView = function($keywordDesc_li, title){
  // Fill modal dialog inputs
  var status = $keywordDesc_li.find('.ms_status:first').text();
  var keyword = $keywordDesc_li.find('.ms_keyword:first').text();
  var desc = $keywordDesc_li.find('.ms_desc:first').text();
  $('#statusKeywordDescModal .modal-title').text(title);
  $('#input_ms_status2').val(status.trim());
  $('#input_ms_keyword').val(keyword.trim());
  $('#input_ms_desc').val(desc.trim());
}

StatusKeywordDescModal.OnSubmitPopulateHTML = function(event, $keywordDesc_li){
    var $form = $('#statusKeywordDescModalForm')[0]; // Needs [0] because $('#id') returns a Set.
    if (!validateForm($form)){
      return false;
    }
    // Here - Form validation AOK (so process input)
    var status = $('#input_ms_status2').val().trim();
    var keyword = $('#input_ms_keyword').val().trim();
    var desc = $('#input_ms_desc').val().trim();
    $keywordDesc_li.find('.ms_status:first').attr('data-code',status).text(status ? ' '+status : '');
    $keywordDesc_li.find('.ms_keyword:first').attr('data-code',keyword).text(keyword);
    $keywordDesc_li.find('.ms_desc:first').attr('data-code',desc).text(desc);
    // Needed to hide the modal because clicking Submit did not close it (or you can use $('#statusKeywordDescModal').modal('hide');)
    $('#statusKeywordDescModal').modal('toggle');
    // Needed somehow to ensure edited values shows, otherwise, edited values shows briefly then reverts back to original.
    event.preventDefault();
    // Does not need this. Added for completion sake.
    event.stopPropagation();
    return true;
}

StatusKeywordDescModal.resetModalViewStatusKeywordDesc = function(title){
  $('#statusKeywordDescModal .modal-title').text(title);
  StatusKeywordDescModal.clearModal();
}

StatusKeywordDescModal.OnSubmitProcessInsert = function(event, isInsertAbove, $keywordDesc_li, $cloned){
  if (StatusKeywordDescModal.OnSubmitPopulateHTML(event, $cloned)){
    if (isInsertAbove){
      $cloned.insertBefore($keywordDesc_li);
    }else{
      $cloned.insertAfter($keywordDesc_li);
    }
  }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Milestone Deliverable Editing
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// Declare Function object
function MilestoneDeliverableSummaryModal() {}

MilestoneDeliverableSummaryModal.refresh_deliverable_modal_dropdown = function(){
  fill_datalist_options('.deliverable .ms_status','#ms_status_datalist2', false);
}

MilestoneDeliverableSummaryModal.populateModalView = function($keywordDesc_li, title){
  StatusKeywordDescModal.populateModalView($keywordDesc_li, title);  // reuse
}

MilestoneDeliverableSummaryModal.OnSubmitPopulateHTML = function(event, $keywordDesc_li){
  return StatusKeywordDescModal.OnSubmitPopulateHTML(event, $keywordDesc_li); // reuse
}

MilestoneDeliverableSummaryModal.prepareModalViewForInsert = function(title){
  StatusKeywordDescModal.resetModalViewStatusKeywordDesc(title); // reuse
}

MilestoneDeliverableSummaryModal.OnSubmitProcessInsert = function(event, isInsertAbove, $keywordDesc_li, $cloned){
  StatusKeywordDescModal.OnSubmitProcessInsert(event, isInsertAbove, $keywordDesc_li, $cloned); // reuse
}

MilestoneDeliverableSummaryModal.OnSubmitAddDeliverableItem = function(event, $deliverable_li, $clonedDeliverableItemDesc){
  if (StatusKeywordDescModal.OnSubmitPopulateHTML(event, $clonedDeliverableItemDesc)){
    MilestoneHtmlTemplate.KeywordDescDecorator($clonedDeliverableItemDesc);
    $deliverable_li.find('.deliverable-items').append($clonedDeliverableItemDesc);
    var $icon = CollapsibleView.getCollapsibleCtrlIcon($clonedDeliverableItemDesc);
    CollapsibleView.refreshControlIcon($icon, true);
  }
}

// Milestone deliverable context menu actions
MilestoneDeliverableSummaryModal.initContextMenu = function() {
  $(".deliverable_attr").contextMenu({
    menuSelector: "#milestone_deliverable_modal_contextmenu",  // the html to display when right-clicked
    menuSelected: function (invokedOn, selectedMenu) {
        var $deliverable_li = invokedOn.closest('.deliverable');
        var action = selectedMenu.data('action');
        switch(action) {
          case 'edit':
            MilestoneDeliverableSummaryModal.populateModalView($deliverable_li, 'Milestone deliverable');
            MilestoneDeliverableSummaryModal.refresh_deliverable_modal_dropdown();
            // (use .one() because this Modal is also used by others, so handle on the fly)
            $("#statusKeywordDescModal").one('submit', $deliverable_li, function(event){
              MilestoneDeliverableSummaryModal.OnSubmitPopulateHTML(event, event.data);
            }).modal();
            break;
          case 'clone':
            var $cloned = $deliverable_li.clone(true);
            $cloned.attr('id', guid());
            $deliverable_li.after($cloned);
            break;
          case 'insertAbove':
            MilestoneDeliverableSummaryModal.prepareModalViewForInsert('Milestone deliverable');
            var $cloned = MilestoneHtmlTemplate.Deliverable();
            MilestoneDeliverableSummaryModal.refresh_deliverable_modal_dropdown();
            // (use .one() because this Modal is also used by others, so handle on the fly)
            $("#statusKeywordDescModal").one('submit', {isInsertAbove:true, deliverable_li:$deliverable_li, cloned:$cloned}, function(event){
              MilestoneDeliverableSummaryModal.OnSubmitProcessInsert(event, event.data.isInsertAbove, event.data.deliverable_li, event.data.cloned);
            }).modal();
            break;
          case 'insertBelow':
            MilestoneDeliverableSummaryModal.prepareModalViewForInsert('Milestone deliverable');
            var $cloned = MilestoneHtmlTemplate.Deliverable();
            MilestoneDeliverableSummaryModal.refresh_deliverable_modal_dropdown();
            // (use .one() because this Modal is also used by others, so handle on the fly)
            $("#statusKeywordDescModal").one('submit', {isInsertAbove:false, deliverable_li:$deliverable_li, cloned:$cloned}, function(event){
              MilestoneDeliverableSummaryModal.OnSubmitProcessInsert(event, event.data.isInsertAbove, event.data.deliverable_li, event.data.cloned);
            }).modal();
            break;
          case 'delete':
            if (confirm("You are about to delete this milestone deliverable and its items!")) {
              var $icon = CollapsibleView.getCollapsibleCtrlIcon($deliverable_li);
              $deliverable_li.remove();
              CollapsibleView.refreshControlIcon($icon, false);
              refresh_milestone_table();
            }
            break;
          case 'addDeliverableItem':
            MilestoneDeliverableItemModal.prepareModalViewForInsert('Milestone deliverable item');
            var $clonedDeliverableItemDesc= MilestoneHtmlTemplate.DeliverableItemDesc();
            MilestoneDeliverableItemModal.refresh_DeliverableItem_modal_dropdown();
            // (use .one() because this Modal is also used by others, so handle on the fly)
            $("#statusKeywordDescModal").one('submit', {deliverable_li:$deliverable_li, clonedDeliverableItemDesc:$clonedDeliverableItemDesc}, function(event){
              MilestoneDeliverableSummaryModal.OnSubmitAddDeliverableItem(event, event.data.deliverable_li, event.data.clonedDeliverableItemDesc);
            }).modal();
            break;
          default:
            alert("This action[ " + action + " ] is not implemented yet");
            break;
        }
    }
  });
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Milestone Deliverable Item Editing
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// Declare Function object
function MilestoneDeliverableItemModal() {}

MilestoneDeliverableItemModal.refresh_DeliverableItem_modal_dropdown = function(){
  fill_datalist_options('.ms_note .ms_status','#ms_status_datalist2', false);
}

MilestoneDeliverableItemModal.populateModalView = function($keywordDesc_li, title){
  StatusKeywordDescModal.populateModalView($keywordDesc_li, title); // reuse
}

MilestoneDeliverableItemModal.OnSubmitPopulateHTML = function(event, $keywordDesc_li){
  return StatusKeywordDescModal.OnSubmitPopulateHTML(event, $keywordDesc_li);  // reuse
}

MilestoneDeliverableItemModal.prepareModalViewForInsert = function(title){
  StatusKeywordDescModal.resetModalViewStatusKeywordDesc(title);  // reuse
}

MilestoneDeliverableItemModal.OnSubmitProcessInsert = function(event, isInsertAbove, $keywordDesc_li, $cloned){
  StatusKeywordDescModal.OnSubmitProcessInsert(event, isInsertAbove, $keywordDesc_li, $cloned);  // reuse
}

// Milestone Deliverable Items Context Menu actions
 MilestoneDeliverableItemModal.initContextMenu = function() {
  $(".deliverable .item_desc").contextMenu({
    menuSelector: "#milestone_general_edit_contextmenu",  // the html to display when right-clicked
    menuSelected: function (invokedOn, selectedMenu) {
        var $keywordDesc_li = invokedOn.closest('.item_desc');
        var action = selectedMenu.data('action');
        switch(action) {
          case 'edit':
            MilestoneDeliverableItemModal.populateModalView($keywordDesc_li, 'Milestone deliverable item');
            MilestoneDeliverableItemModal.refresh_DeliverableItem_modal_dropdown();
            // (use .one() because this Modal is also used by others, so handle on the fly)
            $("#statusKeywordDescModal").one('submit', $keywordDesc_li, function(event){
              MilestoneDeliverableItemModal.OnSubmitPopulateHTML(event, event.data);
            }).modal();
            break;
          case 'clone':
            var $cloned = $keywordDesc_li.clone(true);
            $cloned.attr('id', guid());
            $keywordDesc_li.after($cloned);
            break;
          case 'insertAbove':
            MilestoneDeliverableItemModal.prepareModalViewForInsert('Milestone deliverable item');
            var $cloned = MilestoneHtmlTemplate.DeliverableItemDesc();
            MilestoneDeliverableItemModal.refresh_DeliverableItem_modal_dropdown();
            // (use .one() because this Modal is also used by others, so handle on the fly)
            $("#statusKeywordDescModal").one('submit', {isInsertAbove:true, keywordDesc_li:$keywordDesc_li, cloned:$cloned}, function(event){
              MilestoneDeliverableItemModal.OnSubmitProcessInsert(event, event.data.isInsertAbove, event.data.keywordDesc_li, event.data.cloned);
            }).modal();
            break;
          case 'insertBelow':
            MilestoneDeliverableItemModal.prepareModalViewForInsert('Milestone deliverable item');
            var $cloned = MilestoneHtmlTemplate.DeliverableItemDesc();
            MilestoneDeliverableItemModal.refresh_DeliverableItem_modal_dropdown();
            // (use .one() because this Modal is also used by others, so handle on the fly)
            $("#statusKeywordDescModal").one('submit', {isInsertAbove:false, keywordDesc_li:$keywordDesc_li, cloned:$cloned}, function(event){
              MilestoneDeliverableItemModal.OnSubmitProcessInsert(event, event.data.isInsertAbove, event.data.keywordDesc_li, event.data.cloned);
            }).modal();
            break;
          case 'delete':
            if (confirm("You are about to delete this deliverable item!")) {
              var $icon = CollapsibleView.getCollapsibleCtrlIcon($keywordDesc_li);
              $keywordDesc_li.remove();
              CollapsibleView.refreshControlIcon($icon, false);
              refresh_milestone_table();
            }
            break;
          default:
            alert("This action[ " + action + " ] is not implemented yet");
            break;
        }
    }
  });
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Milestone Note Summary Editing
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// Declare Function object
function MilestoneNoteSummaryModal() {}

MilestoneNoteSummaryModal.init = function(){
  // Place cursor on input when Bootstrap Modal is shown
  $('#milestoneNoteSummaryModal').on('shown.bs.modal', function () {
      $('#input_ms_note_title').focus();
  }) 
}

MilestoneNoteSummaryModal.clearModal = function(){
  $('#input_ms_note_title').val('');
}

MilestoneNoteSummaryModal.populateModalView = function($ms_note){
  // Fill modal dialog inputs
  var title = $ms_note.find('.ms_note_title').text();
  $('#input_ms_note_title').val(title.trim());
}

MilestoneNoteSummaryModal.OnSubmitPopulateHTML = function(event, $ms_note){
    var $form = $('#milestoneNoteSummaryModalForm')[0]; // Needs [0] because $('#id') returns a Set.
    // Trigger form validation
    if (!validateForm($form)){
      return false; // Does not seem to end up here if validation fails, but it works!!! (i.e. screen highlights errors)
    }
    // Here - Form validation AOK (so process input)
    var title = $('#input_ms_note_title').val().trim();
    $ms_note.find('.ms_note_title').text(title);
    // Needed to hide the modal because clicking Submit did not close it (or you can use $('#MilestoneSummaryEditModal').modal('hide');)
    $('#milestoneNoteSummaryModal').modal('toggle');
    // Needed somehow to ensure edited values shows, otherwise, edited values shows briefly then reverts back to original.
    event.preventDefault();
    // Does not need this. Added for completion sake.
    event.stopPropagation();
    return true;
}

MilestoneNoteSummaryModal.prepareModalViewForInsert = function(){
  MilestoneNoteSummaryModal.clearModal();
}

MilestoneNoteSummaryModal.OnSubmitProcessInsert = function(event, isInsertAbove, $ms_note, $cloned){
  if (MilestoneNoteSummaryModal.OnSubmitPopulateHTML(event, $cloned)){
    if (isInsertAbove){
      $ms_note.before($cloned);
    }else{
      $ms_note.after($cloned);
    }
  }
}

MilestoneNoteSummaryModal.OnSubmitAddNoteItem = function(event, $ms_note, $clonedNoteItem){
  if (StatusKeywordDescModal.OnSubmitPopulateHTML(event, $clonedNoteItem)){
    MilestoneHtmlTemplate.KeywordDescDecorator($clonedNoteItem);
    $ms_note.find('.ms_note_items').append($clonedNoteItem);
    var $icon = CollapsibleView.getCollapsibleCtrlIcon($clonedNoteItem);
    CollapsibleView.refreshControlIcon($icon, true);
  }
}

// Milestone note title context menu actions
MilestoneNoteSummaryModal.initContextMenu = function() {
  $(".milestone_note .ms_note_about").contextMenu({
    menuSelector: "#milestone_Note_modal_contextmenu",  // the html to display when right-clicked
    menuSelected: function (invokedOn, selectedMenu) {
        var $ms_note = invokedOn.closest('.milestone_note');
        var action = selectedMenu.data('action');
        switch(action) {
          case 'edit':
            MilestoneNoteSummaryModal.populateModalView($ms_note);
            // (use .one() because this Modal is also used by others, so handle on the fly)
            $("#milestoneNoteSummaryModal").one('submit', $ms_note, function(event){
              MilestoneNoteSummaryModal.OnSubmitPopulateHTML(event, event.data);
            }).modal();
            break;
          case 'clone':
            var $cloned = $ms_note.clone(true);
            $cloned.attr('id', guid());
            $ms_note.after($cloned);
            break;
          case 'insertAbove':
            MilestoneNoteSummaryModal.prepareModalViewForInsert();
            var $cloned = MilestoneHtmlTemplate.Note();
            // (use .one() because this Modal is also used by others, so handle on the fly)
            $("#milestoneNoteSummaryModal").one('submit', {isInsertAbove:true, ms_note:$ms_note, cloned:$cloned}, function(event){
              MilestoneNoteSummaryModal.OnSubmitProcessInsert(event, event.data.isInsertAbove, event.data.ms_note, event.data.cloned);
            }).modal();
            break;
          case 'insertBelow':
            MilestoneNoteSummaryModal.prepareModalViewForInsert();
            var $cloned = MilestoneHtmlTemplate.Note();
            // (use .one() because this Modal is also used by others, so handle on the fly)
            $("#milestoneNoteSummaryModal").one('submit', {isInsertAbove:false, ms_note:$ms_note, cloned:$cloned}, function(event){
              MilestoneNoteSummaryModal.OnSubmitProcessInsert(event, event.data.isInsertAbove, event.data.ms_note, event.data.cloned);
            }).modal();
            break;
          case 'delete':
            if (confirm("You are about to delete this milestone note and its items!")) {
              var $icon = CollapsibleView.getCollapsibleCtrlIcon($ms_note);
              $ms_note.remove();
              CollapsibleView.refreshControlIcon($icon, false);
              refresh_milestone_table();
            }
            break;
          case 'addNoteItem':
            MilestoneNoteItemModal.prepareModalViewForInsert('Milestone note item');
            var $clonedNoteItem = MilestoneHtmlTemplate.NoteItemDesc();
            MilestoneNoteItemModal.refresh_NoteItem_modal_dropdown();
            // (use .one() because this Modal is also used by others, so handle on the fly)
            $("#statusKeywordDescModal").one('submit', {ms_note:$ms_note, clonedNoteItem:$clonedNoteItem}, function(event){
              MilestoneNoteSummaryModal.OnSubmitAddNoteItem(event, event.data.ms_note, event.data.clonedNoteItem);
            }).modal();
            break;
          default:
            alert("This action[ " + action + " ] is not implemented yet");
            break;
        }
    }
  });
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Milestone Milestone Note Item Editing
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// Declare Function object
function MilestoneNoteItemModal() {}

MilestoneNoteItemModal.refresh_NoteItem_modal_dropdown = function(){
  fill_datalist_options('.ms_note_items .ms_status','#ms_status_datalist2', false);
}

MilestoneNoteItemModal.populateModalView = function($keywordDesc_li, title){
  StatusKeywordDescModal.populateModalView($keywordDesc_li, title); // reuse
}

MilestoneNoteItemModal.OnSubmitPopulateHTML = function(event, $keywordDesc_li){
  return StatusKeywordDescModal.OnSubmitPopulateHTML(event, $keywordDesc_li);  // reuse
}

MilestoneNoteItemModal.prepareModalViewForInsert = function(title){
  StatusKeywordDescModal.resetModalViewStatusKeywordDesc(title);  // reuse
}

MilestoneNoteItemModal.OnSubmitProcessInsertKeyword = function(event, isInsertAbove, $keywordDesc_li, $cloned){
  StatusKeywordDescModal.OnSubmitProcessInsert(event, isInsertAbove, $keywordDesc_li, $cloned);  // reuse
}

// Milestone note item context menu actions
MilestoneNoteItemModal.initContextMenu = function() {
  $(".ms_note_items .item_desc").contextMenu({
    menuSelector: "#milestone_general_edit_contextmenu",  // the html to display when right-clicked
    menuSelected: function (invokedOn, selectedMenu) {
        var $keywordDesc_li = invokedOn.closest('.item_desc');
        var action = selectedMenu.data('action');
        switch(action) {
          case 'edit':
            MilestoneNoteItemModal.populateModalView($keywordDesc_li, 'Milestone note item');
            MilestoneNoteItemModal.refresh_NoteItem_modal_dropdown();
            // (use .one() because this Modal is also used by others, so handle on the fly)
            $("#statusKeywordDescModal").one('submit', $keywordDesc_li, function(event){
              MilestoneNoteItemModal.OnSubmitPopulateHTML(event, event.data);
            }).modal();
            break;
          case 'clone':
            var $cloned = $keywordDesc_li.clone(true);
            $cloned.attr('id', guid());
            $keywordDesc_li.after($cloned);
            break;
          case 'insertAbove':
            MilestoneNoteItemModal.prepareModalViewForInsert('Milestone note item');
            var $cloned = MilestoneHtmlTemplate.NoteItemDesc();
            MilestoneNoteItemModal.refresh_NoteItem_modal_dropdown();
            // (use .one() because this Modal is also used by others, so handle on the fly)
            $("#statusKeywordDescModal").one('submit', {isInsertAbove:true, keywordDesc_li:$keywordDesc_li, cloned:$cloned}, function(event){
              MilestoneNoteItemModal.OnSubmitProcessInsertKeyword(event, event.data.isInsertAbove, event.data.keywordDesc_li, event.data.cloned);
            }).modal();
            break;
          case 'insertBelow':
            MilestoneNoteItemModal.prepareModalViewForInsert('Milestone note item');
            var $cloned = MilestoneHtmlTemplate.NoteItemDesc();
            MilestoneNoteItemModal.refresh_NoteItem_modal_dropdown();
            // (use .one() because this Modal is also used by others, so handle on the fly)
            $("#statusKeywordDescModal").one('submit', {isInsertAbove:false, keywordDesc_li:$keywordDesc_li, cloned:$cloned}, function(event){
              MilestoneNoteItemModal.OnSubmitProcessInsertKeyword(event, event.data.isInsertAbove, event.data.keywordDesc_li, event.data.cloned);
            }).modal();
            break;
          case 'delete':
            if (confirm("You are about to delete the entire row!")) {
              var $icon = CollapsibleView.getCollapsibleCtrlIcon($keywordDesc_li);
              $keywordDesc_li.remove();
              CollapsibleView.refreshControlIcon($icon, false);
              refresh_milestone_table();
            }
            break;
          default:
            alert("This action[ " + action + " ] is not implemented yet");
            break;
        }
    }
  });
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function buildMilestoneJson($milestone_tr) {
  var deadline = $milestone_tr.find('.milestone_deadline').val().trim();
  var category = $milestone_tr.find('.milestone_category').val().trim();
  var status = $milestone_tr.find('.ms_status_td').val().trim();
  var owner = $milestone_tr.find('.milestone_owner').val().trim();
  var $ms_td = $milestone_tr.find('.ms_milestone_td');
  
  var deliverables = [];
  $ms_td.find('.deliverable').each(function(idx){
    var json = buildMilestoneDeliverableJson($(this));
    deliverables.push(json);
  });

  var notes = [];
  $ms_td.find('.milestone_note').each(function(idx){
    var $milestoneNote = $(this);
    var json2 = buildMilestoneNoteJson($milestoneNote);
    notes.push(json2);
  });
  
  // result
  return {
    "deadline": deadline,
    "category": category,
    "status": status,
    "owner": owner,
    "deliverables": deliverables,
    "notes": notes
  };
}

function buildMilestoneDeliverableJson($deliverable) {
  // deliverable attributes
  var $deliverableAttr = $deliverable.find('.deliverable_attr');
  var deliverableAttrJson = buildKeywordDescJson($deliverableAttr);
  // deliverable item_desc
  var itemDescs = [];
  $deliverable.find('.deliverable-items li').each(function(idx){
    var $itemDesc = $(this);
    var itemDescJson = buildKeywordDescJson($itemDesc);
    itemDescs.push(itemDescJson);
  });
  // result
  return {
    "attr": deliverableAttrJson,
    "items": itemDescs
  };
}

function buildMilestoneNoteJson($milestoneNote) {
  var title = $milestoneNote.find('.title').text();
  var itemDescs = [];
  $milestoneNote.find('.item li').each(function(idx){
    var $itemDesc = $(this);
    var itemDescJson = buildKeywordDescJson($itemDesc);
    itemDescs.push(itemDescJson);
  });
  return {
    "title": title,
    "items": itemDescs
  };
}

function buildKeywordDescJson($ele) {
  return {
    "keyword": $ele.find('.keyword').text(),
    "desc":    $ele.find('.desc').text()
  };
}
