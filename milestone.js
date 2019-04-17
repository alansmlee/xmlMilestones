function isDone(status){
  return status ? status.toLowerCase() == Global.Constant.STATUS_DONE : false;
}

/*
 * **************
 * Functions
 * **************
 */
function init_all() {
  init_common();
  init_theme();
  
  // Initialise all tool-tips in the document (Bootstrap)
  //$('[data-toggle="tooltip"]').tooltip(); 
  
  var theTitle = $('#page-title').val();        
  $(document).attr("title", theTitle);
  
  init_page_reload_btn();
  init_collapse_expand_all_milestone_btn();
  init_save_milestone_xml_to_clipboard_btn();
  init_milestone_search_btn();
  init_milestone_unhighlight_btn();
  
  init_milestones();
  CollapsibleView.init();
}

function init_theme(){
  $('#ms_theme div[name=css]').each(function(idx, ele){
    $div = $(this);
    var selector = $div.attr('selector');
    var cssValue = $div.attr('cssValue');
    var cssJson = string2Json(cssValue);
    $(selector).css(cssJson);
  });
}

function reloadPage() {
  if (confirm('This action reloads the page from the server.\nW A R N I N G. It will cause all your changes to be lost.\n\nAre you sure you want to continue ?')){
    location.reload(true);  // true - reload again from the server (i.e. not cache refresh)
  }
}

function init_page_reload_btn() {
  $('#page-reload-btn').on('click', function() {
    reloadPage();
  });
}

function init_milestone_search_btn(){
  $('#milestone-search-btn').on('click', function(){
    var searchText = $('#milestone-search-input').val();
    // highlight the text
    $('#milestone_tbody .milestone_td').mark(searchText);
    // expand the milestones that has highlighted text
    expandHighlightedMilestones();
  });
}

function expandHighlightedMilestones(){
  $('#milestone_tbody .milestone_td').find('mark').each(function(idx,ele){
    var $ms_td = $(this).closest('.milestone_td');
    var iconEnum = CollapsibleView.getIconEnum($ms_td);
    // only need to expand those milestones with highlights that are not already expanded
    if (iconEnum === CollapsibleView.Icon.EXPAND){
      CollapsibleView.expandMilestone($ms_td);
    }
  });
}

function init_milestone_unhighlight_btn(){
  $('#milestone-unhighlight-btn').on('click', function(){
    // unhighlight the text
    $('#milestone_tbody .milestone_td').unmark();
    $('#milestone-search-input').val('');
  });
}

function init_milestones() {
  refresh_milestone_table();
  init_milestone_widerview_btn();
  init_milestone_editing();
}

function refresh_milestone_table(){
  refresh_milestone_buttons_visibility();  
  validate_milestone_deadlines_daysLeft();
  refresh_milestone_category_dropdown();
  refresh_milestone_status_dropdown();
  refresh_milestone_owner_dropdown();
}

function refresh_milestone_buttons_visibility(){
  var $ms_tr_elements = $('#milestone_table .milestone_tr:visible');
  // milestone rows that are visible
  if ($ms_tr_elements.length > 0){
    $('#milestone_table .has-milestones').show();
    $('#milestone_table .no-milestones').hide();
  }else{
    $('#milestone_table .has-milestones').hide();
    $('#milestone_table .no-milestones').show();
  }
}

function refresh_milestone_category_dropdown() {
  init_milestone_table_column_dropdown('.milestone_category', '#milestone_categories_dropdown');
}

function refresh_milestone_status_dropdown() {
  init_milestone_table_column_dropdown('.milestone_status', '#milestone_status_dropdown');
  // Inject the 'NOT DONE' option after the first one.
  var theNotDoneOption = new Option(Global.Constant.TEXT_NOT_DONE, Global.Constant.TEXT_NOT_DONE, false, false);
  $('#milestone_status_dropdown option:eq(0)').after(theNotDoneOption);
}

function refresh_milestone_owner_dropdown() {
  init_milestone_table_column_dropdown('.milestone_owner', '#milestone_owners_dropdown');
}

