/*
 * *******************************************************
 * The JSON object created must be usable by json2xml.js
 * See xmljson/xmljson_test.htm
 *
 * This is for the purpose of building milestone_xyz.xml from the HTML
 * *******************************************************
 */
function MilestonesToJson() {}

// Build the JSON object from the HTML
MilestonesToJson.buildAll = function(){
  //return MilestonesToJson.Example();
  return MilestonesToJson.buildRoot();
}

MilestonesToJson.buildRoot = function(){
  var signature = MilestonesToJson.buildSignature();
  var cssArray = MilestonesToJson.buildCssArray();
  var header = MilestonesToJson.buildHeader();
  var footer = MilestonesToJson.buildFooter();
  var milestonesSectionHead = $('#milestones_section_head').text();
  var milestoneArray = MilestonesToJson.buildMilestoneArray();
  return MilestonesToJson.Root(signature, cssArray, header, footer, milestonesSectionHead, milestoneArray);
}

// Must match <signature id="simple.milestones.template101@justforfun.com.au" major-version="1.0" ...
// XML load will check this.
MilestonesToJson.Signature = {
  ID: "simple.milestones.template101@justforfun.com.au",
  MAJOR_VERSION: "1.0"
}

MilestonesToJson.buildSignature = function(){
  return {
    "@id":MilestonesToJson.Signature.ID,
    "@major-version":MilestonesToJson.Signature.MAJOR_VERSION,
    "@minor-version":"0.0"
  };
}

// ----------------------------------------------------
MilestonesToJson.Css = function(selector, value){
  return {
    "@selector":selector,
    "@value":value
  };
}

MilestonesToJson.buildCssArray = function(){
  var cssArray = [];
  $('#ms_theme div[name=css]').each(function(idx){
    $div = $(this);
    var selector = $div.attr('selector');
    var cssValue = $div.attr('cssValue');
    cssArray.push(MilestonesToJson.Css(selector, cssValue));
  });
  return cssArray;
}
  
// ----------------------------------------------------

MilestonesToJson.buildHeader = function(){
  var headerTitle = $('#header_title').text();
  var headerHtml = $('#header_content header').html();
  return {
    "@title":headerTitle,
    "#text":ensureGoodHtml(headerHtml)
  };
}

MilestonesToJson.buildFooter = function(){
  var footerHtml = $('#footer_content footer').html();
  return {
    "#text":ensureGoodHtml(footerHtml)
  };
}

MilestonesToJson.buildMilestoneArray = function(){
  //return MilestonesToJson.Example();
  var milestoneArray = [];
  $('.milestone_tr').each(function(idx){
    var $ms_tr = $(this);
    var hide = $ms_tr.attr('hide');
    var deadline = $ms_tr.find('.milestone_deadline').filter(":first").text();
    var category = $ms_tr.find('.milestone_category').filter(":first").text();
    var status = $ms_tr.find('.milestone_status').filter(":first").text();
    var owner = $ms_tr.find('.milestone_owner').filter(":first").text();
    var title = $ms_tr.find('.milestone_title').filter(":first").text();
    var deliverableArray = MilestonesToJson.buildDeliverableArray($ms_tr);
    var noteArray = MilestonesToJson.buildNoteArray($ms_tr);
    var milestone = MilestonesToJson.Milestone(hide, deadline, category, status, owner, title, deliverableArray, noteArray);
    milestoneArray.push(milestone);
  });
  return milestoneArray;
}

MilestonesToJson.buildNoteArray = function($ms_tr){
  var noteArray = [];
  $ms_tr.find('.milestone_note').each(function(idx){
    var $note = $(this);
    var title = $note.find('.ms_note_title').text();
    var itemDescArray = MilestonesToJson.buildItemDescArray($note);
    var note = MilestonesToJson.Note(title, itemDescArray);
    noteArray.push(note);
  });
  return noteArray;
}

MilestonesToJson.buildDeliverableArray = function($ms_tr){
  var deliverableArray = [];
  $ms_tr.find('.deliverable').each(function(idx){
    var $deliverable = $(this);
    var status = $deliverable.find('.ms_status').filter(":first").text(); // filter(":first") <-- best performance
    var keyword = $deliverable.find('.ms_keyword').filter(":first").text();
    var desc = $deliverable.find('.ms_desc').filter(":first").text();
    var itemDescArray = MilestonesToJson.buildItemDescArray($deliverable);
    var deliverable = MilestonesToJson.Deliverable(status, keyword, desc, itemDescArray);
    deliverableArray.push(deliverable);
  });
  return deliverableArray;
}

