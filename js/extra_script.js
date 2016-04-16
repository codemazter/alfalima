$.support.cors = true;
var user_token, username, gender, dob, profile_img,
 education, school, country, stay_check, following,
 followers, post_str, myTimeout,
 month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

var BASE_URL = "http://dreamguys.co.in/display/alfalima/";
localStorage.setItem("nf_post_load",10);

$(document).ready(function(e) {
    stay_check = window.localStorage.getItem("stay_check");
    if (stay_check) {
        $('#user_name').val(stay_check);
        $('.chksign').prop('checked', true);
    }
    $.support.touchOverflow = true;
    $.mobile.touchOverflowEnabled = true;
    $(function() {
        FastClick.attach(document.body);
    });
});

$(window).load(function() {
    $.mobile.phonegapNavigationEnabled = true;
    $.mobile.changePage.defaults.allowSamePageTransition = true;
});



$(document).on('click','.login_btn',function(){
	var u_name = $('#user_name').val();
	var u_pass = $('#user_pass').val();
	$('#signRes').html('');
	if(u_name == ""){
		$('#user_name').focus();
		$('#signRes').html('* Please enter username');
	}else if(u_pass == ""){
		$('#user_pass').focus();
		$('#signRes').html('* Please enter password');
	}else{
		$.ajax({
			url:BASE_URL+'api/student_login',
			type:'POST',
			data:{user_name:u_name,user_pass:u_pass},
			dataType:'json',
			beforeSend:function(){
				disableBack = true;
				$('.ajaxOverlay').show();
			}
		}).done(function(res){
			disableBack = false;
			$('.ajaxOverlay').hide();
			if(res.success=="y"){
				if ($('.chksign').is(":checked")){
                    window.localStorage.setItem("stay_check", u_name);
                }else{
                    window.localStorage.removeItem('stay_check');
                }
				user_storage(res);
				$.mobile.changePage('#homeLibrary');
			}else{
				$('#signRes').html('* Invalid username & password');
			}
		}).fail(function(){
			$('.ajaxOverlay').hide();
			disableBack = false;
			$('#signRes').html('* Invalid username & password');
		});
	}
});

function user_storage(res) {
	//set item
	window.localStorage.setItem("usr_id",res.data.usr_id);
	window.localStorage.setItem("usr_name",res.data.usr_name);
	window.localStorage.setItem("usr_gen",res.data.usr_gen);
	window.localStorage.setItem("usr_dob",res.data.usr_dob);
	window.localStorage.setItem("usr_img",res.data.usr_img);
	window.localStorage.setItem("usr_edu",res.data.usr_edu);
	window.localStorage.setItem("usr_school",res.data.usr_school);
	window.localStorage.setItem("usr_country",res.data.usr_country);
	window.localStorage.setItem("usr_following",res.data.usr_following);
	window.localStorage.setItem("usr_followers",res.data.usr_followers);
	//set item
	user_token = localStorage.usr_id;
	username = localStorage.usr_name;
	gender = localStorage.usr_gen;
	dob = localStorage.usr_dob;
	profile_img = localStorage.usr_img;
	education = localStorage.usr_edu;
	school = localStorage.usr_school;
	country = localStorage.usr_country;
	following = localStorage.usr_following;
	followers = localStorage.usr_followers;	
	//update user profile
	user_details_settings();
	_news_feed(res.news,0);
}
function user_details_settings() {
	$('.profileName').html('<h4>' + username + '</h4><h5>' + country + '</h5>');
    $('.profileImage img').attr('src', profile_img);
    $('.avatar img').attr('src', profile_img);
    $('.pro-title').html(username);
    $('.usr_fd1').html(username);
	$('.usr_fd2').html(dob);
	$('.usr_fd3').html(gender);
	$('.usr_fd4').html(education);
	$('.usr_fd5').html(school);
	$('.usr_fd6').html(country);
	$('.usr_fw_typ1').html(followers);
	$('.usr_fw_typ2').html(following);
}

