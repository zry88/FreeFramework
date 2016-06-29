/**
 *Author : Gill Gong
 *Date : 2014/7/28
 */
define(function() {
	
	/**不在线颜色
	 * .color0{ background:#008faf;} 
	 * .color1{ background:#9ac6c7; }
	 * .color2 background:#cae4e3; }
	 * .color3{ background:#b8dbc5; }
	 * .color4{ background:#5cb389; }
	 * .color5{ background:#f1bcb8; }
	 * .color6{ background:#E9E5E5;}
	*/
	/**
	 * opts format like below : {
	 * 		'url' : xxx,
	 * 		'className' : xxx,
	 * 		'name' : xxx,
	 * 		'hashColor' : xxx
	 * }
	 */
	var Image = function( opts ) {
		
		this.opts = $.extend({
			'id' : '',
			'url' : '',
			'hashColor' : '',
			'urlPrefix' : true,
			'hasDelIcon' : false,//zee
			'picLevel' : 'm',			//l 大图 , m 中图 , s 小图
			'picLevelConf' : {
				'l' : {
                'width' : 100,
                'height' : 120
                },
				'm' : {
					'width' : 40,
					'height' : 40
				},
				's' : {
					'width' : 20,
					'height' : 20
				},
				'sr' : {
					'width' : 30,
					'height' : 30	
				}
			},
			'delIconConf' : {//zee
				'l' : {
                'width' : 30,
                'height' : 30
                },
				'm' : {
					'width' : 12,
					'height' : 12
				},
				's' : {
					'width' : 9,
					'height' : 9
				},
				'sr' : {
					'width' : 11,
					'height' : 11
				}
			},
			'opacity' : 0.3,
			'isOnLine' : true
		},opts );
		/////just to test////////////////////////////////////////////////////////////////////////////
		//this.opts.url = 'userPhoto/100001/10000/a46da8de-eb49-41f3-8fba-27a414294629.jpg';
		/////////////////////////////////////////////////////////////////////////////////////////////
		return this.init();
	};
	
	Image.prototype = {

			'picUrlPrefix_' : picServerHost,  //the picture server url prefix
			'_staticColorCount' : 7,
			'staticColors' : {
				'color0' : '#008faf',
				'color1' : '#9ac6c7',
				'color2' : '#cae4e3',
				'color3' : '#577140', //zhangli modify #b8dbc5 ->#577140
				'color4' : '#5cb389',
				'color5' : '#f1bcb8',
				'color6' : '#b68c72' //zhangli modify #E9E5E5->#b68c72
			},

			'randomRGB' : function (){
				
				var	hashRoot = this.opts.hashColor,
					hashTotal = 0,
					aHex = [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'], 
		        	colorIndex = 0,rgb = '#',i;
		       
				if( hashRoot==null || hashRoot.length==0 ) {
					for( i = 0; i < 6; i++){
						colorIndex = Math.floor( Math.random()*16 );
						rgb += aHex[ colorIndex ];
					}
				}else{
					hashRoot = hashRoot + '';
					for( var i=0,len=hashRoot.length ; i<len ; i++ ) {
						hashTotal = hashTotal + hashRoot.charCodeAt( i );
					}
					hashTotal = hashTotal%this._staticColorCount;
					rgb = this.staticColors[ 'color'+hashTotal ];
				}
				return rgb;					
		    },
		    
		    'init' : function() {
		    	
		    	var	self= this,
                    opts = this.opts,
                    imageDom = null,
                    imageUrl = opts.urlPrefix? this.picUrlPrefix_+opts.picLevel+'_' : '',
                    imgConf = opts.picLevelConf[opts.picLevel],
                    imageContainer = document.createElement( 'span');
		    	imageContainer.className = 'crm-image-show-client';
		    	imageContainer.style.width = imgConf.width + 'px';
		    	imageContainer.style.height = imgConf.height + 'px';
		    	imageContainer.style.lineHeight = imgConf.height + 'px';
		    	if( opts.url && opts.url.length>0 ) {
                    /*var err = 'this.src=\'' + self.picUrlPrefix_ + opts.url + '\'',
                        imgTpl = '<img src="' + imageUrl + opts.url +'" onerror="' + err + '" />';
                    imageDom = $(imgTpl);
                    imageDom.css({
                        width:imgConf.width,
                        height:imgConf.height
                    });
                     imageDom.attr( 'data-userId' , opts.id||'' );
                     imageContainer.appendChild( imageDom[0] );
                     */

		    		imageDom = document.createElement( 'img' );
		    		imageDom.setAttribute( 'src' , imageUrl + opts.url );
		    		imageDom.setAttribute( 'data-userId' , opts.id||'' );
		    		imageDom.style.width = imgConf.width + 'px';
		    		imageDom.style.height = imgConf.height + 'px';
                    $(imageDom).one('error',function(e) {//修复头像缩略图图片不存在 zee
                         $(this).attr("src", self.picUrlPrefix_ + opts.url);
                    });
		    		imageContainer.appendChild( imageDom );

                }else if( opts.name ){

		    		imageContainer.innerHTML = opts.name.charAt('0');
		    		imageContainer.style.backgroundColor = opts.color || this.randomRGB();
		    	}
		    	imageContainer.setAttribute( 'data-userId' , opts.id||'' );
		    	if( !opts.isOnLine ) {
		    		imageContainer.style.opacity = opts.opacity;
		    	}
                if(opts.hasDelIcon){//zee
                    var delImgContent = document.createElement( 'div'),delIcon = document.createElement( 'span'),delIconConfig = opts.delIconConf[opts.picLevel];//
                    delImgContent.className = 'client_image_hasDel';
                    delIcon.className = 'client_image_delete';
                    delIcon.setAttribute( 'username' , opts.name );
                    delIcon.style.width = delIconConfig.width + 'px';
                    delIcon.style.height = delIconConfig.height + 'px';
                    delImgContent.appendChild(imageContainer);
                    delImgContent.appendChild(delIcon);
                    return delImgContent;
                }
		    	return imageContainer;
		    }

	};
	
	Image.prototype.constructor = Image;
	return Image;
});