function init_milestone_widerview_btn() {
  $('#milestone-wider-btn').on('click', function() {
    // show or hide columns
    $('.ms_hide_col').toggle();
    // update the button text
    if ($('.ms_hide_col:first').is(':visible')) {
      $('#milestone-wider-btn span').text(' Wider View ');
      $('#milestone-wider-btn i').addClass('fa-long-arrow-left');
      $('#milestone-wider-btn i').removeClass('fa-long-arrow-right');
    } else {
      $('#milestone-wider-btn span').text(' Reset View Width');
      $('#milestone-wider-btn i').removeClass('fa-long-arrow-left');
      $('#milestone-wider-btn i').addClass('fa-long-arrow-right');
    }
  });
}

/*
 * Generic method to init milestone dropdown
 *
 * @param{string} field_class where it contains the value e.g. '.milestone_category'
 * @param{string} dropdown_id where dropdown element is e.g. '#milestone_categories_dropdown'
 */
function init_milestone_table_column_dropdown(field_class, dropdown_id) {
  fill_datalist_options(field_class, dropdown_id, true);
  
  // Init dropdown select action
  $(dropdown_id).on('change', function(e) {
    // show selected milestones
    showHideMilestoneRecords();
  });
}

function fill_datalist_options(field_class, dropdown_id, isAddShowAll) {
  // Read all category and ensure no duplicate categories in the Set
  var fieldValues = new Set();
  $(field_class).each(function(id, ele) {
    var fValue = $(ele).attr('data-code');
    if (fValue){
      fieldValues.add(fValue);
    }
  });
  fieldValues = sort(fieldValues);
  // Add field values to the dropdown_id
  var $dropdown = $(dropdown_id);
  $dropdown.empty(); // remove all options first
  if (isAddShowAll) {
    var theAllOption = new Option(Global.Constant.TEXT_SHOW_ALL, Global.Constant.TEXT_SHOW_ALL, false, false);
    $dropdown.append(theAllOption);
  }
  fieldValues.forEach(function(fValue) {
    var newOption = new Option(fValue, fValue, false, false);
    $dropdown.append(newOption);
  });
}  

/*
 * Show hide milestone records according to the Column dropdown values
 */
function showHideMilestoneRecords() {

  $('.milestone_tr').each(function(id, ele) {
    var isToShow = true;
    $row = $(ele);
    // Go thru all the dropboxes
    isToShow &= isFieldValueEqualsSelected($row, '.milestone_category', '#milestone_categories_dropdown');
    isToShow &= isFieldValueEqualsSelected($row, '.milestone_status', '#milestone_status_dropdown');
    isToShow &= isFieldValueEqualsSelected($row, '.milestone_owner', '#milestone_owners_dropdown');
    if (isToShow) {
      $row.show();
    } else {
      $row.hide();
    }
  });
}

function isFieldValueEqualsSelected($row, field_class, dropdown_id) {
  // get field value
  var fValue = $row.find(field_class).attr('data-code');
  // get dropdown value
  var selValue = $(dropdown_id + ' option:selected').text();
  // *** SPECIAL HANDLING ***
  if (dropdown_id == '#milestone_status_dropdown') {
    // Show if field status != 'done'
    if (selValue == Global.Constant.TEXT_NOT_DONE) {
      return fValue == null || !isDone(fValue);
    }
  }
  // generic matching check
  return fValue!= null && (selValue == Global.Constant.TEXT_SHOW_ALL || selValue == fValue);
}

function validate_milestone_deadlines_daysLeft() {
  // Flag if deadline has gone past today's date and status is still not done
  var prevValidDeadline = null;
  var today = todayDate();
  $('.milestone_deadline').each(function(id, ele) {
    var $deadlineEle = $(ele);
    var deadlineText = $deadlineEle.attr('data-code');
    var deadlineDate = Date.parse(deadlineText);
    var $statusEle = $deadlineEle.closest('.milestone_tr').find('.milestone_status');
    var status = $statusEle.attr('data-code');
    /**
     * Calculate and show days left column
     */
    var daysLeftStr = calcDuration(deadlineDate, today);
    var $daysLeftEle = $deadlineEle.closest('.milestone_tr').find('.milestone_daysleft');
    if (isDone(status)) {
      $daysLeftEle.text('NA');
    } else {
      $daysLeftEle.text(daysLeftStr);
      if (daysLeftStr.startsWith('-')) {
        $daysLeftEle.css({'color':'red'});
      }
    }
    /**
     * Show milestone dealine column
     */
    // Show conditional milestone dates color
    if (isDone(status)) {
      return true; // i.e. continue
    } else if ((deadlineDate == null ) || is_DateA_before_DateB(deadlineDate, today)) {
      $deadlineEle.css({'color':'red', 'font-weight':'bold'});
    }
    // Show 'level-up arrow' if milestone date is before prevValidDeadline
    if (deadlineDate != null && prevValidDeadline != null) {
      if (is_DateA_before_DateB(deadlineDate, prevValidDeadline)) {
        // BEGIN-below 2 lines work together
        $deadlineEle.next().empty(); // remove the immediate next sibling (ie the element of $deadlineEle.after) before adding the element $deadlineEle.after
        $deadlineEle.after('<span title="This date is earlier than previous date. Move this date up"> <i class="fa fa-level-up"/></span>');
        // END-above
        return true; // i.e. continue
      }
    }
    // Save this milestone date (for next comparison)
    if (deadlineDate != null) {
      prevValidDeadline = deadlineDate;
    }
  });
}

