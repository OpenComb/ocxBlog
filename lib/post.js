module.exports = {

	layout: "ocxBlog/lib/BlogLayout.js"
	, view: "ocxBlog/templates/post.html"

	, process: function(seed,nut,earth)
	{
		nut.model.userid = earth.req.session.idmgr.current() ;

		if( seed.id )
		{
			earth.collection("blogs","ocxBlog")
				.find({_id: earth.db.objectId(seed.id)})
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

					earth.release() ;
				}) ;
		}

		else
		{
			return true ;
		}
	}

	, actions: {

		/**
		 * 保存 blog
		 */
		save: function(seed,nut,earth)
		{
			nut.model.saved = false ;

			var userId = earth.req.session.idmgr.current() ;
			if(!userId)
			{
				nut.message("尚未登陆",[],"error") ;
				return true ;
			}

//			// 更新
//			if(!seed.id)
//			{
//				nut.message("缺少参数 id",[],"error") ;
//				return true ;
//			}
			if(!seed.title || !seed.content)
			{
				nut.message("请写好标题和内容",[],"error") ;
				return true ;
			}

			if(!seed.id)
			{
				var time = new Date ;
				var doc = {
					title: seed.title
					, content: seed.content
					, lastModified: time.toISOString()
					, createTime: time.toISOString()
					, aid: userId._id
					, views: 0
				} ;
				earth.collection("blogs","ocxBlog").insert(

					doc, {safe:true}

					, function(err){
						if(err)
						{
							nut.message('系统在保存Blog时遇到了错误',null,'error') ;
						}

						else
						{
							nut.model.saved = true ;
							nut.model.blogid = doc._id.toString() ;
							nut.message('Blog保存成功',null,'success') ;
						}

						earth.release () ;
					}
				) ;
			}

			else
			{
				earth.collection("blogs","ocxBlog").update(

					{_id: earth.db.objectId(seed.id)}

					, {
						$set: {
							title: seed.title
							, content: seed.content
							, lastModified: (new Date).toISOString()
						}
					}
					, {safe:true}
					, function(err){
						if(err)
						{
							nut.message('系统在保存Blog时遇到了错误',null,'error') ;
						}

						else
						{
							nut.model.saved = true ;
							nut.model.blogid = seed.id ;
							nut.message('Blog保存成功',null,'success') ;
						}

						earth.release () ;
					}
				) ;
			}
		}

		, del: function(seed,nut,earth)
		{
			nut.model.deleted = false ;

			var id = earth.req.session.idmgr.current() ;
			if(!id)
			{
				nut.message("尚未登陆",[],"error") ;
				return true ;
			}

			//
			if(!seed.id)
			{
				nut.message("缺少参数 id",[],"error") ;
				return true ;
			}

			earth.collection("blogs","ocxBlog").findAndRemove(
				{_id: earth.db.objectId(seed.id)}
				, function(err){
					if(err)
					{
						nut.message("删除文章时遇到了错误",[],"error") ;
					}
					else
					{
						nut.model.deleted = true ;
						nut.model.blogId = seed.id ;

						nut.message("文章已经删除",[],"success") ;
					}

					earth.release() ;
				}
			) ;

		}
	}


	// ----------------------------------------------------------
	// 前端执行函数
	, frontend:{

		viewIn: function()
		{

			// 编辑表单
			initEditForm() ;


			var blogEditor = null ;

			function initEditForm()
			{
				// 编辑、删除、保存 按钮事件
				$(".btnSave").click( function(){
					save() ;
				}) ;

				// 初始化文本编辑器
				initContentEditor(function(err,editor){
					if(err)
					{
						throw err ;
						return ;
					}

					blogEditor = editor ;
				})
			}

			function initContentEditor(callback)
			{
				var Step = require("step") ;

				Step(
					function loadScripts()
					{
						var group = this.group() ;

						jQuery.shipper.require("ocxBootstrapWysihtml5/public/wysihtml5-0.3.0.js",group()) ;
						jQuery.shipper.require("ocxBootstrapWysihtml5/public/bootstrap-wysihtml5.js",group()) ;
					}

					, function done(err)
					{
						jQuery.shipper.module("ocxBootstrapWysihtml5/public/wysihtml5-0.3.0.js") ;
						jQuery.shipper.module("ocxBootstrapWysihtml5/public/bootstrap-wysihtml5.js") ;

						// 创建 textarea
						var editor = $('.txtContent')
							.attr('id', 'txtContent_'+$('.txtContent').length )
							.wysihtml5() ;

						callback && callback(null,{
							content: function()
							{
								return editor.val() ;
							}
						}) ;
					}
				)
			}

			function save()
			{
				if(!blogEditor)
				{
					throw new Error("找不到博客编辑器") ;
				}

				$(".blog.form").request(

					function(err,nut,$rootview)
					{

						nut.msgqueue.popup() ;

						if( nut.model.saved )
						{
							// 切换到文章浏览网页
							$.request( 'ocxBlog/blog?id='+nut.model.blogid ) ;
						}
					}
					, {
						data: {
							content: blogEditor.content()
						}
					}
					// , true
				)	;

			}

		}

	}
}