function _news_feed(json,sts) {
	post_str = '';
	var post_lyk_sts, post_lyk_cls;

	for(var i = 0; i < json.length; i++) {
		//nf_usr_sts, nf_usr_id

		post_lyk_sts = (json[i]['nf_like_sts'] == 1) ? 1 : 0;
		post_lyk_cls = (json[i]['nf_like_sts'] == 1) ? 'checked_like' : '';

		post_str +='<div class="widget widget-shadow">';
		post_str +='<div class="ui-grid-a recent_posts">';
		post_str +='<div class="ui-block-a rp_head">';
		post_str +='<img src="'+json[i]['nf_usr_img']+'" alt="User Image" height="50" width="50">';
		post_str +='</div>';
		post_str +='<div class="ui-block-b rp_head">';
		post_str +='<p>'+json[i]['nf_usr_name']+'</p>';
		post_str +='<p>'+json[i]['nf_usr_tym']+'</p>';
		post_str +='</div>';

		if(json[i]['nf_usr_sts']==1){
			post_str +='<div class="ui-block-c rp_head rp_delete_post" data-val="'+json[i]['nf_sts_id']+'">';
			post_str +='<p>X</p>';
			post_str +='</div>';
		}

		post_str +='</div>';
		post_str +='<div class="ui-grid-solo rp_summary">';
		post_str +='<div class="ui-block-a rp_summary1">';
		post_str +=json[i]['nf_usr_post'];
		post_str +='</div>';
		post_str +='</div>';
		post_str +='<div class="ui-grid-a rp_footer_det">';
		post_str +='<div class="ui-block-a text-center rp_cmt_post" data-val="'+json[i]['nf_sts_id']+'">Comment</div>';
		post_str +='<div class="ui-block-b text-center rp_like_post '+post_lyk_cls+'" data-val="'+json[i]['nf_sts_id']+'" data-like="'+post_lyk_sts+'">Like</div>';
		post_str +='</div>';
		post_str +='</div>';
	}
	if(sts==0){$('.recent_post_li').html(post_str);}
	if(sts==1){$('.recent_post_li').append(post_str);}
}

$(document).live('pagebeforeshow', function() {
	var actPage = $.mobile.activePage.attr('id');
	localStorage.setItem("actPage",actPage);

	StopTimeout();
 	$(window).scroll(function() {
	    if($(window).scrollTop() == $(document).height() - $(window).height() && localStorage.actPage == "homeLibrary") {
	        //$('.post_load').html('<img src="images/loader.GIF" alt="loading..!"/>');
	        $.ajax({
	        	url:BASE_URL+'api/news_feed_details/'+user_token+'/'+localStorage.nf_post_load+'/1',
	        	type:'GET',
	        	dataType:'json',
				beforeSend:function(){
					disableBack = true;
					$('.ajaxOverlay').show();
				}
	        }).done(function(res){
	        	$('.ajaxOverlay').hide();
	        	disableBack = false;
	        	if(res.success=="y"){
	        		if(res.data.length!=0){
	        			_news_feed(res.data,1);
	        			localStorage.nf_post_load = Number(localStorage.nf_post_load) + 5;
	        		}
	        	}
	        }).fail(function(){
	        	$('.ajaxOverlay').hide();
	        	disableBack = false;
	        });
	    }
	});
});

$(document).on('click','.rp_delete_post',function(){
	var el = $(this);
	var post_id = $(this).attr('data-val');
	$.ajax({
		url:BASE_URL+'api/delete_news_feed',
		type:'POST',
		data:{id:post_id},
		dataType:'json',
		beforeSend:function(){
			disableBack = true;
		}
	}).done(function(res){
		disableBack = false;
		if(res.success=='y' && res.data==1){
			el.parent('div').parent('div').fadeOut('slow');
		}
	}).fail(function(){
		disableBack = false;
	});
});

$(document).on('click','.rp_like_post',function(){
	var el = $(this);
	var post_id = $(this).attr('data-val');
	var post_like = $(this).attr('data-like');
	
	$.ajax({
		url:BASE_URL+'api/update_like_status',
		type:'POST',
		data:{user_id:user_token,news_id:post_id,sts:post_like},
		dataType:'json',
		beforeSend:function(){
			disableBack = true;
		}
	}).done(function(res){
		disableBack = false;
		if(res.success=='y'){
			if(post_like == 0){
				el.addClass('checked_like');
				el.attr('data-like',1);

			}else if(post_like == 1){
				el.removeClass('checked_like');
				el.attr('data-like',0);
			}
		}
	}).fail(function(){
		disableBack = false;
	});
});

