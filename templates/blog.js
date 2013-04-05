var Step = require("step") ;

module.exports = function($)
{
	var view = this ;
	var $view = jQuery(this) ;
	var $layout = $view.parents(".oclayout").eq(0) ;


	// 面包屑
	$layout.find("ul.breadcrumb li").removeClass('active') ;
	$layout.find(".breadcrumb-item-blog")
		.addClass('active')
		.show()
		.html( $layout.find(".blogTitle a").html() )



	// 编辑、删除、保存 按钮事件
	$(".btnDelete").click( function(){
		$(".deleteConfirm").modal() ;
	}) ;
	$(".btnConfirmDelete").click(function(){
		console.log('delete confirm',arguments) ;

		jQuery.request(

			'ocxBlog/post:del?id='+$('input[name=id]').val()

			,function(err,nut){
				if( err )
				{
					console.log(err) ;
				}

				nut && nut.msgqueue.popup() ;

				if(nut.model.deleted)
				{
					jQuery.request("ocxBlog/index") ;
				}
			}
		) ;

	}) ;

}
