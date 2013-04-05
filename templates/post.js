var Step = require("step") ;

module.exports = function($)
{
	var $view = jQuery(this) ;

	// 编辑表单
	initEditForm() ;


	var blogEditor = null ;

	function initEditForm()
	{
		// 编辑、删除、保存 按钮事件
		$(".btnSave").click( function(){
			save() ;
		}) ;

		// 初始化文本编辑器
		initContentEditor(function(err,editor){
			if(err)
			{
				throw err ;
				return ;
			}

			blogEditor = editor ;
		})
	}

	function initContentEditor(callback)
	{
		Step(
			function loadScripts()
			{
				var group = this.group() ;

				jQuery.shipper.require("ocxBootstrapWysihtml5/public/wysihtml5-0.3.0.js",group()) ;
				jQuery.shipper.require("ocxBootstrapWysihtml5/public/bootstrap-wysihtml5.js",group()) ;
			}

			, function done(err)
			{
				jQuery.shipper.module("ocxBootstrapWysihtml5/public/wysihtml5-0.3.0.js") ;
				jQuery.shipper.module("ocxBootstrapWysihtml5/public/bootstrap-wysihtml5.js") ;

				// 创建 textarea
				var editor = $('.txtContent')
								.attr('id', 'txtContent_'+jQuery('.txtContent').length )
								.wysihtml5() ;

				callback && callback(null,{
					content: function()
					{
						return editor.val() ;
					}
				}) ;
			}
		)
	}

	function save()
	{
		if(!blogEditor)
		{
			throw new Error("找不到博客编辑器") ;
		}

		$(".blog.form").request(

			function(err,nut,$rootview)
			{

				nut.msgqueue.popup() ;

				if( nut.model.saved )
				{
					// 切换到文章浏览网页
					jQuery.request( 'ocxBlog/blog?id='+nut.model.blogid ) ;
				}
			}
			, {
				data: {
					content: blogEditor.content()
				}
			}
			// , true
		)	;

	}

}