$(document).on('click','.rp_cmt_post',function(){
	var el = $(this), cmt_str1 = '',post_id;
	post_id = $(this).attr('data-val');
	cmt_str1 += $(this).parent('div').parent('div').html();
	get_comments(cmt_str1,post_id);
});

function get_comments(cmt_str1,post_id) {
	var cmt_str2 = '',tot_html_str;
	$('.post_comment').attr('data-val','');
	$('.post_data').val('');
	$.ajax({
		url:BASE_URL+'api/comments_details',
		type:'POST',
		data:{user_id:user_token,cmt_id:post_id},
		dataType:'json',
		beforeSend:function(){
			disableBack = true;
			$('.ajaxOverlay').show();
		}
	}).done(function(res){
		$('.ajaxOverlay').hide();
		disableBack = false;
		if(res.success=='y'){
			$('.post_comment').attr('data-val',post_id);
			if(res.data.length!=0){
				for(var i = 0; i < res.data.length; i++) {
					cmt_str2 +='<div class="ui-grid-a recent_cmt">';
					cmt_str2 +='<div class="ui-block-a rp_cmt_head">';
					cmt_str2 +='<img src="'+res.data[i]['cm_img']+'" alt="Img" height="50" width="50">';
					cmt_str2 +='</div>';
					cmt_str2 +='<div class="ui-block-b rp_cmt_head">';
					cmt_str2 +='<p><span class="rc_user">'+res.data[i]['cm_name']+':</span> '+res.data[i]['cm_post']+'</p>';
					cmt_str2 +='<p>'+res.data[i]['cm_time']+'</p>';
					cmt_str2 +='</div>';
					if(res.data[i]['cm_del_sts']==1){
						cmt_str2 +='<div data-val="'+res.data[i]['cm_id']+'" class="ui-block-c rp_cmt_head rp_cmt_delete">';
						cmt_str2 +='<p>X</p>';
						cmt_str2 +='</div>';
					}
					cmt_str2 +='</div>';
				}
			}
			tot_html_str = cmt_str1 + cmt_str2;
			$('.recent_cmt_li').html('');
			$('.recent_cmt_li').html(tot_html_str);
			$('.recent_cmt_li').find('.rp_delete_post').html('');
			$('.recent_cmt_li').find('.rp_delete_post').removeClass('rp_delete_post');
			$('.recent_cmt_li').find('.rp_cmt_post').removeClass('rp_cmt_post');
			$.mobile.changePage('#cmtLibrary');
		}
	}).fail(function(){
		$('.ajaxOverlay').hide();
		disableBack = false;
	});
}

$(document).on('click','.rp_cmt_delete',function(){
	var el = $(this),post_id;
	post_id = $(this).attr('data-val');
	$.ajax({
		url:BASE_URL+'api/delete_post_comments',
		type:'POST',
		dataType:'json',
		data:{id:post_id}
	}).done(function(res){
		if(res.success=='y'){
			el.parent('div').fadeOut();
		}
	});
});

$(document).on('click','.post_comment',function(){
	var post_data = $('.post_data').val();
	var post_id = $(this).attr('data-val');
	if(post_data!="" && post_id!=""){
		$.ajax({
			url:BASE_URL+'api/insert_post_comments',
			type:'POST',
			dataType:'json',
			data:{user_id:user_token,cmt_id:post_id,cmt_data:post_data}
		}).done(function(res){
			if(res.success=='y'){
				cmt_str = '';
				cmt_str +='<div class="ui-grid-a recent_cmt">';
				cmt_str +='<div class="ui-block-a rp_cmt_head">';
				cmt_str +='<img src="'+profile_img+'" alt="Img" height="50" width="50">';
				cmt_str +='</div>';
				cmt_str +='<div class="ui-block-b rp_cmt_head">';
				cmt_str +='<p><span class="rc_user">'+username+':</span> '+post_data+'</p>';
				cmt_str +='<p>less than a minute ago</p>';
				cmt_str +='</div>';
				cmt_str +='<div data-val="'+res.data+'" class="ui-block-c rp_cmt_head rp_cmt_delete">';
				cmt_str +='<p>X</p>';
				cmt_str +='</div>';
				cmt_str +='</div>';
				$('.recent_cmt_li').append(cmt_str);
			}
		});
		$('.post_data').val('');
	}
});

