/*
 * ************************************************
 * Common collapsible view ()expand/collapse)
 
1) 3 icons are used (fa-plus-square-o, fa-minus-square-o, fa-square-o)
2) Both class='collapsible-ctrl AND class='collapsable-section' (must be siblings)
3) A typical collapsible section
   =============================
  <i class='collapsible-ctrl fa fa-plus-square-o'>&#160;&#160;</i><span>Click to show or hide immediate below section</span>
  ... means can have more elements in between
  <ABC class='collapsable-section'>This section will show or hide
    <li class='collapsable-item'>A01</li>
    <li class='collapsable-item'>A02</li>
  </ABC>
4) Nested collapsible section
   ==========================
  <i class='collapsible-ctrl fa fa-plus-square-o'>&#160;&#160;</i><span>Click to show or hide immediate below section</span>
  ... means can have more elements in between
  <ABC class='collapsable-section'>This section will show or hide
    <li class='collapsable-item'>A01</li>
    <li class='collapsable-item'>A02</li>
    <li class='collapsable-item'>
      <i class='collapsible-ctrl fa fa-plus-square-o'>&#160;&#160;</i> --- Click to show or hide immediate below section
      ...
      <ol class="collapsable-section"> --- This section will show or hide
        <li class='collapsable-item'>B01</li>
        <li class='collapsable-item'>B02</li>
      </ol>
    </li>
  </ABC>
   

EXAMPLE (with nested collapsible sections
=========================================
<div id='myId'>
  <ul>
    <li>
      <i class='collapsible-ctrl fa fa-plus-square-o'>&#160;&#160;</i> --- Click to show or hide immediate below section
      ...
      <div class='collapsable-section'> --- This section will show or hide
        <ol>
          <li class='collapsable-item'>
            <i class='collapsible-ctrl fa fa-plus-square-o'>&#160;&#160;</i> --- Click to show or hide immediate below section
            ...
            <ol class="collapsable-section"> --- This section will show or hide
              <li class='collapsable-item'>B01</li>
              <li class='collapsable-item'>B02</li>
            </ol>
          </li>
          <li class='collapsable-item'>
            <i class='collapsible-ctrl fa fa-plus-square-o'>&#160;&#160;</i> --- Click to show or hide immediate below section
            ...
            <ol class="collapsable-section"> --- This section will show or hide
              <!-- empty items -->
            </ol>
          </li>
        </ol>
        <div>
          <div class='collapsible-item'>
            <i class='collapsible-ctrl fa fa-plus-square-o'>&#160;&#160;</i> --- Click to show or hide immediate below section
            ...
            <ol class='collapsable-section'> --- This section will show or hide
              <li class='collapsible-item'>C01</li>
              <li class='collapsible-item'>C02</li>
            </ol>
          </div>
        </div>
      </div>
    </li>
  </ul>
</div>

CollapsibleView.init('#myId');

 *
 * ************************************************
 */
function CollapsibleView(){}

// Icon enum like
CollapsibleView.Icon = {
  EXPAND:  'fa-plus-square-o',
  COLLAPSE:'fa-minus-square-o',
  INACTIVE:'fa-square-o'
}

CollapsibleView.init = function(){
  CollapsibleView.collapseAllMilestones();
  // setup all collapsible icons (onClick)
  CollapsibleView.initCollapsibleIcons('#milestone_tbody');
}

// init all collapsible icons (onClick)
CollapsibleView.initCollapsibleIcons = function(toplevel_id){
  
  $(toplevel_id).on('click', '.collapsible-ctrl', function(){
    var $iconEle = $(this);
    if ($iconEle.hasClass(CollapsibleView.Icon.EXPAND) || $iconEle.hasClass(CollapsibleView.Icon.COLLAPSE)){
      // toggle icon (+/-)
      $iconEle
        .toggleClass(CollapsibleView.Icon.EXPAND)
        .toggleClass(CollapsibleView.Icon.COLLAPSE);
      // toggle same levels only
      $iconEle.siblings('.collapsable-section').toggle();
    }
  });
}

CollapsibleView.collapseAllMilestones = function() {
  $('.milestone_td').find('.collapsible-ctrl').each(function(id, ele){
    var $iconEle = $(ele);
    if ($iconEle.hasClass(CollapsibleView.Icon.EXPAND) || $iconEle.hasClass(CollapsibleView.Icon.COLLAPSE)){
      $iconEle.removeClass('fa-plus-square-o');
      $iconEle.removeClass('fa-minus-square-o');
      $iconEle.addClass('fa-plus-square-o');
    }
  });
  $('.milestone_td').find('.collapsable-section').hide();
}

