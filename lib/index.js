var Step = require("step") ;

module.exports = {
	view: "ocxblog/templates/index.html"
	, layout: "ocxblog/lib/BlogLayout.js"
	, process: function(seed,nut,earth)
	{
		nut.title = "文章列表" ;

		var page = seed.page || 1 ;
		var numPerPage = 10 ;

		nut.model.display_operate_btns = earth.req.session.idmgr.current() ? true: false ;

		// 将参数传递给子控制器:page
		seed['@page'] = {
			page: page
			, numPerPage: numPerPage
		}

		earth.collection("blogs","ocxblog").find().count(function(err,count){

			nut.model.pageCount = Math.ceil(count/numPerPage) ;
			nut.model.thisPageNum = parseInt(page) ;
			nut.model.numPerPage = parseInt(numPerPage) ;
			nut.model.prevPageNum = nut.model.thisPageNum - 1 ;
			nut.model.nextPageNum = nut.model.thisPageNum + 1 ;
			if(nut.model.prevPageNum<1)
			{
				nut.model.prevPageNum = 1 ;
			}
			if(nut.model.nextPageNum>nut.model.pageCount)
			{
				nut.model.nextPageNum = nut.model.pageCount ;
			}

			earth.release() ;
		}) ;
	}

	, children: {

		'page' : {

			view: "ocxblog/templates/index-page.html"
			, process: function(seed,nut,earth)
			{
				var page = seed.page || 1 ;
				var numPerPage = seed.numPerPage || 10 ;

				Step(

					function queryBlogs()
					{
						earth.collection("blogs","ocxblog")
							.find()
							.limit(numPerPage)
							.sort({createTime:-1})
							.skip((page-1)*numPerPage)
							.toArray(this) ;
					}

					, function queryBlogAuthors(err,docs)
					{
						if(err)
						{
							console.log(err.toString()) ;
							earth.release() ;
							return ;
						}

						nut.model.blogs = docs ;

						var group = this.group() ;
						var grps = 0 ;

						for(var i=0;i<docs.length;i++)
						{
							if(docs[i].author)
							{
								(function(blog,groupfunc){
									earth.collection("users","ocplatform")
										.find({_id:blog.author}).limit(1)
										.each(function(err,doc){

											blog.author = doc ;

											if(err)
											{
												console.log(err) ;
											}
											groupfunc(err) ;
										}) ;
								}) (docs[i],group())

								grps ++ ;
							}
						}

						if(!grps)
						{
							return true ;
						}
					}

					, function done(err)
					{
						earth.release() ;
					}

				) ;
			}
		}

	}


	, viewIn: function()
	{
		// 面包屑
		var $layout = $(this).parents(".oclayout").eq(0) ;

		$layout.find("ul.breadcrumb li").removeClass('active') ;
		$layout.find(".breadcrumb-item-blog")
			.html('')
			.hide() ;
		$layout.find(".breadcrumb-item-index")
			.addClass('active') ;

		// 监听 userIdChanged 事件
		this.userIdChangedHandle = function (event,data){
			// 决定是否现实删除按钮
			$(".operation")[ data.now? 'show': 'hide' ] (100) ;
		}
		$(window).on('userIdChanged',this.userIdChangedHandle) ;
	}

	, viewOut: function()
	{
		// 注销监听userIdChanged事件的函数
		if(this.userIdChangedHandle)
		{
			$(window).off('userIdChangedHandle',this.userIdChangedHandle) ;
		}
	}
}
module.exports.__as_controller = true ;