$(document).on('click','.new_status',function(){
	var txt = $('.status_txt').val()
	if(txt!=""){
		$.ajax({
			url:BASE_URL+'api/insert_news_feed',
			type:'POST',
			data:{user_id:user_token,new_status:txt},
			dataType:'json',
			beforeSend:function(){
				disableBack = true;
			}
		}).done(function(res){
			disableBack = false;
			if(res.success=='y'){
				post_str = '';
				post_str +='<div class="widget widget-shadow">';
				post_str +='<div class="ui-grid-a recent_posts">';
				post_str +='<div class="ui-block-a rp_head">';
				post_str +='<img src="'+profile_img+'" alt="User Image" height="50" width="50">';
				post_str +='</div>';
				post_str +='<div class="ui-block-b rp_head">';
				post_str +='<p>'+username+'</p>';
				post_str +='<p>'+res.ins_tym+'</p>';
				post_str +='</div>';
				post_str +='<div class="ui-block-c rp_head rp_delete_post" data-val="'+res.ins_id+'">';
				post_str +='<p>X</p>';
				post_str +='</div></div>';
				post_str +='<div class="ui-grid-solo rp_summary">';
				post_str +='<div class="ui-block-a rp_summary1">';
				post_str += '<p>'+txt+'</p>';
				post_str +='</div></div>';
				post_str +='<div class="ui-grid-a rp_footer_det">';
				post_str +='<div class="ui-block-a text-center rp_cmt_post" data-val="'+res.ins_id+'">Comment</div>';
				post_str +='<div class="ui-block-b text-center rp_like_post" data-val="'+res.ins_id+'" data-like="0">Like</div>';
				post_str +='</div>';
				post_str +='</div>';
				$('.recent_post_li').prepend(post_str);
			}else{
				console.log('error');
			}
		}).fail(function(){
			disableBack = false;
			console.log('error');
		});
	}else{
		console.log('empty');
	}
});

$(document).on('click','.blogs_view',function(){
	$('.blog_view_list').html('');
	var no_res ='<div class="ui-grid-solo blg_li">';
	no_res +='<div class="ui-block-a">';
	no_res +='<h4>&nbsp;</h4>';
	no_res +='<p>Sorry..! no results were found.</p>';
	no_res +='</div>';
	no_res +='</div>';
	$.ajax({
		url:BASE_URL+'api/blogs_list',
		type:'POST',
		data:{user_id:user_token},
		dataType:'json',
		beforeSend:function(){
			disableBack = true;
			$('.ajaxOverlay').show();
		}
	}).done(function(res){
		$('.ajaxOverlay').hide();
		disableBack = false;
		if(res.success=='y'){
			if(res.data.length != 0){
				var blog = "";
				for(var i = 0; i < res.data.length; i++) {
					blog += '<div class="ui-grid-solo blg_li">';
					blog += '<div class="ui-block-a">';
					blog += '<h4>'+res.data[i]['title']+'</h4>';
					blog += '<div class="blog-details">';
					blog += '<a class="blg_dt" href="javascript:;">'+res.data[i]['tym']+'</a>';
					blog += '</div>';
					blog += '<p>'+res.data[i]['text']+'</p>';
					blog += '<textarea style="display:none;" class="ta_'+res.data[i]['b_id']+'">'+res.data[i]['blog_str2']+'</textarea>';
					blog += '<div class="pull-left">';
					blog += '<span class="blg_usr">'+res.data[i]['user']+' </span>&nbsp;';
					blog += '<span class="blg_cmt">'+res.data[i]['cmt_count']+' Comments</span>';
					blog += '</div>';
					blog += '<div class="pull-right text-right">';
					blog += '<a href="javascript:;" class="read-more blog_read_more" data-blog="'+res.data[i]['b_id']+'" data-str="'+res.data[i]['blog_str1']+'" data-role="none">Read More</a>';
					blog += '</div>';
					blog += '</div>';
					blog += '</div>';
				}
				$('.blog_view_list').html(blog);
			}else{
				$('.blog_view_list').html(no_res);	
			}
		}else{
			$('.blog_view_list').html(no_res);
		}
	}).fail(function(){
		$('.ajaxOverlay').hide();
		disableBack = false;
		$('.blog_view_list').html(no_res);
	});
});

