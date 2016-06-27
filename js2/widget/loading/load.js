define(['widget/promptbox/promptbox'],function( Promptbox ) {
	/*
	*loadLevel : 'l' , 'm' , 's'
	*/
	var Load = function( container , loadLevel , isFullScreen , isNoTimeout ,useShade, stopPropagation ) {
		
		this.$container = $(container);
		this.$load=null;
//        this.isNoTimeout = isNoTimeout || false;
		this.isFullScreen = isFullScreen || false;
		this.loadLevel = loadLevel || 's';
		this.timeout = '30000';
        this.stopPropagation = stopPropagation || true;
        this.useShade = useShade||false;//zee
//		this.timeoutId = '';
		this.init();
	};

	Load.prototype.LoadHtm = '<div class="loading-{loadLevel}"></div>';
	Load.prototype.shadeHtml = '<div id="create_client_contacts_screen"></div>';
	Load.prototype.init = function() {
        if(this.useShade){//zee
            this.LoadHtm = this.shadeHtml + this.LoadHtm
        }
		var	$load = $( this.LoadHtm.replace( /{loadLevel}/g , this.loadLevel ) ),
				self = this;

		$load.css( {
			'position' : 'absolute',
			'left' : 0,
			'top' : 0,
			'right' :0,
			'bottom' : 0
		} );

        try{
            if( this.isFullScreen ) {
                $('body').append( $load );
            }else{
                this.$container.append( $load );
            }
            this.$load = $load;
            this.bindEvent();
        }catch(e){
            debug.log(e);
        }
	};

    Load.prototype.bindEvent = function(){
        var self = this;
        self.$load.on("click" , function ( e ) {
            if( self.stopPropagation ){
                e.stopPropagation();
            }
        })
    }
	Load.prototype.destroy = function() {
		if(this.$load) {
			this.$load.off().remove();
        }
		this.$load = null;
		this.$container = null;
//		clearTimeout( this.timeoutId );
	};
	return Load;
});