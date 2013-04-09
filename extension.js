
module.exports = function(platform)
{
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
}