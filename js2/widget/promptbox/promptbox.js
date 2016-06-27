define(function() {
	
	var promptHtml = '<div class="crm_prompt_box"><span class="crm_prompt_image"></span><span class="crm_prompt_text">{text}</span></div>';
	
	return {

		'promptIns' : null,
		
		'eventId' : 0,
		
		'option' : {
			'timeout':2500
		},

		'setOption' : function( opts ) {

			$.extend( this.option , opts||{} );
		},

		'show' : function( mess , time , cssArr ) { //cssArr:{'z-index':'100','background':'#333'} HLP

			var textHtml = promptHtml.replace( /{text}/g , mess ),
				self = this;
			
			this.close();
			this.promptIns = $( textHtml );
			$( document.body ).append( this.promptIns );
			this._setPosition( cssArr );
			this.eventId = setTimeout( function() {
				self.close();
			} , time||this.option.timeout );
		},

		'close' : function() {
			clearTimeout( this.eventId );
			if( this.promptIns ) {
				this.promptIns.remove();
			}
			this.promptIns = null;
		},

		'_setPosition' : function(cssArr) {

			var outerWidth = $( document.body ).width(),
				width = this.promptIns.width(),
				height = this.promptIns.height(),
				left = 0,
				top = 20;

			left = 0.5 * ( outerWidth - width );
			
			var defaultCss = {
				'left' : left + 'px',
				'top' : top +'px',
				'textAlign':'center'
			};
			var allCss = $.extend({},defaultCss,cssArr); // HLP 2014-12-29
			// this.promptIns.css({
			// 	'left' : left + 'px',
			// 	'top' : top +'px'
			// });
			this.promptIns.css(allCss);
		}
	};	
});