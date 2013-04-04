var Step = require("step") ;

module.exports = {
	view: "ocxBlog/templates/index.html"
	, layout: "ocxBlog/lib/BlogLayout.js"
	, process: function(seed,nut,earth)
	{
		var page = seed.page || 1 ;
		var numPerPage = 10 ;

		// 将参数传递给子控制器:page
		seed['@page'] = {
			page: page
			, numPerPage: numPerPage
		}

		earth.collection("blogs","ocxBlog").find().count(function(err,count){

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

			view: "ocxBlog/templates/index-page.html"
			, process: function(seed,nut,earth)
			{
				var page = seed.page || 1 ;
				var numPerPage = seed.numPerPage || 10 ;

				Step(

					function queryBlogs()
					{
						earth.collection("blogs","ocxBlog")
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
									earth.collection("users","ocPlatform")
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
}