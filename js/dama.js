(function( $ ){
    'use strict';
    var Dama    =   function ( element, settings ) {
        this.$element  =  $( element );
        this.settings  =  settings;
        //console.log( this.settings );
        this.$element.addClass("container");
        this.$element.width( this.$element.height() )
        this.wParts    =  0;
		this.hParts    =  0;
		this.wGrid     =  [];
		this.hGrid     =  [];
        this.center    =  0;
        this.dragging  =  false;
    };	

    Dama.VERSION   =   '1.0.0';

    Dama.prototype =   {
        constructor: Dama,
        init : function () {
        	this.drawBoard();
        	this.drawParts();
        	this.dragDrop()
        },
        drawBoard : function () {
        	var parts    =  this.settings.parts * 2;
        	var color    =  'area1';
        	var width    =  0;
        	var height   =  0;
        	var tParts   =  parts * parts;
        	this.wParts  =  this.$element.width() / parts;
        	this.hParts  =  this.$element.height() / parts;

			for (var i = 0; i < parts; i++) {
				this.wGrid[i]  =  i+1;
				this.hGrid[i]  =  i+1;
			}

			//console.log(this.wGrid )

			var j = 0;
			var k = 0;
			var l = 0;
        	for( var i=0; i < tParts; i++) {
        		
        		if( i > 0) { color  =  color == 'area2' ? 'area1' : 'area2'; }

        		if( j == parts) {
        			color  =  color == 'area2' ? 'area1' : 'area2';
					j  =  0;
        		}

				var $div = $('<div />').addClass(color).addClass( 'area' ).attr({ 'index': i, 'h': this.hGrid[l], 'w': this.wGrid[k] }).css({ 'width' : this.wParts, 'height' : this.hParts});

				this.$element.append($div);

				j++;
				k++;				
				
				if (k >= parts) {
					k = 0;
					l++;
				}			

				
        	}
        },
        drawParts : function () {
        	
        	var i         =  0;
        	var j         =  0;
        	var height    =  this.hParts
        	var minor     =  16
        	var radius    =  height - minor;
        	var nParts    =  ( this.settings.parts - 1 ) * this.settings.parts;
        	var colorOne  =  this.settings.colorOne
        	var colorTwo  =  this.settings.colorTwo
        	var ignore    =  this.settings.parts * 2;
        	this.center   =  (height - radius) /  2;
        	var center    =  this.center;
        	//var _Dama     =  this;

        	this.$element.find( 'div.area2' ).each( function () {
        		if( nParts > i ) {
        			var $parts  =  $( '<div />' ).addClass( 'parts' ).attr({ 'b' : 1, 'locked' : true }).css({ 'z-index' : 100, 'margin-top' : center , 'border-color' : colorOne, 'background-color' : colorOne, 'border-radius' : radius, 'height' : height - minor, 'width' : height - minor });
        			$( this ).append( $parts );
        		}else {
        			if( j >= ignore ) {
	        			var $parts  =  $( '<div />' ).addClass( 'parts' ).attr({ 'b' : 2, 'locked' : true }).css({ 'z-index' : 100, 'margin-top' : center , 'border-color' : colorTwo, 'background-color' : colorTwo, 'border-radius' : radius, 'height' : height - minor, 'width' : height - minor });
	        			$( this ).append( $parts );
        			}
        			j++;
        		}
        		i++;
        	});
        },
        dragDrop : function () {
        	var $element  =  this.$element;
        	var dragging  =  this.dragging;
        	var height    =  this.hParts
        	var width     =  this.wParts
			var center    =  this.center;
        	$( 'div.parts' ).on( 'mousedown', function ( e ) {
				var d        =   $( this ).css({ 'z-index' : 200 });

                var drg_w  =  d.outerWidth();
                var pos_x  =  d.offset().left + drg_w - e.pageX;
                var pos_y  =  d.offset().top + drg_w - e.pageY;

        		dragging     =   true;
        		d.attr({ "locked" : 0 });        		
	            $( document ).on( 'mousemove', function ( i ) { 	            	
	            	if( dragging && d.attr( "locked" ) == 0 ) {


	            		var left  =  i.pageX + pos_x - drg_w;
	            		var top   =  i.pageY + pos_y - drg_w;
				        $( d ).offset({
				            'top'  : top, //i.pageY - (100 / width * 9),
				            'left' : left
				        });

				        $("body").find('div.area2').not( d ).each(function() {

				        	var p  =  $( this ).find( '.parts' );

				        	if( p.length < 1 ) {

	                        	var dTop   =  $( this ).offset().top;
	                        	var dLeft  =  $( this ).offset().left;

	                        	var dHeight  =  $( this ).height();
	                        	var dWidth   =  $( this ).width();

	                        	if( dLeft < left && ( dLeft + width ) < (left + width) && left - dLeft < dWidth ) {

	                        		if( dTop < top && ( top - dTop ) < dHeight ) {
										$( this ).addClass("bingo")
	                        		}else {
	                        			$( this ).removeClass("bingo")
	                        		}
	                        	}else {
	                        		$( this ).removeClass("bingo")
	                        	}

	                        }

				        });

 				    }
	            }).on( 'mouseup', function (e) {
	            	dragging  = true;
	            	d.attr({ "locked" : true });
	            })
	            e.preventDefault();
			}).on( 'mouseup', function () {

				var $drop   =  $('.bingo');
				var append  =  false;
				var $e      =  $(this);

				var ih   =  parseInt( $e.parent().attr('h') );
				var iw   =  parseInt( $e.parent().attr('w') );
				var b    =  $e.attr( 'b' );

				var nih      =  parseInt( $drop.attr('h') );
				var niw      =  parseInt( $drop.attr('w') );

				//console.log("IH: " + ih);
				//console.log("IW: " + iw);

				//console.log("NIH: " + nih);
				//console.log("NIW: " + niw);


				if ( b == 1 && nih == ( ih + 1) ) {					
					if (niw - iw == 1 || niw - iw == -1 ) {
						append  =  true;
					}
				} else if (b == 2 && nih == (ih - 1)) {
					if (niw - iw == 1 || niw - iw == -1) {
						append = true;
					}
				}else if( b == 2 && nih == (ih - 2) ) {

					if( iw < niw )
						var $div =  $( '.area[w='+(niw-1)+'][h='+(nih+1)+'] > .parts[b=1]' );
					else
						var $div =  $( '.area[w='+(niw+1)+'][h='+(nih+1)+'] > .parts[b=1]' );

					if( $div.length > 0 ) {
						$div.remove();
						append  =  true;
					}
				}else if( b == 1 && nih == (ih + 2) ) {

					if( iw < niw )
						var $div =  $( '.area[w='+(niw-1)+'][h='+(nih-1)+'] > .parts[b=2]' );
					else
						var $div =  $( '.area[w='+(niw+1)+'][h='+(nih-1)+'] > .parts[b=2]' );

					if( $div.length > 0 ) {
						$div.remove();
						append  =  true;
					}
				}


				if ( append ) {
					$drop.append($e.css({ 'z-index': 100 }));
				}
            	
				$e.css({ 'left' : '0px', 'top' : '0px' }).addClass("animation");
      			$drop.removeClass( 'bingo' );
				dragging  =  true;
				
				setTimeout( function () {
					$e.removeClass( "animation" );
				}, 800);
            });

        }

    }

    $.fn.dama = function( options ) {
	  
	  	var defaults = {
	      	parts : 5,
	      	colorOne : '#fcf814',
	      	colorTwo : '#f70909'
	  	}

     	var settings  =  $.extend({}, defaults, options);
	        return this.each(function() {
	            var dama = new Dama( this, settings);
	            // do a loose comparison with null instead of !options; !0 == true
	            if (settings != null || typeof settings === 'object')
	                dama.init();
	            else
	            	console.log("Erro: Nothing action");
	        });
    	};

})( jQuery );