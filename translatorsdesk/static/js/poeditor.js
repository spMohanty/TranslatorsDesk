$(document).ready(function(){
  if(window.PO_DATA){
    window.PO_DATA = JSON.parse(window.PO_DATA);
    console.log(window.PO_DATA);

    $(window.PO_DATA.data).each(function(idx, data){


    var CODEMIRROR_EDITOR_ID = idx+1;

    var codemirror_menu = '<nav id="codemirror_menu_'+CODEMIRROR_EDITOR_ID+'" td-editor-id='+CODEMIRROR_EDITOR_ID+' class="navbar navbar-default codemirror_menu">\
                            <div class="container-fluid"><div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">\
                              <ul class="nav navbar-nav">\
                                <li><a href="#"><i class="fa fa-undo td-menu-item td-menu-item-undo"></i></a></li>\
                                <li><a href="#"><i class="fa fa-rotate-right td-menu-item td-menu-item-redo"></i></a></li>\
                              </ul>\
                              <ul class="nav navbar-nav navbar-right">\
                                <div class="navbar-form form-inline" >\
                                </div>\
                              </ul>\
                              </div><!-- /.navbar-collapse -->\
                            </div><!-- /.container-fluid -->\
                          </nav>';

    var codemirror_editor = '<div id="codemirror_block_'+CODEMIRROR_EDITOR_ID+'" td-editor-id='+CODEMIRROR_EDITOR_ID+' class="codemirror_block"></div>';
      console.log(data)

      $("#po-container").append('<div class="panel-row"><div class="panel-title"><span class="source-text col-md-6">\
        '+data.src+'</span><span class="target-text col-md-6">'+data.tgt+'</span></div>\
        <div class="panel-body col-md-12">'+codemirror_menu+codemirror_editor+'</div></div>');

      // $("#po-container").append("<div class='row data-points'><div class='source col-md-6 text-center'>"+data.src+"</div><div class='col-md-6 text-center'><textarea style='width:100%' class='target expandableTextArea' spellcheck='false'>"+data.tgt+"</textarea></div></div>");
    }).promise().done(function(){
      init_editors(true);
      for(var i=0; i<editors.length; i++) {
        editors[i].setValue(window.PO_DATA.data[i].tgt);
      }

      $('.panel-title').siblings().hide();

      $('.panel-title').click(function() {
        console.log($(this).siblings());
        $(this).siblings().slideToggle();
        }); 

      // Not needed anymore: 
    // var elements = document.getElementsByClassName('expandableTextArea');

    // for(var i=0;i<elements.length; i++){
    //     elements[i].addEventListener('keyup', function() {
    //         this.style.overflow = 'hidden';
    //         this.style.height = 0;
    //         this.style.height = this.scrollHeight + 'px';
    //     }, false);      
    // }
    })
  }
})

function downloadURI(uri) 
{
    var link = document.createElement("a");
    link.href = uri;
    link.click();
}

$("#preview").click(function(){
  
  var data = []
  $("#po-container .row.data-points").each(function(){
    var src = $(this).find(".source").html();
    var tgt = $(this).find(".target").val();
    data.push({"src":src, "tgt":tgt});
  }).promise().done(function(){
    //Data Collected !!
    //POST as JSON to the URI

    var _D = {};
    _D.uid = window.uid;
    _D.fileName = window.fileName;
    _D.data = data;

    $.ajax({
      type: "POST",
      contentType: "application/json; charset=utf-8",
      url: "/preview",
      data: JSON.stringify(_D),
      complete: function (data) {
        // window.open(data.responseText);
        alert(data.responseText);
        downloadURI(data.responseText);
      },
      dataType: "json"
    });


  })


})