CollapsibleView.expandAllMilestones = function() {
  $('.milestone_td').find('.collapsible-ctrl').each(function(id, ele){
    var $iconEle = $(ele);
    if ($iconEle.hasClass(CollapsibleView.Icon.EXPAND) || $iconEle.hasClass(CollapsibleView.Icon.COLLAPSE)){
      $iconEle.removeClass('fa-plus-square-o');
      $iconEle.removeClass('fa-minus-square-o');
      $iconEle.addClass('fa-minus-square-o');
    }
  });
  $('.milestone_td').find('.collapsable-section').show();
}

CollapsibleView.collapseMilestone=function($ms_td){
  var $iconEle = $ms_td.find('.collapsible-ctrl:first');
  if ($iconEle.hasClass(CollapsibleView.Icon.EXPAND) || $iconEle.hasClass(CollapsibleView.Icon.COLLAPSE)){
    $iconEle.removeClass('fa-plus-square-o');
    $iconEle.removeClass('fa-minus-square-o');
    $iconEle.addClass('fa-plus-square-o');
  }
  $ms_td.find('.collapsable-section').hide();
}

CollapsibleView.expandMilestone=function($ms_td){
  var $iconEle = $ms_td.find('.collapsible-ctrl:first');
  if ($iconEle.hasClass(CollapsibleView.Icon.EXPAND) || $iconEle.hasClass(CollapsibleView.Icon.COLLAPSE)){
    $iconEle.removeClass('fa-plus-square-o');
    $iconEle.removeClass('fa-minus-square-o');
    $iconEle.addClass('fa-minus-square-o');
  }
  $ms_td.find('.collapsable-section').show();
}

// set all icons to INACTIVE
CollapsibleView.allIconsAsInactive = function($ele){
  $ele.find('.collapsible-ctrl').removeClass(CollapsibleView.Icon.EXPAND);
  $ele.find('.collapsible-ctrl').removeClass(CollapsibleView.Icon.COLLAPSE);
  $ele.find('.collapsible-ctrl').removeClass(CollapsibleView.Icon.INACTIVE);
  $ele.find('.collapsible-ctrl').addClass(CollapsibleView.Icon.INACTIVE);
}

CollapsibleView.getCollapsibleCtrlIcon = function($collapsibleItemEle){
  var $icon = $collapsibleItemEle.closest('.collapsable-section').prevAll('.collapsible-ctrl:first');
  return $icon;
}

CollapsibleView.refreshControlIcon = function($icon, isAdd){
  $icon.removeClass(CollapsibleView.Icon.EXPAND);
  $icon.removeClass(CollapsibleView.Icon.COLLAPSE);
  $icon.removeClass(CollapsibleView.Icon.INACTIVE);

  // Find out how many collapsible elements left
  var collapsibleItems = $icon.siblings('.collapsable-section').find('.collapsible-item');
  var len = collapsibleItems.length; // how many collapsibleItems elements left
  
  // Update icon accordingly
  if (isAdd){
    // this is an add operation
    if (len > 0){
      $icon.addClass(CollapsibleView.Icon.COLLAPSE);
      $icon.siblings('.collapsable-section, .collapsable-section ul, .collapsable-section ol').show();
    }else{
      $icon.addClass(CollapsibleView.Icon.EXPAND);
      $icon.siblings('.collapsable-section, .collapsable-section ul, .collapsable-section ol').hide();
    }
  } else {
    // this is a remove operation
    if (len == 0){
      $icon.addClass(CollapsibleView.Icon.INACTIVE);
    }else{
      $icon.addClass(CollapsibleView.Icon.COLLAPSE);
    }
  }
}

CollapsibleView.getIconEnum = function($ms_td){
  var $icon = $ms_td.find('.collapsible-ctrl:first');
  if ($icon.hasClass(CollapsibleView.Icon.EXPAND)){
    return CollapsibleView.Icon.EXPAND;
  } else if ($icon.hasClass(CollapsibleView.Icon.COLLAPSE)){
    return CollapsibleView.Icon.COLLAPSE;
  } else if ($icon.hasClass(CollapsibleView.Icon.INACTIVE)){
    return CollapsibleView.Icon.INACTIVE;
  }
  alert('CollapsibleView.getIconEnum cannot find recognisable icon');
  return null;
}

