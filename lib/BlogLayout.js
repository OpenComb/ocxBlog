module.exports = {
	view: "ocxblog/templates/BlogLayout.html"
	, layout: "weblayout"

	, children: {
		tophot: "ocxblog/lib/top.js"
		, topnew: "ocxblog/lib/top.js"
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
module.exports.__as_controller = true ;