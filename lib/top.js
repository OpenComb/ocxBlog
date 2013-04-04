
module.exports = {


	layout: "ocxBlog/lib/BlogLayout.js"
	, view: "ocxBlog/templates/top.html"

	, process: function(feed,nut,earth)
	{
		console.log(__filename)

		var by = feed.by || 'views' ;
		var sortOpt = {} ;
		sortOpt[by] = -1 ;

		nut.model.blogs = [] ;

		earth.collection("blogs","ocxBlog")
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