function init_collapse_expand_all_milestone_btn() {
  $('#collapse-expand-all-btn').on('click', function() {
    // toggle icon (+/-)
    var $i = $(this).children('i');
    var $span = $(this).children('span');
    $i
      .toggleClass('fa-plus')
      .toggleClass('fa-minus');
      
    // show or hide deliverable items
    if ($i.hasClass('fa-plus')) {
      $span.text('Expand');
      CollapsibleView.collapseAllMilestones();
    } else {
      $span.text('Collapse');
      CollapsibleView.expandAllMilestones();
    }
  });
}

function init_save_milestone_xml_to_clipboard_btn(){
  $('#milestone-xml-to-clipboard-btn').on('click', function(){
    var extraNote = "The text(XML) completely represents the data you see on screen.\n1) Save the text to a file (e.g. myData.xml)\n2) The 'Load from file' button enables you to select a file to view it on screen again\n\nPlease back up the file before you overwrite it !!!";
    var booleanHolder = BooleanHolder.instance();
    var string = MilestoneHtml_helper.buildMilestoneXml(booleanHolder);
    var isValid = booleanHolder.isValid;
    if (!isValid){
      extraNote = 'W A R N I N G - the clipboard contains invalid xml\n\nPlease save the clipboard data and contact the developer';
    }
    copyStringToClipboard(string, 'Milestones XML', extraNote);
  });
}

// ******************************************************************************************
// Milestone html elements templates (to facilitate adding new milestones, deliverables, etc)
// 
// The Trick:
// MilestoneHtmlTemplate clones the transformed html from the milestone.xsl (including any event handlers initialised)
// thereby returns the exact html representation.
// Cloning uses the root element where id='milestone_html_template' (this element is hidden from the user)
// ******************************************************************************************
function MilestoneHtmlTemplate() {}

// Returns a cloned but empty (no deliverables or notes) Milestone 'tr' <tr class='milestone_tr' ...> (ready to be added to the table after filling in data)
MilestoneHtmlTemplate.Milestone = function(){
  var $ms_tr = $('#milestone_html_template');
  var $cloned = $ms_tr.clone(true);
  $cloned.removeAttr('hide');
  $cloned.attr('id', guid());
  $cloned.show();                               // enable showing (was display:none);
  $cloned.find('.collapsable-section').show();  // enable showing (was display:none);
  // Reset
  
  CollapsibleView.allIconsAsInactive($cloned);
  
  $cloned.find('.milestone_td').find('.deliverable').remove();
  $cloned.find('.milestone_td').find('.milestone_note').remove();
  $cloned.find('.milestone_deadline').removeAttr('data-code').text(Global.Constant.EMPTY_STR);
  $cloned.find('.milestone_category').removeAttr('data-code').text(Global.Constant.EMPTY_STR);
  $cloned.find('.milestone_status').removeAttr('data-code').text(Global.Constant.EMPTY_STR);
  $cloned.find('.milestone_owner').removeAttr('data-code').text(Global.Constant.EMPTY_STR);
  return $cloned; // jQuery node
}

// Returns a cloned but empty (no deliverable items) Deliverable <li class='deliverable' ...> (ready to be added to the table after filling in data)
MilestoneHtmlTemplate.Deliverable = function(){
  var $ms_deliverable_li = $('#milestone_html_template .milestone-deliverables .deliverable');
  var $cloned = $ms_deliverable_li.clone(true);
  $cloned.attr('id', guid());
  // Reset
  $cloned.find('.collapsable-section li').remove();
  
  CollapsibleView.allIconsAsInactive($cloned);
  
  $cloned.find('.ms_status').first().removeAttr('data-code').text(Global.Constant.EMPTY_STR);
  $cloned.find('.ms_keyword').first().removeAttr('data-code').text(Global.Constant.EMPTY_STR);
  $cloned.find('.ms_desc').first().removeAttr('data-code').text(Global.Constant.EMPTY_STR);
  return $cloned; // jQuery node
}

