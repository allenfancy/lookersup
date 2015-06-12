function postComments() {
	var ids = $('#ids').val();
	var content = $('#contents').val();
	var creator_id = $('#creator_id').val();
	var current_user_id = $('#current_id').text();	
	if(creator_id == current_user_id){
		alert('自己发布的文章，不能评论!');
		return;
	}

	if(content == null || content==''){
		alert('请输入评论的内容');
		return;
	}
	var data = {
			"ids":ids,
			"content":content	
	};
	
	$.ajax({
		url:'/saveComment',
		type:'POST',
		data:data,
		success:function(data,status){
			if(status=='success'){
				window.location.reload();
			}
		},
		error:function(data){
			var json = data.responseJSON;
			alert(json.data);
		}
	});
}

function likeNote(){
	
	
	var creator_id = $('#creator_id').val();
	var current_user_id = $('#current_id').text();
	var sid = $.cookie('sid');
	var showLikeId = '';
	if(!current_user_id || current_user_id=='undefined'){
		showLikeId = sid;
	}else{
		showLikeId = current_user_id;
	}
	if(creator_id == current_user_id){
		alert('自己发布的游记,不能表示喜欢!');
		return;
	}
	var ids = $('#ids').val();
	var data = {
			"ids":ids,
			"showLike_id":showLikeId
	}
	$.ajax({
		url:'/likeNotes',
		type:'POST',
		data:data,
		success:function(data,status){
			if(status=='success'){
				$('#likes').text(data.praise_number+'人喜欢');
			}
		},
		error:function(data,error){
			if(error == 'error'){
				alert(data.responseJSON.msg);
			}
			//window.location.href='/404'
		}
	});
}


function ConnectionTravelNotes(){
	var ids = $('#ids').val(); //文章的Id
	var creator_id = $('#creator_id').val(); //当前的浏览此文章的人
	var current_user_id = $('#current_id').text();
	
	
	if(current_user_id ==null ||current_user_id=='undefined' || current_user_id ==''){
		alert('请先登录');
		return;
	}
	if(creator_id == current_user_id){
		alert('自己发布的文章，不能收藏!');
		return;
	}
	var data = {
			'travelnotes_id':ids,
			'collection_user_id':current_user_id
	}
	
	$.ajax({
		url:'/saveCollections',
		type:'POST',
		data:data,
		success:function(data,status){
			if(status=='success'){
				$('#colls').text(data.collection_number+'人收藏');
			}
		},
		error:function(data,error){
			if(error == 'error'){
				alert(data.responseJSON.msg);
			}
		}
	});
}