MilestonesToJson.buildItemDescArray = function($ele){
  var itemDescArray = [];
  $ele.find('.item_desc').each(function(idx){
    var $itemDesc = $(this);
    var status = $itemDesc.find('.ms_status').filter(":first").text();
    var keyword = $itemDesc.find('.ms_keyword').filter(":first").text();
    var desc = $itemDesc.find('.ms_desc').filter(":first").text();
    var statusKeywordDesc = MilestonesToJson.StatusKeywordDesc(status, keyword, desc);
    itemDescArray.push(statusKeywordDesc);
  });
  return itemDescArray;
}

// *************************************************************
MilestonesToJson.Root = function(signature, cssArray, header, footer, milestonesSectionHead, milestoneArray){
  return {
    "root":{
      "signature":signature,
      "theme":{
          "css":cssArray
      },
      "header":header,
      "footer":footer,
      "milestones":{
          "@section_head":milestonesSectionHead,
          "milestone":milestoneArray
      }
    }
  }
}

MilestonesToJson.Milestones = function(milestoneArray){
  return {
    "milestones":[
      {
        "milestone":milestoneArray
      }
    ]
  }
}

/*
 * deadline e.g. '12/03/2019'
 */
MilestonesToJson.Milestone = function(hide, deadline, category, status, owner, title, deliverableArray, noteArray){
  if (hide){
    return {
      "@hide":hide,
      "@deadline":deadline,
      "@category":category,
      "@status":status,
      "@owner":owner,
      "@title":title,
      "deliverable":deliverableArray,
      "note":noteArray
    }
  } else {
    return {
      "@deadline":deadline,
      "@category":category,
      "@status":status,
      "@owner":owner,
      "@title":title,
      "deliverable":deliverableArray,
      "note":noteArray
    }
  }
}

/*
 * itemDescArray e.g.
  [
    {
      "@status":"started1",
      "@keyword":"notekey1",
      "@desc":"notekey1 description"
    },
    repeat above
  ]
 */
MilestonesToJson.Deliverable = function(status, keyword, desc, itemDescArray){
  return {
    "@status":status,
    "@keyword":keyword,
    "@desc":desc,
    "item_desc":itemDescArray
  }
}

MilestonesToJson.StatusKeywordDesc = function(status, keyword, desc){
  return {
    "@status":status,
    "@keyword":keyword,
    "@desc":desc
  }
}

/*
 * itemDescArray e.g.
  [
    {
      "@status":"started1",
      "@keyword":"notekey1",
      "@desc":"notekey1 description"
    },
    repeat above
  ]
 */
MilestonesToJson.Note = function(title, itemDescArray){
  if (itemDescArray){
    return {
      "@title":title,
      "item_desc":itemDescArray
    }
  } else {
    return {
      "@title":title
    }
  }
}

// *************************************************************
/*
 * As Reference Example (works)
 */
MilestonesToJson.Example = function(){
  var json =
  {
    "milestones":[
      { // milestone 01
        "milestone":{
          "@hidden":"true",
          "@deadline":"12/03/2019",
          "@category":"align",
          "@status":"done",
          "@owner":"all",
          "@title":"a title",
          "deliverable":[
            { // deliverable 01
              "@status":"tbd01",
              "@keyword":"deliver01",
              "@desc":"deliver01 description",
              "item_desc":[
                { // deliverable 01 item_desc 01
                  "@status":"qmark1",
                  "@keyword":"idec",
                  "@desc":"idec description"
                },
                { // deliverable 01 item_desc 02
                  "@status":"qmark1",
                  "@keyword":"idec2",
                  "@desc":"idec2 description"
                }
              ]
            },
            { // deliverable 02
              "@status":"tbd02",
              "@keyword":"deliver02",
              "@desc":"deliver02 description",
              "item_desc":[
                { // deliverable 02 item_desc 01
                  "@status":"qmark1",
                  "@keyword":"idec",
                  "@desc":"idec description"
                },
                { // deliverable 02 item_desc 02
                  "@status":"qmark1",
                  "@keyword":"idec2",
                  "@desc":"idec2 description"
                }
              ]
            }
          ],
          "note":[
            { // note 01
              "@title":"note title1",
              "item_desc":[
                {
                  "@status":"started1",
                  "@keyword":"notekey1",
                  "@desc":"notekey1 description"
                },
                {
                  "@status":"started2",
                  "@keyword":"notekey2",
                  "@desc":"notekey2 description"
                }
              ]
            },
            { // note 02
              "@title":"note title2",
              "item_desc":{
                "@status":"started2",
                "@keyword":"notekey2",
                "@desc":"notekey2 description"
              }
            }
          ]
        }
      }
    ]
  }
  return json;
}
