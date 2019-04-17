<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="2.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
    xpath-default-namespace="http://www.w3.org/1999/xhtml">

  <xsl:output method="html" encoding="utf-8" indent="yes" />

  <xsl:template match="/">
    <xsl:text disable-output-escaping='yes'>&lt;!DOCTYPE html&gt;</xsl:text>
    <html lang="en">

      <head>
        <title>Replace Me</title>
        <meta charset="utf-8"></meta>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"></meta>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.0/normalize.min.css"></link>
        
        <!-- 
          https://www.w3schools.com/w3css/w3css_color_themes.asp        
          https://www.thesitewizard.com/javascripts/change-style-sheets.shtml
          https://www.w3schools.com/icons/fontawesome_icons_intro.asp
          https://fontawesome.com/v4.7.0/cheatsheet/
          https://swisnl.github.io/jQuery-contextMenu/demo.html
          https://getbootstrap.com/docs/4.3/getting-started/introduction/
          https://getbootstrap.com/2.3.2/components.html
          https://www.javascripting.com/view/bootstrap-contextmenu
          https://bootsnipp.com/tags/modal?page=1
          https://bootsnipp.com/tags/forms?page=1
          
          https://m.datatables.net/forums/discussion/40650/data-tables-right-click-filter-clear-filter-context-menu-with-bootstrap
          http://live.datatables.net/caderego/100/embed
          https://www.jqueryscript.net/demo/Simple-jQuery-Modal-Dialog-Box-Plugin-Dialog/
        -->
        
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css"></link>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.6/umd/popper.min.js"></script>        
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.2.1/js/bootstrap.min.js"></script>
        <script src="https://www.promisejs.org/polyfills/promise-7.0.4.min.js"></script><!-- to get away from some browsers not supporting Promise -->
        <script src="https://www.promisejs.org/polyfills/promise-done-7.0.4.min.js"></script><!-- to get away from some browsers not supporting Promise.done -->
        <script src="common/date-en-AU.js"></script><!-- https://github.com/datejs/Datejs -->
        <script src="common/bootstrap-contextmenu.js"></script><!-- https://www.jqueryscript.net/menu/Bootstrap-Styled-Context-Menu-Plugin-With-jQuery.html -->
        <script src="xmljson/xml2json.js"></script>
        <script src="xmljson/json2xml.js"></script>
        <!-- https://markjs.io/ -->
        <script src="mark/jquery.mark.min.js"></script>
        <script src="mark/jquery.mark.es6.min.js"></script>

        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.6.4/css/bootstrap-datepicker.standalone.min.css"></link>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.6.4/js/bootstrap-datepicker.min.js"></script>

        <link rel="stylesheet" href="milestone.css?v4"></link>
        <script src="common/common.js"></script>
        <script src="common/common-file.js"></script>
        <script src="common/common-collapsibleview.js"></script>
        <script src="common/datehelper.js"></script><!-- requires date-en-AU.js -->
        <script src="milestoneEdit.js"></script>
        <script src="milestoneDnD.js"></script>
        <script src="milestoneToJson.js"></script>
        <script src="milestone.js?"></script>

        <!-- JAVASCRIPT -->
        <script type="text/javascript">
          $( document ).ready(function() {
            init_all();
          });
        </script>
      </head>

      <body>
        <xsl:apply-templates/>
        <xsl:call-template name="init_context_menus" />
      </body>

    </html>
  </xsl:template>

  <!-- ********************* -->
  <!-- XSL TEMPLATE MATCHING -->
  <!-- ********************* -->

  <!-- Main entry point -->
  <xsl:template match="root">
    <xsl:apply-templates select="theme" />
    <xsl:apply-templates select="header" />
    <xsl:apply-templates select="milestones" />
    <xsl:apply-templates select="footer" />
  </xsl:template>

  <!-- Process ***************************
    <signature id="cabc-revitalisation-milestones" major-version="1.0" minor-version="0.0"/>
    Note that minor-version is not part of the signature
  -->
  <xsl:template match="signature">
    <div id="signature">
      <span style="font-style:italic">ID: <xsl:value-of select="@id"/>&#160;&#160;&#160;Major Version:<xsl:value-of select="@major-version"/>&#160;&#160;&#160;Minor Version:<xsl:value-of select="@minor-version"/></span>
    </div>
  </xsl:template>

  <!-- Process ***************************
    <theme>
  -->
  <xsl:template match="theme">
    <div id='ms_theme'>
      <xsl:apply-templates select="css" />
    </div>
  </xsl:template>

  <!-- Process ***************************
    <css>
  -->
  <xsl:template match="css">
    <div>
      <xsl:attribute name="name">css</xsl:attribute>
      <xsl:attribute name="selector"><xsl:value-of select="@selector"/></xsl:attribute>
      <xsl:attribute name="cssValue"><xsl:value-of select="@value"/></xsl:attribute>
      <xsl:attribute name="style">display:none</xsl:attribute>
    </div>
  </xsl:template>
  
  <!-- Process **********************************************
    <header title=""> ... </header>
  -->
  <xsl:template match="header">
    <!-- Save title (as hidden) -->
    <input id="page-title" type="hidden">
      <xsl:attribute name="value"><xsl:value-of select="@title"/></xsl:attribute>
    </input>
    <!-- Display title on page -->
    <h3><span id="header_title"><xsl:value-of select="@title"/></span><span>&#160;&#160;(as of <script> document.write(Date.today().toString('d-MMM-yyyy'));</script>)</span></h3>
    <!-- Display header text content (renders any html syntax) -->
    <div id="header_content">
      <xsl:copy-of select="." disable-output-escaping="yes"/>
    </div>
  </xsl:template>
  
  <!-- Process ***************************
    <footer> ... </footer>
  -->
  <xsl:template match="footer">
    <br/><hr/>
    <!-- Display footer text content (renders any html syntax) -->
    <div id="footer_content">
      <xsl:copy-of select="." disable-output-escaping="yes"/>
    </div>
    <xsl:apply-templates select="../signature" />
  </xsl:template>

  <!-- Process ***************************
    <milestones section_head="Milestones">
      ...
    </milestones>
  -->
  <xsl:template match="milestones">
    <hr/>
    <h3>
      <span id="milestones_section_head"><xsl:value-of select="@section_head"/></span>
    </h3>
    <div class="table-responsive">
      <table id="milestone_table">
        <thead class="thead-btn">
          <th colspan="7">
            <span class='no-milestones'>
              <button id="create-milestone-btn" class="btn btn-primary btn-sm"><i class="fa fa-keyboard-o" aria-hidden="true"/>&#160;&#160;<span>Create milestone</span></button>
              <span>&#160;&#160;</span>
            </span>
            <span class='has-milestones'>
              <span>
                <button id="page-reload-btn" class="btn btn-dark btn-sm"><i class="fa fa-refresh" aria-hidden="true"/>&#160;&#160;<span title='Reload this page from the server'>Reload from server</span></button>
                <span>&#160;&#160;</span>
                <button id="collapse-expand-all-btn" class="btn btn-primary btn-sm"><i class="fa fa-plus" aria-hidden="true"/>&#160;&#160;<span>Expand</span></button>
                <span>&#160;&#160;</span>
                <input id="milestone-search-input" type="text" class="form-control-sm col-2" placeholder="Search" />
                <button id="milestone-search-btn" class="btn btn-secondary btn-sm" type="button"><i class="fa fa-search"></i></button>
                <button id="milestone-unhighlight-btn" class="btn btn-light btn-sm" type="button" title="unhighlight"><i class="fa fa-eraser"></i></button>
              </span>
              <span class='float-right'>
                <button id="milestone-loadPageFromXmlFile-btn" class="btn btn-success btn-sm"><i class="fa fa-folder-open" aria-hidden="true"/>&#160;&#160;<span>Load from file</span></button>
                <span>&#160;&#160;</span>
                <button id="milestone-xml-to-clipboard-btn" class="btn btn-success btn-sm"><i class="fa fa-clipboard" aria-hidden="true"/>&#160;&#160;<span>Copy to clipboard</span></button>
              </span>
            </span>
          </th>
        </thead>
        <thead class="thead-realone">
          <th></th><!-- Column auto-numbering -->
          <th id="milestone_deadline_th" class='ms_hide_col'>Deadline&#160;&#160;</th>
          <th id="milestone_daysLeft_th" class='ms_hide_col'>Days left&#160;&#160;</th>
          <th id="milestone_category_th" class='ms_hide_col'>Category<br/><select id="milestone_categories_dropdown"/></th>
          <th id="milestone_status_th" class='ms_hide_col'>Status<br/><select id="milestone_status_dropdown"/></th>
          <th id="milestone_owner_th" >Owner<br/><select id="milestone_owners_dropdown"/></th>
          <th id="milestone_milestone_th" >Milestone<br/><button id="milestone-wider-btn" class="btn btn-info btn-xs"><i class="fa fa-long-arrow-left fa-lg" aria-hidden="true"/>&#160;<span> Wider View </span></button></th>
        </thead>
        <tbody id="milestone_tbody">
          <xsl:apply-templates select="milestone" />
        </tbody>
      </table>
    </div>
  </xsl:template>

  <!-- Process ****************************************************
    <milestone deadline="" category="" status="" owner="" title="">
      <deliverable status="" keyword="" desc="" >
        <item_desc status="" keyword="" desc=""/>
      </deliverable>
      <note title="">
        <item_desc status="" keyword="" desc=""/>
      </note>
    </milestone>
  -->
  <xsl:template match="milestone">
    <tr class="milestone_tr" id="{generate-id()}">
      <!-- BELOW: See first element in xyz_milestones.xml (i.e. the xml that you browse)
                  Make this a hidden full fetched html milestone row and all its sub-elements 
                  as template to future user milestone record creations. User will not see this.
      -->
      <xsl:if test="@hide='true'">
        <xsl:attribute name="hide">true</xsl:attribute>
        <xsl:attribute name="style">display:none</xsl:attribute>
        <xsl:attribute name="id">milestone_html_template</xsl:attribute><!-- override the generated id -->
      </xsl:if>
      <!-- ABOVE: See first element in xyz_milestones.xml (i.e. the xml that you browse)
                  Make this a hidden full fetched html milestone row and all its sub-elements 
                  as template to future user milestone record creations. User will not see this.
      -->
      <!-- Column: auto numbering -->
      <td class='ms_idx_td drag' draggable="true"
        ondragstart="MilestoneDnD.ondragstart(event, '.milestone_tr');"
        ondragover ="MilestoneDnD.ondragover(event);"
        ondragenter="MilestoneDnD.ondragenter(event);"
        ondrop     ="MilestoneDnD.ondrop(event, '.milestone_tr');"
        ondropleave="MilestoneDnD.ondropleave(event);"
        ondragend  ="MilestoneDnD.ondragend(event, '.milestone_tr');">
        <!-- leave this as blank. Auto numbering done in css (look for rowNumber) -->
      </td>
      <!-- Column: Date to complete -->
      <td class='ms_deadline_td ms_hide_col'>
        <span class="milestone_deadline">
          <xsl:attribute name="data-code"><xsl:value-of select="@deadline"/></xsl:attribute>
          <xsl:value-of select="@deadline"/>
        </span>
      </td>
      <!-- Column: Days left -->
      <td class='ms_daysleft_td ms_hide_col'>
        <span class="milestone_daysleft"></span>
      </td>
      <!-- Column: Category -->
      <td class='ms_category_td ms_hide_col'>
        <span class="milestone_category" contenteditable="false">
          <xsl:attribute name="data-code"><xsl:value-of select="@category"/></xsl:attribute>
          <xsl:value-of select="@category"/>
        </span>
      </td>
      <!-- Column: Status -->
      <td class='ms_status_td ms_hide_col'>
        <span class="milestone_status" contenteditable="false">
          <xsl:attribute name="data-code"><xsl:value-of select="@status"/></xsl:attribute>
          <xsl:value-of select="@status"/>
        </span>&#160;
      </td>
      <!-- Column: Owner -->
      <td class='ms_owner_td'>
        <span class="milestone_owner" contenteditable="false">
          <xsl:attribute name="data-code"><xsl:value-of select="@owner"/></xsl:attribute>
          <xsl:value-of select="@owner"/>
        </span>
      </td>
      <!-- Column: Milestone -->
      <td class='milestone_td'>
      
        <xsl:choose>
          <xsl:when test="(deliverable) or (note)">
            <i class='collapsible-ctrl fa fa-minus-square-o' aria-hidden='true'>&#160;&#160;</i>
          </xsl:when>
          <xsl:otherwise>
            <i class='collapsible-ctrl fa fa-square-o' aria-hidden='true'>&#160;&#160;</i>
          </xsl:otherwise>
        </xsl:choose>

        <span class="milestone_title" contenteditable="true" style="font-weight:600;"><xsl:value-of select="@title"/></span>
        <div class='milestone_elements collapsable-section'>
          <!-- Deliverables -->
          <ol class="milestone-deliverables" type="1">
            <xsl:apply-templates select="deliverable" />
          </ol>
          <!-- Notes -->
          <div class="milestone_notes">
            <xsl:apply-templates select="note" />
          </div>
        </div>
      </td>
    </tr>
  </xsl:template>

  <!-- Process ********************************
    <note title="">
      <item_desc status="" keyword="" desc=""/>
    </note>
  -->
  <xsl:template match="note">
    <div class='milestone_note collapsible-item' id="{generate-id()}">
      <hr style='margin:0; padding:0;'/>
      
      <xsl:choose>
        <xsl:when test="./item_desc">
          <i class='collapsible-ctrl fa fa-minus-square-o' aria-hidden='true'>&#160;&#160;</i>
        </xsl:when>
        <xsl:otherwise>
          <i class='collapsible-ctrl fa fa-square-o' aria-hidden='true'>&#160;&#160;</i>
        </xsl:otherwise>
      </xsl:choose>
      
      <i class="drag fa fa-arrows-v" draggable="true"
        ondragstart="MilestoneDnD.ondragstart(event, '.milestone_note');"
        ondragover ="MilestoneDnD.ondragover(event);"
        ondragenter="MilestoneDnD.ondragenter(event);"
        ondrop     ="MilestoneDnD.ondrop(event, '.milestone_note');"
        ondropleave="MilestoneDnD.ondropleave(event);"
        ondragend  ="MilestoneDnD.ondragend(event, '.milestone_note');" />
      <span class="ms_note_about" style="padding-left:10px; font-size:0.85em; font-weight:bold;">Notes: <span class="ms_note_title" contenteditable="true"><xsl:value-of select="@title"/></span></span>
      <ol class='ms_note_items collapsable-section' type='i'>
        <xsl:apply-templates select="./item_desc" />
      </ol>
    </div>
  </xsl:template>

  <!-- Process ********************************
    <deliverable status="" keyword="" desc="" >
      <item_desc status="" keyword="" desc=""/>
    </deliverable>
  -->
  <xsl:template match="deliverable">
    <!-- li: Deliverable -->
    <li class='deliverable collapsible-item' id="{generate-id()}">
    
      <xsl:choose>
        <xsl:when test="item_desc">
          <i class='collapsible-ctrl fa fa-minus-square-o' aria-hidden="true">&#160;&#160;</i>
        </xsl:when>
        <xsl:otherwise>
          <i class='collapsible-ctrl fa fa-square-o' aria-hidden="true">&#160;&#160;</i>
        </xsl:otherwise>
      </xsl:choose>
      <!-- Render deliverable attributes -->
      <xsl:call-template name="render_status_item_desc">
        <xsl:with-param name="status" select="@status" />
        <xsl:with-param name="keyword" select="@keyword" />
        <xsl:with-param name="desc" select="@desc" />
        <xsl:with-param name="dnd_targetEleClass" select="'.deliverable'" />
        <xsl:with-param name="wrapperClass" select="'deliverable_attr'" />
      </xsl:call-template>
      <!-- Render deliverable item_desc list -->
      <ol class="deliverable-items collapsable-section" type="a" style="padding-left:25">
        <xsl:apply-templates select="item_desc" />
      </ol>
      
    </li>
  </xsl:template>

  <!-- Process ******************************
    <item_desc status="" keyword="" desc=""/>
  -->
  <xsl:template match="item_desc">
    <li class="item_desc collapsible-item" id="{generate-id()}">
      <xsl:call-template name="render_status_item_desc">
        <xsl:with-param name="status" select="@status" />
        <xsl:with-param name="keyword" select="@keyword" />
        <xsl:with-param name="desc" select="@desc" />
        <xsl:with-param name="dnd_targetEleClass" select="'.item_desc'" />
        <xsl:with-param name="wrapperClass" select="'NA'" />
      </xsl:call-template>
    </li>
  </xsl:template>
  
  <!-- ****************************************************************** -->
  <!-- TEMPLATE FUNCTIONS -->
  <!-- ****************************************************************** -->

  <!-- **********************
    Template to render 'status', 'keyword' and 'desc'
    ************************* -->
  <xsl:template name="render_status_item_desc">
    <xsl:param name="status" />
    <xsl:param name="keyword" />
    <xsl:param name="desc" />
    <xsl:param name="dnd_targetEleClass" /> <!-- points to the ultimate element to be dragged -->
    <xsl:param name="wrapperClass" />       <!-- wraps 'status', 'keyword' and 'desc' -->
    <!-- drag and drop -->
    <i class="drag fa fa-arrows-v" draggable="true"
      ondragover ="MilestoneDnD.ondragover(event);"
      ondragenter="MilestoneDnD.ondragenter(event);"
      ondropleave="MilestoneDnD.ondropleave(event);">
      <xsl:attribute name="ondragstart">MilestoneDnD.ondragstart(event,'<xsl:value-of select="$dnd_targetEleClass"/>');</xsl:attribute>
      <xsl:attribute name="ondrop">MilestoneDnD.ondrop(event,'<xsl:value-of select="$dnd_targetEleClass"/>');</xsl:attribute>
      <xsl:attribute name="ondragend">MilestoneDnD.ondragend(event,'<xsl:value-of select="$dnd_targetEleClass"/>');</xsl:attribute>
    </i>
    <span>
      <xsl:attribute name="class"><xsl:value-of select="$wrapperClass"/></xsl:attribute>
      <xsl:if test="string($status)">
        &#160;
      </xsl:if>
      <!-- status -->
      <span class="ms_status" contenteditable="false">
        <xsl:attribute name="data-code"><xsl:value-of select="$status"/></xsl:attribute>
        <xsl:value-of select="$status"/>
      </span>&#160;
      <!-- keyword and desc -->
      <xsl:call-template name="render_keyword_desc">
        <xsl:with-param name="keyword" select="$keyword" />
        <xsl:with-param name="desc" select="$desc" />
      </xsl:call-template>
    </span>
  </xsl:template>

  <!-- **********************
    Template to render 'status'
    (WORKS but not used for now. Using js to produce the same effect)
    ************************* -->
  <xsl:template name="render_status">
    <xsl:param name="status" />
    <xsl:param name="isToEncloseWithBracket" /><!-- yes | no -->
    <xsl:choose>
      <xsl:when test="($status = 'done')">
        <i class="fa fa-check" aria-hidden="true">&#160;</i><span class="ms_display_status"><xsl:value-of select="$status"/>&#160;</span>
      </xsl:when>
      <xsl:when test="($status = 'star')">
        <i class="fa fa-star" aria-hidden="true">&#160;</i>
      </xsl:when>
      <xsl:when test="($status = 'look')">
        <i class="fa fa-hand-o-right" aria-hidden="true">&#160;</i>
      </xsl:when>
      <xsl:when test="($status = 'qmark')">
        <i class="fa fa-question" aria-hidden="true">&#160;</i>
      </xsl:when>
      <xsl:when test="($status = 'warn')">
        <i class="fa fa-warning" aria-hidden="true">&#160;</i>
      </xsl:when>
      <xsl:when test="($status = 'alarm')">
        <i class="fa fa-ambulance" aria-hidden="true">&#160;</i>
      </xsl:when>
      <xsl:otherwise>
        <xsl:if test="(string($status))">
          <xsl:choose>
            <xsl:when test="($isToEncloseWithBracket = 'yes')">
              <span class="ms_display_status">[<xsl:value-of select="$status"/>]&#160;</span>
            </xsl:when>
            <xsl:otherwise>
              <span class="ms_display_status"><xsl:value-of select="$status"/>&#160;</span>
            </xsl:otherwise>
          </xsl:choose>
        </xsl:if>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  
  <!-- **********************
    Template to render 'keyword' and 'desc' pair
    ************************* -->
  <xsl:template name="render_keyword_desc">
    <xsl:param name="keyword" />
    <xsl:param name="desc" />
    <span class="ms_keyword" contenteditable="true">
      <!-- <xsl:attribute name="data-code"><xsl:value-of select="$keyword"/></xsl:attribute> -->
      <xsl:value-of select="$keyword"/>
    </span>
    <xsl:if test="string($keyword) and string($desc)">
      <span> - </span>
    </xsl:if>
    <xsl:if test="$desc">
      <!-- allows <html> tags in @desc (you will need to use &ltl and &gt; )-->
      <span class="ms_desc" contenteditable="true">
        <!-- <xsl:attribute name="data-code"><xsl:value-of select="$desc"/></xsl:attribute> -->
        <xsl:value-of select="$desc" disable-output-escaping="yes"/>
      </span>
    </xsl:if>
  </xsl:template>

  <!-- **************************************************** -->
  <!-- Templates SUPPORTING htmls e.g. contextmenu, dialogs -->
  <!-- **************************************************** -->
  <xsl:template name="init_context_menus">

    <!-- https://www.w3schools.com/bootstrap/bootstrap_modal.asp -->
    <!-- https://www.tutorialrepublic.com/twitter-bootstrap-tutorial/bootstrap-modals.php#modal-options -->
    <!-- http://formoid.com/articles/bootstrap-modal-validation-515.html -->

    <!-- ++++++++++++++++++++++++++++++++++++++++++ -->
    <!-- General right click context menu           -->
    <!-- ++++++++++++++++++++++++++++++++++++++++++ -->
    <ul id="milestone_general_edit_contextmenu" class="dropdown-menu" role="menu" style="display:none" >
      <li class="dropdown-item"><a tabindex="-1" href="#" data-action="edit">Edit</a></li>
      <li class="dropdown-divider"></li>
      <li class="dropdown-item"><a tabindex="-1" href="#" data-action="insertAbove">Insert above</a></li>
      <li class="dropdown-item"><a tabindex="-1" href="#" data-action="insertBelow">Insert below</a></li>
      <li class="dropdown-divider"></li>
      <li class="dropdown-item"><a tabindex="-1" href="#" data-action="clone">Clone</a></li>
      <li class="dropdown-item"><a tabindex="-1" href="#" data-action="delete">Delete</a></li>
    </ul>          

    <!-- ++++++++++++++++++++++++++++++++++++++++++++++ -->
    <!-- Milestone Deliverable right click context menu -->
    <!-- ++++++++++++++++++++++++++++++++++++++++++++++ -->
    <ul id="milestone_deliverable_modal_contextmenu" class="dropdown-menu" role="menu" style="display:none" >
      <li class="dropdown-item"><a tabindex="-1" href="#" data-action="edit">Edit</a></li>
      <li class="dropdown-divider"></li>
      <li class="dropdown-item"><a tabindex="-1" href="#" data-action="insertAbove">Insert above</a></li>
      <li class="dropdown-item"><a tabindex="-1" href="#" data-action="insertBelow">Insert below</a></li>
      <li class="dropdown-divider"></li>
      <li class="dropdown-item"><a tabindex="-1" href="#" data-action="clone">Clone</a></li>
      <li class="dropdown-item"><a tabindex="-1" href="#" data-action="delete">Delete</a></li>
      <li class="dropdown-divider"></li>
      <li class="dropdown-item"><a tabindex="-1" href="#" data-action="addDeliverableItem">Add deliverable item</a></li>
    </ul>          

    <!-- ++++++++++++++++++++++++++++++++++++++++++ -->
    <!-- Milestone Note right click context menu    -->
    <!-- ++++++++++++++++++++++++++++++++++++++++++ -->
    <ul id="milestone_Note_modal_contextmenu" class="dropdown-menu" role="menu" style="display:none" >
      <li class="dropdown-item"><a tabindex="-1" href="#" data-action="edit">Edit</a></li>
      <li class="dropdown-divider"></li>
      <li class="dropdown-item"><a tabindex="-1" href="#" data-action="insertAbove">Insert above</a></li>
      <li class="dropdown-item"><a tabindex="-1" href="#" data-action="insertBelow">Insert below</a></li>
      <li class="dropdown-divider"></li>
      <li class="dropdown-item"><a tabindex="-1" href="#" data-action="clone">Clone</a></li>
      <li class="dropdown-item"><a tabindex="-1" href="#" data-action="delete">Delete</a></li>
      <li class="dropdown-divider"></li>
      <li class="dropdown-item"><a tabindex="-1" href="#" data-action="addNoteItem">Add note item</a></li>
    </ul>          

    <!-- +++++++++++++++++++++++++++ -->
    <!-- Milestone modal (Summary)   -->
    <!-- +++++++++++++++++++++++++++ -->
    <ul id="milestone_summary_modal_contextmenu" class="dropdown-menu" role="menu" style="display:none" >
      <li class="dropdown-item"><a tabindex="-1" href="#" data-action="edit">Edit</a></li>
      <li class="dropdown-divider"></li>
      <li class="dropdown-item"><a tabindex="-1" href="#" data-action="insertAbove">Insert above</a></li>
      <li class="dropdown-item"><a tabindex="-1" href="#" data-action="insertBelow">Insert below</a></li>
      <li class="dropdown-divider"></li>
      <li class="dropdown-item"><a tabindex="-1" href="#" data-action="clone">Clone</a></li>
      <li class="dropdown-item"><a tabindex="-1" href="#" data-action="delete">Delete</a></li>
      <li class="dropdown-divider"></li>
      <li class="dropdown-item"><a tabindex="-1" href="#" data-action="addDeliverable">Add deliverable</a></li>
      <li class="dropdown-item"><a tabindex="-1" href="#" data-action="addNote">Add note</a></li>
    </ul>          
    
    <div class="modal fade" id="milestoneSummaryModal" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <!-- header -->
          <div class="modal-header">
            <h3 class="modal-title">Milestone</h3>
            <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-close"></i></span><span class="sr-only">Close</span></button>
          </div>
          <!-- content goes here -->
          <div class="modal-body">
            <form id="milestoneSummaryModalForm">
              <div class="form-group row">
                <label for="input_ms_deadline" class="col-sm-2 col-form-label">Deadline</label>
                <div class="col-sm-10">
                  <input type="text" class="form-control datepicker" id="input_ms_deadline" placeholder="MM/DD/YYYY" pattern="^(0[1-9] 1[012])[- /.](0[1-9] [12][0-9]" required="true"/>
                </div>
              </div>
              <div class="form-group row">
                <label for="input_ms_category" class="col-sm-2 col-form-label">Category</label>
                <div class="col-sm-10">
                  <input type="text" list="ms_category_datalist" class="form-control" id="input_ms_category" placeholder="Milestone category" required="true"/>
                  <datalist id="ms_category_datalist" /><!-- list is populated by js -->
                </div>
              </div>
              <div class="form-group row">
                <label for="input_ms_status" class="col-sm-2 col-form-label">Status</label>
                <div class="col-sm-10">
                  <input type="text" list="ms_status_datalist" class="form-control" id="input_ms_status" placeholder="Milestone status" required="true"/>
                  <datalist id="ms_status_datalist" /><!-- list is populated by js -->
                  <p class="help-block">done | warn | alarm | star | look | qmark | whateverYouType</p>
                </div>
              </div>
              <div class="form-group row">
                <label for="input_ms_owner" class="col-sm-2 col-form-label">Owner</label>
                <div class="col-sm-10">
                  <input type="text" list="ms_owner_datalist" class="form-control" id="input_ms_owner" placeholder="Milestone owner" required="true"/>
                  <datalist id="ms_owner_datalist" /><!-- list is populated by js -->
                  <p class="help-block">The person or team responsible for the delivery of this milestone</p>
                </div>
              </div>
              <div class="form-group row">
                <label for="input_ms_title" class="col-sm-2 col-form-label">Title</label>
                <div class="col-sm-10">
                  <textarea class="form-control" rows="3" id="input_ms_title" placeholder="Milestone title" required="true"/>
                </div>
              </div>
              <!-- Cancel and Submit buttons -->
              <div class="form-group row">
                <div class="offset-2 col-9" role="group" aria-label="group button">
                  <button type="button" class="btn btn-default btn-secondary mr-2" data-dismiss="modal" role="button">Cancel</button>
                  <span>  </span>
                  <button type="submit" class="btnConfirm btn btn-default btn-info" role="button">Confirm</button>
                </div>
              </div>
            </form>
          </div>
          <!-- footer -->
          <div class="modal-footer">
          </div>
        </div>
      </div>
    </div>

    <!-- +++++++++++++++++++++++++++++++++++++++ -->
    <!-- Milestone modal (Status, Keyword, Desc) -->
    <!-- +++++++++++++++++++++++++++++++++++++++ -->
    <div class="modal fade" id="statusKeywordDescModal" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <!-- header -->
          <div class="modal-header">
            <h3 class="modal-title">TO-BE-FILLED</h3>
            <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-close"></i></span><span class="sr-only">Close</span></button>
          </div>
          <!-- content goes here -->
          <div class="modal-body">
            <form id="statusKeywordDescModalForm">
              <div class="form-group row no-gutters">
                <label for="input_ms_status2" class="col-sm-2 col-form-label">Status</label>
                <div class="col-sm-8">
                  <input type="text" list="ms_status_datalist2" class="form-control" id="input_ms_status2" placeholder="status" />
                  <datalist id="ms_status_datalist2" /><!-- list is populated by js -->
                  <p class="help-block">done | warn | alarm | star | look | qmark | whateverYouType</p>
                </div>
              </div>
              <div class="form-group row">
                <label for="input_ms_keyword" class="col-sm-2 col-form-label">Keyword</label>
                <div class="col-sm-10">
                  <input type="text" class="form-control" id="input_ms_keyword" placeholder="keyword" required="true"/>
                  <p class="help-block">Sum up in one word</p>
                </div>
              </div>
              <div class="form-group row">
                <label for="input_ms_desc" class="col-sm-2 col-form-label">Description</label>
                <div class="col-sm-10">
                  <textarea class="form-control" rows="3" id="input_ms_desc" placeholder="description" required="true"/>
                </div>
              </div>
              <!-- Cancel and Submit buttons -->
              <div class="form-group row">
                <div class="offset-2 col-9" role="group" aria-label="group button">
                  <button type="button" class="btn btn-default btn-secondary mr-2" data-dismiss="modal" role="button">Cancel</button>
                  <span>  </span>
                  <button type="submit" class="btnConfirm btn btn-default btn-info" role="button">Confirm</button>
                </div>
              </div>
            </form>
          </div>
          <!-- footer -->
          <div class="modal-footer">
          </div>
        </div>
      </div>
    </div>
    
    <!-- +++++++++++++++++++++++++++++++++++++++ -->
    <!-- Milestone modal (Note title)            -->
    <!-- +++++++++++++++++++++++++++++++++++++++ -->
    <div class="modal fade" id="milestoneNoteSummaryModal" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <!-- header -->
          <div class="modal-header">
            <h3 class="modal-title">Milestone Note</h3>
            <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-close"></i></span><span class="sr-only">Close</span></button>
          </div>
          <!-- content goes here -->
          <div class="modal-body">
            <form id="milestoneNoteSummaryModalForm">
              <div class="form-group row">
                <label for="input_ms_note_title" class="col-sm-2 col-form-label">Title</label>
                <div class="col-sm-10">
                  <input type="text" class="form-control" rows="3" id="input_ms_note_title" placeholder="note title" required="true"/>
                </div>
              </div>
              <!-- Cancel and Submit buttons -->
              <div class="form-group row">
                <div class="offset-2 col-9" role="group" aria-label="group button">
                  <button type="button" class="btn btn-default btn-secondary mr-2" data-dismiss="modal" role="button">Cancel</button>
                  <span>  </span>
                  <button type="submit" class="btnConfirm btn btn-default btn-info" role="button">Confirm</button>
                </div>
              </div>
            </form>
          </div>
          <!-- footer -->
          <div class="modal-footer">
          </div>
        </div>
      </div>
    </div>
    
    <!-- ++++++++++++++++++++++++ -->
    <!-- Load XML file            -->
    <!-- ++++++++++++++++++++++++ -->
    <div class="modal fade" id="milestoneLoadXmlModal" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <!-- header -->
          <div class="modal-header">
            <h3 class="modal-title">Load XML</h3>
            <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-close"></i></span><span class="sr-only">Close</span></button>
          </div>
          <!-- content goes here -->
          <div class="modal-body">
            <form id="milestoneLoadXmlModalForm">
              <div class="form-group row">
                <label for="input_ms_load_xml_title" class="col-sm-2 col-form-label">Open</label>
                <div class="col-sm-10">
                  <input type="file" class="form-control" rows="3" id="input_ms_load_xml_file" placeholder="file" required="true"/>
                </div>
              </div>
              <!-- Cancel and Submit buttons -->
              <div class="form-group row">
                <div class="offset-2 col-9" role="group" aria-label="group button">
                  <button type="button" class="btn btn-default btn-secondary mr-2" data-dismiss="modal" role="button">Cancel</button>
                  <span>  </span>
                  <button type="submit" class="btnConfirm btn btn-default btn-info" role="button">Confirm</button>
                </div>
              </div>
            </form>
          </div>
          <!-- footer -->
          <div class="modal-footer">
          </div>
        </div>
      </div>
    </div>

    <!-- ++++++++++++++++++++++++ -->
    <!-- Place next whatever here -->
    <!-- ++++++++++++++++++++++++ -->
    
  </xsl:template>

</xsl:stylesheet>