$(document).on('click','.blog_read_more',function(){
	var blog_id = $(this).attr('data-blog');
	var blog_str = $(this).attr('data-str');
	arr = blog_str.split('[^]');
	$('.blog_comment').attr('data-val',blog_id);
	var ta = $('.ta_'+blog_id).val();
	var bv = '<div class="ui-grid-solo blg_li">';
	bv += '<div class="ui-block-a">';
	bv += '<h4>'+arr[0]+'</h4>';
	bv += '<div class="blog-details">';
	bv += '<span class="blg_usr">'+arr[2]+'</span><br/>';
	bv += '<span class="blg_dt">'+arr[1]+'</span>&nbsp;&nbsp;';
	bv += '<span class="blg_cmt">'+arr[3]+' Comments</span>';
	bv += '</div>';
	bv += '<p class="blg_det">'+ta+'</p>';
	bv += '</div>';
	bv += '</div>';
	$('.bv_details').html(bv);
	$.ajax({
		url:BASE_URL+'api/blog_read_more',
		type:'POST',
		data:{user_id:user_token,blog_ref:blog_id},
		dataType:'json',
		beforeSend:function(){
			$('.bv_comments').html('');
			disableBack = true;
			$('.ajaxOverlay').show();
		}
	}).done(function(res){
		$('.ajaxOverlay').hide();
		disableBack = false;
		var blog_txt = "";
		if(res.success=='y'){
			if(res.data.length != 0){
				for(var i = 0; i < res.data.length; i++) {
					blog_txt += '<div class="ui-grid-a blg-usr-cmt">';
					blog_txt += '<div class="ui-block-a blg-img-msg">';
					blog_txt += '<img src="'+res.data[i]['img']+'" alt="user image" height="50" width="50">';
					blog_txt += '</div>';
					blog_txt += '<div class="ui-block-b blg-cmt-text">';
					blog_txt += '<p>'+res.data[i]['user']+'</p>';
					blog_txt += '<p>'+res.data[i]['text']+'</p>';
					blog_txt += '<p>'+res.data[i]['tym']+'</p>';
					blog_txt += '</div>';
					blog_txt += '</div>';
				}
			}
		}
		$('.bv_comments').html(blog_txt);
	}).fail(function(){
		$('.ajaxOverlay').hide();
		$('.bv_comments').html('');
		disableBack = false;
	});
	$.mobile.changePage('#blogView');
});

$(document).on('click','.blog_comment',function(){
	var _msg = $('.blog_data').val();
	var _id = $(this).attr("data-val");
	if(_msg!=""){
		$.ajax({
			url:BASE_URL+'api/blog_post_comment',
			type:'POST',
			data:{user_id:user_token,blog_id:_id,msg:_msg},
			dataType:'json',
			beforeSend:function(){
				disableBack = true;
			}
		}).done(function(res){
			disableBack = false;
			$('.blog_data').val('');
			if(res.success=='y'){
				blog_txt = '<div class="ui-grid-a blg-usr-cmt">';
				blog_txt += '<div class="ui-block-a blg-img-msg">';
				blog_txt += '<img src="'+profile_img+'" alt="user image" height="50" width="50">';
				blog_txt += '</div>';
				blog_txt += '<div class="ui-block-b blg-cmt-text">';
				blog_txt += '<p>'+username+'</p>';
				blog_txt += '<p>'+_msg+'</p>';
				blog_txt += '<p>less than a minute ago</p>';
				blog_txt += '</div>';
				blog_txt += '</div>';
				$(".bv_comments").prepend(blog_txt);
			}
		}).fail(function(){
			disableBack = false;
			$('.blog_data').val('');
		});
	}
});

