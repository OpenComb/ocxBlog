
module.exports = function(platform)
{
	platform.on('openDB',function(err,client){
		if(err || !client)
		{
			return ;
		}

		//
		client.ensureIndex('ocxBlog/blogs',{createTime:-1},  {background: true}, function(err){
			console.log("ensureIndex() ocxBlog/blogs index: {createTime: -1}",err) ;
		}) ;
		client.ensureIndex('ocxBlog/blogs',{views:-1},  {background: true}, function(err){
			console.log("ensureIndex() ocxBlog/blogs index: {views: -1}",err) ;
		}) ;

	}) ;
}