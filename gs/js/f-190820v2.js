 
var start_time = new Date().getTime();


function success_load(id){
    num_success ++;
    num_ajax_finish ++;
    var end_time = new Date().getTime();
    // if(num_ajax_finish == num_ajax_all){
    //     if(num_time_out >= num_ajax_all/2){
    //       $(".detect-msg").html('检测到您有一半的链接无法打开，建议您刷新本页面重试').show();
    //     }
    // }
    
    $("#item-" +id).find('.status').html('打开耗时：' + ((end_time - start_time)*0.001).toFixed(2) + 's');
    var link_text = '点击访问' + $("#item-" +id).find('.i-note').val();
    if( $("#item-" +id).find('.i-tips').val().length > 0 ){
        $("#item-" +id).find('.golink').html(
            '<a id="show-tips-' + $("#item-" +id).find('.i-id').val() + '" href="' + $("#item-" +id).find('.i-url').val() + 
             '" target="_blank" >' + link_text + '</a>');
        $('#show-tips-' + $("#item-" +id).find('.i-id').val())
            .mouseover(function(){
                layer.tips($("#item-" +id).find('.i-tips').val(), '#show-tips-' + $("#item-" +id).find('.i-id').val(),{tips:3,time:0});
            })
            .mouseout(function(){
                layer.closeAll();
            });
    }else{
        $("#item-" +id).find('.golink').html('<a onclick="javascript:gs_clickLinkAdd(\'' + $("#item-" +id).find('.i-id').val() + '\')" href="' + $("#item-" +id).find('.i-url').val() + '" target="_blank" title="打开链接">' + link_text + '</a>');
    }
}

function fail_load(id){
    num_time_out++;
    num_ajax_finish ++;
    // if(num_ajax_finish == num_ajax_all){
    //     if(num_time_out >= num_ajax_all/2){
    //       $(".detect-msg").html('检测到您有一半的链接无法打开，建议您刷新本页面重试').show();
    //     }
    // }
    $("#item-" +id).find('.status').html('<span class="error">检测超时　<a onclick="javascript:gs_clickLinkAdd(\'' + $("#item-" +id).find('.i-id').val() + '\')" class="error-open" href="' + $("#item-" +id).find('.i-url').val() + '" target="_blank" title="手动打开链接测试">打开链接</a></span>');
    $("#item-" +id).find('.golink').html('');
}

$(document).ready(function(){
        var i = 0 ;
        for(i = 0; i < gs_links.length; i++){
            
            var ht_type = '';
            if(gs_links[i]['ajax_type']=='img'){
                ht_type = "<img style='display:none;' src='" + gs_links[i]['ajax_url'] + "?s=" + new Date().valueOf() +"'  onload='success_load(" +gs_links[i]['id']  + ")' onerror='fail_load(" +gs_links[i]['id']  + ")'>";
            }else if(gs_links[i]['ajax_type']=='jsonp'){
                ht_type = "<input type='hidden' class='i-ajax-jsonp' value='" + gs_links[i]['ajax_url'] + "?s=" + new Date().valueOf() +"'>" 
            }
            
            var ht = "<tr class='gs-item' id='item-" +gs_links[i]['id']  + "'><td>镜像" + gs_links[i]['id'] 
            + "<input type='hidden' class='i-url' value='" + gs_links[i]['url'] + "'>" 
            + "<input type='hidden' class='i-ajax-url' value='" + gs_links[i]['ajax_url'] + "'>" 
            + "<input type='hidden' class='i-note' value='" + gs_links[i]['note'] + "'>" 
            + "<input type='hidden' class='i-tips' value='" + gs_links[i]['tips'] + "'>" 
            + "<input type='hidden' class='i-id' value='" + gs_links[i]['id'] + "'>" 
            + ht_type
            + "</td><td class='status'><img src='images/loading.gif' title='正在检测'></td><td class='golink'></td></tr>";

            if(gs_links[i]['type']=='scholar'){
                $("#gs-scholar tbody").append(ht);
            }else if(gs_links[i]['type']=='search'){
                $("#gs-search tbody").append(ht);
            }
            
             $('.gs-item .i-ajax-jsonp').each(function(){
                var now_this = $(this).parents('tr');
                var start_time = new Date().getTime();
                var myajax = $.ajax({
					url: $(now_this).find('.i-url').val(),
					type: "head",
					timeout: 5000,
					dataType: "jsonp",
                    beforeSend: function(jqXHR , settings ){
                        // $(now_this).find('.status').html('<img src="images/loading.gif" title="正在检测">');
                        // $(now_this).find('.golink').html('');
                    },
					complete: function(response, textStatus) {
						if(response.status == 200){
						    success_load($(now_this).find('.i-id').val());
						}else {
                            myajax.abort();
                            fail_load($(now_this).find('.i-id').val());
						}
						
						if(textStatus=='timeout'){//超时,status还有success,error等值的情况
                            myajax.abort();
                            fail_load($(now_this).find('.i-id').val());
                    　　}
					},
                    error:function(XMLHttpRequest, textStatus, errorThrown){
                        myajax.abort();
                        fail_load($(now_this).find('.i-id').val());
                    }
				});
            })
            
        }
});