(function( $ ){
    'use strict';
    var Dama    =   function ( element, settings ) {
        this.$element  =  $( element );
        this.settings  =  settings;
        //console.log( this.settings );
        this.$element.addClass("container");
        this.$element.width( this.$element.height() );
        this.parts     =  0;
        this.wParts    =  0;
		this.hParts    =  0;
		this.wGrid     =  [];
		this.hGrid     =  [];
        this.center    =  0;
        this.dragging  =  false;
	};
	
	function onlyUnique(value, index, self) {
		return self.indexOf(value) === index;
	}

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
        	this.parts   =  parts;
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
        			var $parts  =  $( '<div />' ).addClass( 'parts' ).attr({ 'b' : 1, 'isDama' : false, 'locked' : true }).css({ 'z-index' : 100, 'margin-top' : center , 'border-color' : colorOne, 'background-color' : colorOne, 'border-radius' : radius, 'height' : height - minor, 'width' : height - minor });
        			$( this ).append( $parts );
        		}else {
        			if( j >= ignore ) {
	        			var $parts  =  $( '<div />' ).addClass( 'parts' ).attr({ 'b' : 2, 'isDama' : false, 'locked' : true }).css({ 'z-index' : 100, 'margin-top' : center , 'border-color' : colorTwo, 'background-color' : colorTwo, 'border-radius' : radius, 'height' : height - minor, 'width' : height - minor });
	        			$( this ).append( $parts );
        			}
        			j++;
        		}
        		i++;
        	});
        },
        dragDrop : function () {
        	var parts     =  this.parts;
        	var $element  =  this.$element;
        	var dragging  =  this.dragging;
        	var height    =  this.hParts
        	var width     =  this.wParts
			var center    =  this.center;
			var eDama     =  this;
			var ahahah    =  { 'h' : [], 'w' : []};
			var d         =  '';

			$('div.parts').off('mousedown').on( 'mousedown', function ( e ) {
				ahahah.h = [];
				ahahah.w = [];

				ahahah.h.push( parseInt( $(this).parent().attr('h') ) );
				ahahah.w.push( parseInt( $(this).parent().attr('w') ) );
				d        =   $( this ).css({ 'z-index' : 200 });

				var type   =  d.attr("b");

                var drg_w  =  d.outerWidth();
                var pos_x  =  d.offset().left + drg_w - e.pageX;
                var pos_y  =  d.offset().top + drg_w - e.pageY;

        		dragging     =   true;
        		d.attr({ "locked" : 0 });        		
				$(document).on( 'mousemove', function ( i ) {

	            	if( dragging && d.attr( "locked" ) == 0 ) {
	            		var left  =  i.pageX + pos_x - drg_w;
	            		var top   =  i.pageY + pos_y - drg_w;
				        $( d ).offset({
				            'top'  : top, //i.pageY - (100 / width * 9),
				            'left' : left
				        });

				        $("body").find('div.area2').each(function() {						
				        	var p  =  $( this ).find( '.parts' );
				        	var l  =  ahahah.h.length;

                        	var dTop   =  $( this ).offset().top;
                        	var dLeft  =  $( this ).offset().left;

                        	var dHeight  =  $( this ).height();
                        	var dWidth   =  $( this ).width();	   

				        	if( p.length < 1 ) {                   
	                        	if( dLeft < left && ( dLeft + width ) < (left + width) && left - dLeft < dWidth ) {
	                        		l  -= 1;
	                        		if( dTop < top && ( top - dTop ) < dHeight ) {										
										if (ahahah.h[l] != parseInt( $(this).attr('h') ) && ahahah.w[l] != parseInt( $(this).attr('w') ) ) {
											ahahah.h.push( parseInt( $(this).attr('h') ) );
											ahahah.w.push( parseInt( $(this).attr('w') ) );
										}
										$( this ).addClass("bingo");
	                        		}else {
	                        			$( this ).removeClass("bingo");
	                        		}
	                        	}else {
	                        		$( this ).removeClass("bingo")
	                        	}

	                        }else if( l > 2 && type == 2 && p.attr( "b" ) == 2 && p.attr( "h" ) == d.attr( "h" ) && p.attr( "w" ) == d.attr( "w" ) ) {
                        		if( dLeft < left && ( dLeft + width ) < (left + width) && left - dLeft < dWidth ) {
                        			l  -= 1;
	                        		if( dTop < top && ( top - dTop ) < dHeight ) {
										if (ahahah.h[l] != parseInt( $(this).attr('h') ) && ahahah.w[l] != parseInt( $(this).attr('w') ) ) {
											ahahah.h.push( parseInt( $(this).attr('h') ) );
											ahahah.w.push( parseInt( $(this).attr('w') ) );
										}	                        			
										$( this ).addClass("bingo");
	                        		}else {
	                        			$( this ).removeClass("bingo");
	                        		}
                        		}                  		
                        	}else if( l > 2 && type == 1 && p.attr( "b" ) == 1 && p.attr( "h" ) == d.attr( "h" ) && p.attr( "w" ) == d.attr( "w" ) ) {
                        		if( dLeft < left && ( dLeft + width ) < (left + width) && left - dLeft < dWidth ) {
                        			l  -= 1;
	                        		if( dTop < top && ( top - dTop ) < dHeight ) {
										if (ahahah.h[l] != parseInt( $(this).attr('h') ) && ahahah.w[l] != parseInt( $(this).attr('w') ) ) {
											ahahah.h.push( parseInt( $(this).attr('h') ) );
											ahahah.w.push( parseInt( $(this).attr('w') ) );
										}	                        			
										$( this ).addClass("bingo");
	                        		}else {
	                        			$( this ).removeClass("bingo");
	                        		}
                        		}                  		
                        	}

                        	//console.log( "QTD: ", ahahah.h.length );

				        });

 				    }
	            }).on( 'mouseup', function (e) {
	            	dragging  = true;
					d.attr({ "locked" : true });
					$(document).off('mousemove');
					$(document).off('mouseup');
	            })
	            e.preventDefault();
			}).off('mouseup').on( 'mouseup', function () {

				var $e        =  $( this );
				var $drop     =  $( '.bingo' );
				var toDelete  =  { 'h' : [], 'w' : []};
				var response  =  false;
				var append    =  false;

				var nh1       =  parseInt( $e.parent().attr('h') );
				var nw1       =  parseInt( $e.parent().attr('w') );
				var b         =  $e.attr( 'b' );
				var db        =  b == 1 ? 2 : 1;

				var nh2       =  parseInt( $drop.attr('h') );
				var nw2       =  parseInt( $drop.attr('w') );

				dragging      =  true;

				if( $drop.length != 1 ) {
					append = false;
				}else if ( b == 1 && nh2 == ( nh1 + 1) && ahahah.h.length == 2 ) {				
					if (nw2 - nw1 == 1 || nw2 - nw1 == -1 ) {
						append  =  true;
					}
				} else if (b == 2 && nh2 == (nh1 - 1) && ahahah.h.length == 2 ) {
					if (nw2 - nw1 == 1 || nw2 - nw1 == -1) {
						append = true;
					}
				}else if( ahahah.h.length > 1 ) {
					for( var i = 1; i < ahahah.h.length; i++) {

						if( b == 2 ) {
							response  =  eDama.captureB1( ahahah.h[i-1], ahahah.w[i-1], ahahah.h[i], ahahah.w[i], i);
						}else {
							response  =  eDama.captureB2( ahahah.h[i-1], ahahah.w[i-1], ahahah.h[i], ahahah.w[i], i);
						}

						if( typeof response == 'object' ) {
							toDelete.h.push(response.h[0]);
							toDelete.w.push(response.w[0]);
							append  =  true;
						}else {
							append  =  false;
							break;
						}
					}
				}

				if ( append ) {
					for( var i = 0; i < toDelete.h.length; i++) {
						var h =  toDelete.h[i];
						var w =  toDelete.w[i];
						$( '.area[w='+w+'][h='+h+'] > .parts[b='+db+']' ).remove();
					}

					console.log( $e.attr( 'isdama' ) );

					//Checks if is Dama
					if( b == 1 && nh2 == parts && $e.attr( 'isdama' ) == 'false' ) {
						$e.addClass( 'dama' ).attr({ 'isdama' : true });
					}else if( b == 2 && nh2 == 1 && $e.attr( 'isdama' ) == 'false' ) {
						$e.addClass( 'dama' ).attr({ 'isdama' : true });
					}

					console.log( nh2 );
					console.log( parts );

					$drop.append($e.css({ 'z-index': 100 }));
				}



				$e.css({ 'z-index': 100, 'left' : '0px', 'top' : '0px' }).addClass("animation");
      			$drop.removeClass( 'bingo' );
				
				setTimeout( function () {
					$e.removeClass( "animation" );
				}, 500);

				/*
				var $e = $(this);
				var toDelete  =  [];
				console.log( ahahah );
				//console.log( ahahah.h.filter( onlyUnique ) );
				//console.log(ahahah.w.filter(onlyUnique));

				var $drop   =  $('.bingo');
				var append  =  false;
				

				var ih   =  parseInt( $e.parent().attr('h') );
				var iw   =  parseInt( $e.parent().attr('w') );
				var b    =  $e.attr( 'b' );

				var nih      =  parseInt( $drop.attr('h') );
				var niw      =  parseInt( $drop.attr('w') );

				//console.log("IH: " + ih);
				//console.log("IW: " + iw);

				//console.log("NIH: " + nih);
				//console.log("NIW: " + niw);


				if ( b == 1 && nih == ( ih + 1) && ahahah.h.length <= 2 ) {				
					if (niw - iw == 1 || niw - iw == -1 ) {
						append  =  true;
					}
				} else if (b == 2 && nih == (ih - 1)  && ahahah.h.length <= 2) {
					if (niw - iw == 1 || niw - iw == -1) {
						append = true;
					}
				}else if( b == 2 && nih == (ih - 2)  && ahahah.h.length <= 2 ) {

					if( iw < niw )
						var $div =  $( '.area[w='+(niw-1)+'][h='+(nih+1)+'] > .parts[b=1]' );
					else
						var $div =  $( '.area[w='+(niw+1)+'][h='+(nih+1)+'] > .parts[b=1]' );

					if( $div.length > 0 ) {
						$div.remove();
						append  =  true;
					}
				}else if( b == 1 && nih == (ih + 2) && ahahah.h.length <= 2 ) {

					if( iw < niw )
						var $div =  $( '.area[w='+(niw-1)+'][h='+(nih-1)+'] > .parts[b=2]' );
					else
						var $div =  $( '.area[w='+(niw+1)+'][h='+(nih-1)+'] > .parts[b=2]' );

					if( $div.length > 0 ) {
						$div.remove();
						append  =  true;
					}
				
				}else if( b == 1 ) {
					

					for( var i = 0; i < ahahah.h.length; i++) {
						if( ahahah.h[i] == (ih+2) && i == 0 ) {
							if( iw < ahahah.w[i] )
								toDelete[i]  =  '.area[w='+(ahahah.w[i]-1)+'][h='+(ahahah.h[i]-1)+'] > .parts[b=2]';
							else
								toDelete[i]  =  '.area[w='+(ahahah.w[i]+1)+'][h='+(ahahah.h[i]-1)+'] > .parts[b=2]';

							if( $( toDelete[i] ).length > 0 ) {
								append  =  true;
							}else {
								append  =  false;
								break;
							}

						}else {

							var j = i-1;

							if( ahahah.h[i] == (ahahah.h[j]+2) ) {
								if( ahahah.w[j] < ahahah.w[i] ) {
									toDelete[i]  =  '.area[w='+(ahahah.w[i]-1)+'][h='+(ahahah.h[i]-1)+'] > .parts[b=2]';
									console.log( "MENORRRR" );
								}else {
									toDelete[i]  =  '.area[w='+(ahahah.w[i]+1)+'][h='+(ahahah.h[i]-1)+'] > .parts[b=2]';
									console.log( "MAIORRRRR" );
								}

								if( $( toDelete[i] ).length > 0 ) {
									append  =  true;
								}else {
									append  =  false;
									break;
								}
							}else if( ahahah.h[j] == (ahahah.h[i] + 2) ) {								

								if( ahahah.w[j] < ahahah.w[i] )
									toDelete[i]  =  '.area[w='+(ahahah.w[j]+1)+'][h='+(ahahah.h[j]-1)+'] > .parts[b=2]';
								else
									toDelete[i]  =  '.area[w='+(ahahah.w[j]-1)+'][h='+(ahahah.h[j]-1)+'] > .parts[b=2]';

								if( $( toDelete[i] ).length > 0 ) {
									append  =  true;
								}else {
									append  =  false;
									break;
								}

							}

						}

					}

				}else if( b == 2 ) {			

					for( var i = 0; i < ahahah.h.length; i++) {
						if( ahahah.h[i] == (ih-2) && i == 0 ) {

							if( iw < ahahah.w[i] ){
								toDelete[i]  =  '.area[w='+(ahahah.w[i]-1)+'][h='+(ahahah.h[i]+1)+'] > .parts[b=1]';
								console.log("MENOR");
							}
							else{
								toDelete[i]  =  '.area[w='+(ahahah.w[i]+1)+'][h='+(ahahah.h[i]+1)+'] > .parts[b=1]';
								console.log('.area[w='+(ahahah.w[i]+1)+'][h='+(ahahah.h[i]+1)+'] > .parts[b=1]');
							}

							if( $( toDelete[i] ).length > 0 ) {
								append  =  true;
							}else {
								append  =  false;
								//console.log("NÃOOOO" + ( '.area[w='+(ahahah.w[i]+1)+'][h='+(ahahah.h[i]-1)+'] > .parts[b=1]' ));
								break;
							}
						}else {
							var j = i-1;

							if( ahahah.h[i] == (ahahah.h[j]-2) ) {
								if( ahahah.w[j] < ahahah.w[i] ) {
									toDelete[i]  =  '.area[w='+(ahahah.w[i]-1)+'][h='+(ahahah.h[i]+1)+'] > .parts[b=1]';
									//console.log("MENOR");
								}else {
									toDelete[i]  =  '.area[w='+(ahahah.w[i]+1)+'][h='+(ahahah.h[i]+1)+'] > .parts[b=1]';
									//console.log("MAIOR");
								}

								if( $( toDelete[i] ).length > 0 ) {
									append  =  true;
								}else {
									append  =  false;
									break;
								}
							}else if( ahahah.h[j] == (ahahah.h[i] - 2) ) {								

								if( ahahah.w[j] < ahahah.w[i] )
									toDelete[i]  =  '.area[w='+(ahahah.w[j]+1)+'][h='+(ahahah.h[j]+1)+'] > .parts[b=1]';
								else
									toDelete[i]  =  '.area[w='+(ahahah.w[j]-1)+'][h='+(ahahah.h[j]+1)+'] > .parts[b=1]';

								if( $( toDelete[i] ).length > 0 ) {
									append  =  true;
								}else {
									append  =  false;
									break;
								}

							}
						}
					}
				}

				//var l = ahahah.h.length -1;

				//if( ahahah.h[l] != nih || ahahah.w[l] != niw ) {
				//	append = false;
				//}

				for (var i = 0; i < ahahah.h.length -1; i++) {
					if( i > 0 ) {

					}else {
						if( b == 2 ) {

							if( ih < nih && iw < niw ) {

							}

						}

ih
iw

					}
				}


				if( append ) {
					for( var i = 0; i < toDelete.length; i++) {
						$( toDelete[i] ).remove();
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

				if ( d == $e ) {
					ahahah.h = [];
					ahahah.w = [];
				}
				*/		

            });

        },
        captureB1 : function ( n1, w1, n2, w2, i ) {

        	//Indice to delete
        	var delh    =  0;
        	var delw    =  0;
        	var exists  =  false;


        	if( n1-2 == n2 && w1-2 == w2 ) {
	        	/**
	        	 * Capturando diagonal esquerda
	        	 */

        		//Determine position for capture B1
	        	delh   =  (n1-1);
	        	delw   =  (w1-1);

	        	//Check if B1 exists in corrdenade
        		exists =  this.findCapture(delw, delh, 1);

        		//Exists ?
        		if( exists ) {
        			return { 'h' : [delh], 'w' : [delw]};
        		}else {
        			return false;
        		}

        	}else if( n1-2 == n2 && w1+2 == w2 ) {
	        	/**
	        	 * Capturando diagonal direita
	        	 */

        		//Determine position for capture B1
	        	delh   =  (n1-1);
	        	delw   =  (w1+1);

	        	//Check if B1 exists in corrdenade
        		exists =  this.findCapture(delw, delh, 1);

        		//Exists ?
        		if( exists ) {
        			return { 'h' : [delh], 'w' : [delw]};
        		}else {
        			return false;
        		}
        		
        	}else if( i > 2 ) {

        		if( n1+2 == n2 && w1-2 == w2 ) {
		        	/**
		        	 * Capturando diagonal esquerda (Sequencial)
		        	 */

	        		//Determine position for capture B1
		        	delh   =  (n1+1);
		        	delw   =  (w1-1);

		        	//Check if B1 exists in corrdenade
	        		exists =  this.findCapture(delw, delh, 1);

	        		//Exists ?
	        		if( exists ) {
	        			return { 'h' : [delh], 'w' : [delw]};
	        		}else {
	        			return false;
	        		}

        		}else if( n1+2 == n2 && w1+2 == w2 ) {
	        		/**
		        	 * Capturando diagonal esquerda -> direita (Sequencial de cima para baixo)
		        	 */        			
	        		//Determine position for capture B1
		        	delh   =  (n1+1);
		        	delw   =  (w1+1);

		        	//Check if B1 exists in corrdenade
	        		exists =  this.findCapture(delw, delh, 1);

	        		//Exists ?
	        		if( exists ) {
	        			return { 'h' : [delh], 'w' : [delw]};
	        		}else {
	        			return false;
	        		}

        		}else {
        			return false;
        		}

        	}else {

        		return false;

        	}

        }, 
        captureB2 : function ( n1, w1, n2, w2, i ) {

        	//Indice to delete
        	var delh    =  0;
        	var delw    =  0;
        	var exists  =  false;

    		if( n1+2 == n2 && w1-2 == w2 ) {
	        	/**
	        	 * Capturando diagonal esquerda
	        	 */

        		//Determine position for capture B2
	        	delh   =  (n1+1);
	        	delw   =  (w1-1);

	        	//Check if B2 exists in corrdenade
        		exists =  this.findCapture(delw, delh, 2);

        		//Exists ?
        		if( exists ) {
        			return { 'h' : [delh], 'w' : [delw]};
        		}else {
        			return false;
        		}

    		}else if( n1+2 == n2 && w1+2 == w2 ) {
        		/**
	        	 * Capturando diagonal direita
	        	 */        			
        		//Determine position for capture B2
	        	delh   =  (n1+1);
	        	delw   =  (w1+1);

	        	//Check if B2 exists in corrdenade
        		exists =  this.findCapture(delw, delh, 2);

        		//Exists ?
        		if( exists ) {
        			return { 'h' : [delh], 'w' : [delw]};
        		}else {
        			return false;
        		}

        	}else if( i > 2 ) {

	        	if( n1-2 == n2 && w1-2 == w2 ) {
		        	/**
		        	 * Capturando diagonal esquerda
		        	 */

	        		//Determine position for capture B1
		        	delh   =  (n1-1);
		        	delw   =  (w1-1);

		        	//Check if B1 exists in corrdenade
	        		exists =  this.findCapture(delw, delh, 2);

	        		//Exists ?
	        		if( exists ) {
	        			return { 'h' : [delh], 'w' : [delw]};
	        		}else {
	        			return false;
	        		}

	        	}else if( n1-2 == n2 && w1+2 == w2 ) {
		        	/**
		        	 * Capturando diagonal direita
		        	 */

	        		//Determine position for capture B1
		        	delh   =  (n1-1);
		        	delw   =  (w1+1);

		        	//Check if B1 exists in corrdenade
	        		exists =  this.findCapture(delw, delh, 2);

	        		//Exists ?
	        		if( exists ) {
	        			return { 'h' : [delh], 'w' : [delw]};
	        		}else {
	        			return false;
	        		}
	        		
	        	}else {
    				return false;
    			}

    		}else {
    			return false;
    		}
        },
        findCapture :  function ( w, h, bn ) {

        	return $( '.area[w='+w+'][h='+h+'] > .parts[b='+bn+']' ).length == 1 ? true : false;

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