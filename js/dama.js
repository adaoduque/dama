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
    };	

    Dama.VERSION   =   '1.0.0';

    Dama.prototype =   {
        constructor: Dama,
        init : function () {
        	this.drawBoard();
        	this.drawParts();
        },
        drawBoard : function () {
        	var parts    =  this.settings.parts * 2;
        	var color    =  'area1';
        	var width    =  0;
        	var height   =  0;
        	var tParts   =  parts * parts;
        	this.wParts  =  this.$element.width() / parts;
        	this.hParts  =  this.$element.height() / parts;

        	var j = 0;
        	for( var i=0; i < tParts; i++) {
        		
        		if( i > 0)
        			color  =  color == 'area2' ? 'area1' : 'area2';

        		if( j == parts) {
        			color  =  color == 'area2' ? 'area1' : 'area2';
        			j  =  0;
        		}

        		var $div  =  $( '<div />' ).addClass( color ).css({ 'width' : this.wParts, 'height' : this.hParts});
        		this.$element.append( $div );
        		j++;
        	}
        },
        drawParts : function () {
        	
        	var i         =  0;
        	var j         =  0;
        	var radius    =  this.hParts;
        	var nParts    =  ( this.settings.parts - 1 ) * this.settings.parts;
        	var colorOne  =  this.settings.colorOne
        	var colorTwo  =  this.settings.colorTwo
        	var ignore    =  this.settings.parts * 2;

        	console.log( ignore )

        	this.$element.find( 'div.area2' ).each( function () {
        		if( nParts > i ) {
        			var $parts  =  $( '<div />' ).addClass( 'parts' ).css({ 'background-color' : colorOne, 'border-radius' : radius, 'height' : $( this ).height(), 'width' : $( this ).height() });
        			$( this ).append( $parts );        			
        		}else {
        			if( j >= ignore ) {
	        			var $parts  =  $( '<div />' ).addClass( 'parts' ).css({ 'background-color' : colorTwo, 'border-radius' : radius, 'height' : $( this ).height(), 'width' : $( this ).height() });
	        			$( this ).append( $parts );
        			}

        			j++;
        		}

        		i++;

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