// Returns a cloned but empty data Deliverable item desc <li class='item_desc' ...> (ready to be added to the table after filling in data)
MilestoneHtmlTemplate.DeliverableItemDesc = function(){
  var $ms_deliverableItemDesc_li = $('#milestone_html_template .deliverable-items .item_desc');
  var $cloned = $ms_deliverableItemDesc_li.clone(true);
  $cloned.attr('id', guid());
  // Reset
  $cloned.find('.ms_status').first().removeAttr('data-code').text(Global.Constant.EMPTY_STR);
  $cloned.find('.ms_keyword').first().removeAttr('data-code').text(Global.Constant.EMPTY_STR);
  $cloned.find('.ms_desc').first().removeAttr('data-code').text(Global.Constant.EMPTY_STR);
  return $cloned; // jQuery node
}

// Returns a cloned but empty (no note items) Note <div class='milestone_note' ...> (ready to be added to the table after filling in data)
MilestoneHtmlTemplate.Note = function(){
  var $ms_note_div = $('#milestone_html_template .milestone_note');
  var $cloned = $ms_note_div.clone(true);
  // Reset
  $cloned.attr('id', guid());
  $cloned.find('.ms_note_items li').remove();
  $cloned.find('.ms_note_title').text(Global.Constant.EMPTY_STR);
  
  CollapsibleView.allIconsAsInactive($cloned);
  
  return $cloned; // jQuery node
}

// Returns a cloned but empty Note item desc <li class='item_desc' ...> (ready to be added to the table after filling in data)
MilestoneHtmlTemplate.NoteItemDesc = function(){
  var $ms_note_item_desc_li = $('#milestone_html_template .ms_note_items .item_desc');
  var $cloned = $ms_note_item_desc_li.clone(true);
  // Reset
  $cloned.attr('id', guid());
  $cloned.find('.ms_status').first().removeAttr('data-code').text(Global.Constant.EMPTY_STR);
  $cloned.find('.ms_keyword').first().removeAttr('data-code').text(Global.Constant.EMPTY_STR);
  $cloned.find('.ms_desc').first().removeAttr('data-code').text(Global.Constant.EMPTY_STR);
  return $cloned; // jQuery node
}

MilestoneHtmlTemplate.KeywordDescDecorator = function($ele){
  // Only works if
  // $ele = <something>
  //          <however many of these levels>
  //            <span class='ms_keyword'>MY-KEY</span>  <-- mandatory class
  //            <span class='ms_desc'>MY-DESC</span>    <-- mandatory class
  //          </however many of these levels>
  //        </something>
  // $ele becomes
  //        <something>
  //          <however many of these levels>
  //            <span class='ms_keyword'>MY-KEY</span>
  //            <span> - </span>
  //            <span class='ms_desc'>MY-DESC</span>
  //          </however many of these levels>
  //        </something>
  var $keyword = $ele.find('.ms_keyword');
  if ($keyword){
    var $desc = $ele.siblings('.ms_desc');
    if ($desc){
      $keyword.after('<span> - </span>');
    }
  }
}

// ***********************************************************
// Milestone elements helper
// ***********************************************************
function MilestoneHtml_helper() {}

/*
 * Returns the complete XML (that should produce the same html page you see without any modifications whatsoever)
 * Copy and paste this XML onto a file (in same folder as the xsl, etc), 
 * then open with Browser (IE only or upload to a site for other browsers) should display the page.
 */
MilestoneHtml_helper.buildMilestoneXml = function(booleanHolder){
  // build json representation of all milestones (including header and footer)
  var json = MilestonesToJson.buildAll();
  var formattedXml = json2FormattedXml(json);
  booleanHolder.isValid = validateXml(formattedXml);
  // The complete xml
  var completeXML = 
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' + '\r\n' +
    '<?xml-stylesheet type="text/xsl" href="milestones.xsl"?>'+ '\r\n' +
    formattedXml;
  return completeXML;
}

// ***********************************************************
