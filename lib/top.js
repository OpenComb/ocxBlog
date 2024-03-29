
module.exports = {


	layout: "ocxblog/lib/BlogLayout.js"
	, view: "ocxblog/templates/top.html"

	, process: function(feed,nut,earth)
	{
		//console.log(__filename)

		var by = feed.by || 'views' ;
		var sortOpt = {} ;
		sortOpt[by] = -1 ;

		nut.model.title = ({
			views: '热门文章'
			, createTime: '最新文章'
		}) [by] ;

		nut.model.blogs = [] ;

		earth.collection("blogs","ocxblog")
			.find()
			.limit(8)
			.sort(sortOpt)
			.toArray(function(err,docs){

				if(err)
				{
					console.log(err) ;
					earth.release() ;
					return ;
				}

				nut.model.blogs = docs ;
				earth.release() ;
			}) ;

	}
}
module.exports.__as_controller = true ;