module.exports = {

	layout: "ocxBlog/lib/BlogLayout.js"

	, view: "ocxBlog/templates/blog.html"

	, process: function(seed,nut,earth)
	{
		nut.view.disable() ;

		if( !seed.id )
		{
			nut.message("缺少参数id") ;
			return true ;
		}

		nut.model.display_operate_btns = earth.req.session.idmgr.current() ? true: false ;

		var model = earth.collection("blogs","ocxBlog") ;
		model.find({_id: earth.db.objectId(seed.id)})
			.limit(1)
			.toArray(function(err,docs){

				if(err)
				{
					nut.message("系统遇到了错误") ;
					earth.release() ;
					return ;
				}

				if(!docs.length)
				{
					nut.message("指定的blog不存在") ;
					earth.release() ;
					return ;
				}

				nut.model.blog = docs[0] ;
				nut.model.blog.id = docs[0]._id.toString() ;
				nut.view.enable() ;

				earth.release() ;

				// 浏览次数 1++
				model.update(
					{_id:docs[0]._id}
					,{ $set:{views: (docs[0].views+1)||0} }
					, {safe:true}
					, function(err){
						if(err)
						{
							console.log(err) ;
						}
					}
				) ;
			}) ;
	}


	, frontend:
	{
		viewIn: function()
		{
			var $view = $(this) ;
			var $layout = $view.parents(".oclayout").eq(0) ;


			// 面包屑
			$layout.find("ul.breadcrumb li").removeClass('active') ;
			$layout.find(".breadcrumb-item-blog")
				.addClass('active')
				.show()
				.html( $layout.find(".blogTitle a").html() )



			// 编辑、删除、保存 按钮事件
			$(".btnDelete").click( function(){
				$(".deleteConfirm").modal() ;
			}) ;
			$(".btnConfirmDelete").click(function(){
				console.log('delete confirm',arguments) ;

				$.request(

					'ocxBlog/post:del?id='+$('input[name=id]').val()

					,function(err,nut){
						if( err )
						{
							console.log(err) ;
						}

						nut && nut.msgqueue.popup() ;

						if(nut.model.deleted)
						{
							$.request("ocxBlog/index") ;
						}
					}
				) ;

			}) ;

		}
	}
} ;