$(document).on('click','.get_chat_user',function(){
	var no_res ='<div class="ui-grid-solo blg_li">';
	no_res +='<div class="ui-block-a">';
	no_res +='<h4>&nbsp;</h4>';
	no_res +='<p>Sorry..! no results were found.</p>';
	no_res +='</div>';
	no_res +='</div>';

	$.ajax({
		url:BASE_URL+'api/get_chat_user',
		type:'POST',
		data:{user_id:user_token},
		dataType:'json',
		beforeSend:function(){
			$('.usr_chat_list').html('');
			disableBack = true;
			$('.ajaxOverlay').show();
		}
	}).done(function(res){
		disableBack = false;
		$('.ajaxOverlay').hide();
		var cl = '';
		if(res.success=='y'){
			if(res.data.length != 0){
				for(var i = 0; i < res.data.length; i++) {
					cl += '<a class="w-clearfix w-inline-block msg-list get_chat_details" data-typ="'+res.data[i]['typ']+'" data-chat="'+res.data[i]['id']+'" href="javascript:;" data-role="none">';
					cl += '<div class="w-clearfix column-left">';
					cl += '<div class="image-message"><img src="'+res.data[i]['img']+'"></div>';
					cl += '</div>';
					cl += '<div class="column-right">';
					cl += '<div class="message-title">'+res.data[i]['usr']+'</div>';
					cl += '<div class="message-time">'+res.data[i]['tym']+'</div>';
					cl += '<div class="message-text">'+res.data[i]['msg']+'</div>';
					cl += '</div>';
					cl += '</a>';
				}
			}else{
				cl = no_res;
			}
		}else{
			cl = no_res;
		}
		$('.usr_chat_list').html(cl);
	}).fail(function(){
		disableBack = false;
		$('.ajaxOverlay').hide();
		$('.usr_chat_list').html(no_res);
	});
});

$(document).on('click','.get_chat_details',function(){
	var no_res ='<div class="ui-grid-solo blg_li">';
	no_res +='<div class="ui-block-a">';
	no_res +='<h4>&nbsp;</h4>';
	no_res +='<p>Sorry..! no results were found.</p>';
	no_res +='</div>';
	no_res +='</div>';
	var chat_id = $(this).attr('data-chat');
	var chat_typ = $(this).attr('data-typ');
	$('.chat_reply').attr('data-val',chat_id);
	$('.chat_reply').attr('data-typ',chat_typ);
	$.ajax({
		url:BASE_URL+'api/get_chat_details',
		type:'POST',
		data:{user_id:user_token,chat_id:chat_id},
		dataType:'json',
		beforeSend:function(){
			$('.list-chats').html('');
			$('.empty-chat').html('');
			disableBack = true;
			$('.ajaxOverlay').show();
		}
	}).done(function(res){
		disableBack = false;
		$('.ajaxOverlay').hide();
		var im = '';
		if(res.success=='y'){
			if(res.data.length != 0){
				for(var i = 0; i < res.data.length; i++) {
					if(res.data[i]['typ'] == 1){
						im += '<li class="list-chat right">';
						im += '<div class="w-clearfix column-right chat right">';
						im += '<div class="arrow-globe right"></div>';
						im += '<div class="chat-text right">'+res.data[i]['msg']+'</div>';
						im += '<div class="chat-time right">'+res.data[i]['tym']+'</div>';
						im += '</div>';
						im += '</li>';
					}else{
						im += '<li class="w-clearfix list-chat">';
						im += '<div class="column-left chat">';
						im += '<div class="image-message chat"><img src="'+res.data[i]['img']+'">';
						im += '</div>';
						im += '</div>';
						im += '<div class="w-clearfix column-right chat">';
						im += '<div class="arrow-globe"></div>';
						im += '<div class="chat-text">'+res.data[i]['msg']+'</div>';
						im += '<div class="chat-time">'+res.data[i]['tym']+'</div>';
						im += '</div>';
						im += '</li>';
					}
				}
				$('.list-chats').html(im);
			}else{
				$('.empty-chat').html(no_res);
			}
		}else{
			$('.empty-chat').html(no_res);
		}
	}).fail(function(){
		$('.ajaxOverlay').hide();
		disableBack = false;
		$('.empty-chat').html(no_res);
	});
	$.mobile.changePage('#chatLibrary');
	sync_user_chat(chat_id);
});

