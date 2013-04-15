var tplCahces = require("octemplate") ;

module.exports = function(platform,callback)
{
	// 索引
	platform.on('openDB',function(err,client){
		if(err || !client)
		{
			return ;
		}

		//
		client.ensureIndex('ocxblog/blogs',{createTime:-1},  {background: true}, function(err){
			console.log("ensureIndex() ocxblog/blogs index: {createTime: -1}",err) ;
		}) ;
		client.ensureIndex('ocxblog/blogs',{views:-1},  {background: true}, function(err){
			console.log("ensureIndex() ocxblog/blogs index: {views: -1}",err) ;
		}) ;

	}) ;

	// 在导航菜单上插入链接
	tplCahces.template('ocplatform/templates/WebLayout.html',function(err,tpl){
		if(!err)
		{
			tpl.$('ul.nav-top').append('<li class="menu-item"><a href="/ocxblog/index" direct>Blog</a></li>') ;
		}
		else
		{
			throw err ;
		}
	}) ;

	callback(null) ;
}