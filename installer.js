module.exports = {

	process: function(seed,nut,app){

		// 建立索引
		app.db.collection("blogs","ocxblog").ensureIndex({bid:1},{unique:true}) ;

		nut.model.completed = true ;

		return ;
	}

}