function sync_user_chat(_cid) {

	$.ajax({
		url:BASE_URL+'api/sync_user_chat',
		type:'POST',
		data:{user_id:user_token,chat_id:_cid},
		dataType:'json'
	}).done(function(res){
		var im = '';
		if(res.success=='y'){
			if(res.data.length != 0){
				for(var i = 0; i < res.data.length; i++) {
						im += '<li class="w-clearfix list-chat">';
						im += '<div class="column-left chat">';
						im += '<div class="image-message chat"><img src="'+res.data[i]['img']+'">';
						im += '</div>';
						im += '</div>';
						im += '<div class="w-clearfix column-right chat">';
						im += '<div class="arrow-globe"></div>';
						im += '<div class="chat-text">'+res.data[i]['msg']+'</div>';
						im += '<div class="chat-time">'+res.data[i]['tym']+'</div>';
						im += '</div>';
						im += '</li>';
				}
				$('.list-chats').append(im);
				$('.empty-chat').html('');
				//$("html, body").animate({ scrollTop: $(document).height() - $(window).height() }, 500);
				var last_li = $(".list-chats li:last-child").offset().top;
				$.mobile.silentScroll(last_li);
			}
		}
	}).fail(function(){
		console.log('error');
	});
	myTimeout = setTimeout(function() { sync_user_chat(_cid); }, 2500);
}

function StopTimeout() {
    clearTimeout(myTimeout);
}

$(document).on('click','.chat_reply',function(){
	var cd = new Date(); 
	var dt = cd.getFullYear() + " "
                + month[(cd.getMonth())]  + " " 
                + cd.getDate() + " "  
                + cd.getHours() + ":"  
                + cd.getMinutes() + ":" 
                + cd.getSeconds();

	var msg = $('.chat_data').val();
	var chat_id = $(this).attr('data-val');
	var chat_typ = $(this).attr('data-typ');
	if(msg != "" && chat_id != "" && chat_typ != ""){
		$('.empty-chat').html('');
		var im = '<li class="list-chat right">';
			im += '<div class="w-clearfix column-right chat right">';
			im += '<div class="arrow-globe right"></div>';
			im += '<div class="chat-text right">'+msg+'</div>';
			im += '<div class="chat-time right">'+dt+'</div>';
			im += '</div>';
			im += '</li>';
			$('.list-chats').append(im);
			//$("html, body").animate({ scrollTop: $(document).height() - $(window).height() }, 500);
			var last_li = $(".list-chats li:last-child").offset().top;
			$.mobile.silentScroll(last_li);
		$.ajax({
			url:BASE_URL+'api/chat_reply',
			type:'POST',
			data:{user_id:user_token,chat_id:chat_id,chat_typ:chat_typ,msg:msg},
			dataType:'json',
			beforeSend:function(){
				disableBack = true;
			}
		}).done(function(res){
			disableBack = false;
			$('.chat_data').val("");
		}).fail(function(){
			disableBack = false;
		});
	}
});

$(document).ready(function(e) {

	//=========================== Device Ready ==================================
    document.addEventListener("deviceready", function() {
        disableBack = false;
        document.addEventListener("backbutton", function() {
            if ($.mobile.activePage == "login") {
                navigator.app.exitApp();
            }
            if (disableBack == false) {
                var prevPage = $.mobile.activePage.attr('data-prev');
                if (prevPage) {
                    if (prevPage == "login") {
                         navigator.notification.confirm("Do you wan't to exit from ALFALIMA?",onConfirm,'Exit','Ok,Cancel');
                    }else{
                        $.mobile.changePage("#" + prevPage, {reverse: true});
                    }
                }else{
                    navigator.notification.confirm("Do you wan't to exit from ALFALIMA?",onConfirm,'Exit','Ok,Cancel');
                }
            }
        }, false);
    }, false);
    /** Device Ready ends **/
});

function onConfirm(buttonIndex) {
    if (buttonIndex == 1) {
        //window.localStorage.clear();
        navigator.app.exitApp();
    };
}