module.exports = {
	view: "ocxBlog/templates/BlogLayout.html"
	, layout: "weblayout"

	, children: {
		tophot: "ocxBlog/lib/top.js"
		, topnew: "ocxBlog/lib/top.js"
	}

	, process: function(seed)
	{
		seed["@tophot"] = {
			by: 'views'
		}

		seed["@topnew"] = {
			by: 'createTime'
		}

		return true ;
	}
}