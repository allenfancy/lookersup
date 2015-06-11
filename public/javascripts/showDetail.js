function getContent() {
	
	
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



