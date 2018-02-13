(function( $ ){

    // :)
    'use strict';

    //Element drag
    var elementVolumeDrag   =  false;

    var elementVideoDrag    =  false;

    var videoExe            =  false;

    var statusFullScreen    =  false;

    var timeMoveMouse       =  0;

    var timeCurrent         =  new Date();

    function secondsToTime( seconds ) {

        var time     =   new Date( 1970, 0, 1 );

        time.setSeconds( seconds );

        var seconds  =   time.toTimeString().substr(0,8);

        seconds      =   seconds > 86399  ? Math.floor((time - Date.parse("1/1/70")) / 3600000) + seconds.substr(2) : Math.floor((time - Date.parse("1/1/70")) / 3600000) + seconds.substr(4);
        
        return seconds;

    };


    function setDelayMouseMove( value ) {

        timeMoveMouse     =    value;        

    }        


    function getDelayMouseMove( value ) {

        return Math.round(+new Date()/1000) - timeMoveMouse;
        
    }


    function setStatusFullScreen( value ) {
        statusFullScreen =  value;
    }

    function getStatusFullScreen() {
        return statusFullScreen;
    }

    function setVideoExec( value ) {
        videoExe =  value;
    }

    function getVideoExec() {
        return videoExe;
    }

    function getDurationElement( elemMidia ) {

        return elemMidia.duration;

    };

    function getCurrentTimeElement( elemMidia ) {
            
        return elemMidia.currentTime;

    };


    function setDurationForElemenMidia( elem, duration ) {
            
        elem.text( duration );

    };


    function setCurretTimeForElemenMidia( elem, currentTime ) {

        elem.text( currentTime );

    };


    function setElementVolumeToDrag( value ) {

        elementVolumeDrag   =  value;

    }


    function getElementVolumeToDrag() {

        return elementVolumeDrag;

    }


    function setElementVideoToDrag( value ) {

        elementVideoDrag   =  value;

    }


    function getElementVideoToDrag() {

        return elementVideoDrag;

    }  


    function detectBrowser() {

        // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
        var isOpera   =  !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

        // Firefox 1.0+
        var isFirefox =  typeof InstallTrigger !== 'undefined';   

        // At least Safari 3+: "[object HTMLElementConstructor]"
        var isSafari  = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
        
        // Chrome 1+
        var isChrome  =  !!window.chrome && !isOpera;    
        
        // At least IE6
        var isIE      =  /*@cc_on!@*/false || !!document.documentMode;

        if( isIE )
            return 1;
        else if( isChrome || isSafari )
            return 2;
        else if( isFirefox )
            return 3;
        else if( isOpera )
            return 4;
    }  


    var DuquePlayer    =   function ( element, options ) {

        this.$element            =   $( element );

        this.$options            =   options;

        this.bottomBar           =   null;

        this.topBar              =   null;

        this.elemMidia           =   null;

        this.$whichMidia         =   null;

        this.buttonLargePlay     =   null;

        this.buttonPlay          =   null;

        this.buttonPause         =   null;

        this.buttonStop          =   null;

        this.buttonNext          =   null;

        this.buttonPrev          =   null;

        this.buttonRestart       =   null;

        this.currentTime         =   null;

        this.timeEnd             =   null;

        this.contentVolume       =   null;

        this.pbVolume            =   null;

        this.pbVolumeAux         =   null;

        this.pbVolumeCursor      =   null;

        this.pbVideoCursor       =   null;

        this.pbVideo             =   null;

        this.pbVideoProgress     =   null;

        this.pbVideoBuffer       =   null;

        this.buttonFullScreeen   =   null;

        this.containerControlButton  =  null;

        //Expose publics methods
        this.play         =   DuquePlayer.prototype.play;

        this.pause        =   DuquePlayer.prototype.pause;

        this.stop         =   DuquePlayer.prototype.stop;

        this.restart      =   DuquePlayer.prototype.restart;

        this.fullScreen   =   DuquePlayer.prototype.fullScreen;

    };

    DuquePlayer.VERSION   =   '1.0.0';

    DuquePlayer.prototype =   {

        constructor: DuquePlayer,

        init : function () {

            this.create();

            this.getTimeForMidia();

            this.clickLargePlay();

            this.clickButtonPlay();

            this.clickButtonPause();

            this.getBufferVideo();

            this.setVideoProgress();

            this.setLevelVolume( .0 );

            this.fullScreen();

            this.changeFullScreen();

            //Events
            this.dragPBVideoCursor();

            this.dragPBVolumeCursor();

            this.setTimeVideoByClick();

            this.mouseOverVideo();

            this.mouseBottomBar();

            this.mouseMoveDocument();

        },
        create : function () {

            var video        =   $( '<video></video>' );

            var track        =   $( '<track default />' );

            var source       =   $( '<source />' );

            this.$whichMidia =   video;

            this.elemMidia   =   video.get( 0 ); 

            video.attr( 'preload', 'none' ).attr( 'autobuffer', 'false' );

            source.attr( 'src', this.$options.video ).attr( 'type', this.$options.type );

            track.attr( 'src', this.$options.track ).attr( 'king', 'subtitles' ).attr( 'srclang', 'en' ).attr( 'label', 'English' );

            video.append( source );

            video.append( track );

            this.$element.append( video );

            this.createBottomBar();

            this.createTopBar();

        },
        createBottomBar   :   function () {

            var bottomBar    =   $( '<div></div>' );

            bottomBar.addClass( 'duqueVideo-bottomBar' ).addClass( 'duqueVideo-bottomBar-larger' );

            this.bottomBar   =   bottomBar;

            this.createControls();

            this.$element.append( this.bottomBar );

        },
        createTopBar      :   function () {
           
            var topBar    =   $( '<div></div>' );

            topBar.addClass( 'duqueVideo-topBar' );

            this.topBar   =   topBar;

            this.setTextTopBar();

            this.$element.append( this.topBar );

        },
        createControls : function () {
            
            var containerLargePlay    =   $( '<div></div>' );
            
            var container     =   $( '<div></div>' );            

            var play          =   $( '<div></div>' );            

            var largePlay     =   $( '<div></div>' );

            var pause         =   $( '<div></div>' );

            var next          =   $( '<div></div>' );

            var prev          =   $( '<div></div>' );

            var fullScreen    =   $( '<div></div>' );

            var restart       =   $( '<div></div>' );

            var currentTime   =   $( '<div>00:00</div>' );

            var timeEnd       =   $( '<div>00:00</div>' );

            containerLargePlay.addClass( 'duqueVideo-play' );

            container.addClass( 'duquePlayer-container-controls' );

            play.addClass( 'duqueVideo-control-play' );        

            largePlay.addClass( 'arrow-right' );    

            pause.addClass( 'duqueVideo-control-pause' );

            next.addClass( 'duqueVideo-control-prev' );

            prev.addClass( 'duqueVideo-control-next' );

            fullScreen.addClass( 'duqueVideo-control-fullScreen' );   

            restart.addClass( 'button-restart' );         

            currentTime.addClass( 'duqueVideo-current-Time' );

            timeEnd.addClass( 'duqueVideo-duration-Time' );

            containerLargePlay.append( largePlay );

            container.append( play );

            container.append( pause );

            container.append( prev );

            container.append( next );

            this.bottomBar.append( container );

            this.bottomBar.append( fullScreen );

            this.bottomBar.append( currentTime );

            this.bottomBar.append( timeEnd );

            this.$element.append( containerLargePlay );

            this.buttonPlay         =   play;

            this.buttonPause        =   pause;

            this.buttonStop         =   stop;

            this.buttonRestart      =   restart;

            this.buttonNext         =   next;

            this.buttonPrev         =   prev;

            this.buttonFullScreeen  =   fullScreen;

            this.buttonLargePlay    =   largePlay;            

            this.currentTime        =    currentTime;

            this.timeEnd            =    timeEnd;

            this.containerControlButton  =  container;

            this.createProgressBars();

        },
        createProgressBars  :  function () {

            var contentVolume       =   $( '<div></div>' );

            var pbVideo             =   $( '<div></div>' );

            var pbVideoCursor       =   $( '<div></div>' );

            var videoTimeCurrent    =   $( '<div></div>' );

            var bufferVideo         =   $( '<div></div>' );

            var volumeBar           =   $( '<div></div>' );

            var volumeBarAux        =   $( '<div></div>' );

            var volumeCursor        =   $( '<div></div>' );

            contentVolume.addClass( 'duqueVideo-volume-content' );

            pbVideo.addClass( 'duqueVideo-progress' );

            pbVideoCursor.addClass( 'duqueVideo-cursor-seek' );

            videoTimeCurrent.addClass( 'duqueVideo-progress-bar-style' );

            bufferVideo.addClass( 'duqueVideo-buffered' );

            volumeBar.addClass( 'duqueVideo-volume-bar' );

            volumeBarAux.addClass( 'duqueVideo-volume-bar-aux' );

            volumeCursor.addClass( 'duqueVideo-volume-cursor' );       

            contentVolume.append( volumeCursor );    

            contentVolume.append( volumeBarAux );

            contentVolume.append( volumeBar );

            pbVideo.append( pbVideoCursor );

            pbVideo.append( videoTimeCurrent );

            pbVideo.append( bufferVideo );

            this.bottomBar.append( pbVideo );

            this.bottomBar.append( contentVolume );

            this.pbVideoCursor     =   pbVideoCursor;

            this.pbVideo           =   pbVideo;

            this.pbVideoBuffer     =   bufferVideo;

            this.pbVideoProgress   =   videoTimeCurrent;

            this.contentVolume     =   contentVolume;

            this.pbVolume          =   volumeBar;

            this.pbVolumeAux       =   volumeBarAux;

            this.pbVolumeCursor    =   volumeCursor;

        }, setTextTopBar   :  function () {

            var textTopBar    =   $( '<div></div>' );

            textTopBar.addClass( 'duqueVideo-topBar-text' );

            textTopBar.text( this.$options.title );

            this.topBar.append( textTopBar );

        }, setCurrentTime     :   function ( valor ) {

            this.elemMidia.currentTime  =  valor;

        }, clickLargePlay : function () {

            $( this.buttonLargePlay ).click(( function () {

                this.buttonLargePlay.parent().addClass( 'effect-fade-out' );

                this.buttonPause.addClass( 'fade-in' );

                this.buttonPlay.addClass( 'fade-out' );

                this.play();

            }).bind( this ));

        }, clickButtonPlay : function () {

            $( this.buttonPlay ).click(( function () {

                this.buttonLargePlay.parent().addClass( 'effect-fade-out' );

                this.buttonPause.removeClass( 'fade-out' ).addClass( 'fade-in' );

                this.buttonPlay.removeClass( 'fade-in' ).addClass( 'fade-out' );

                this.play();

            }).bind( this ));

        }, clickButtonPause : function () {

            $( this.buttonPause ).click(( function () {

                this.buttonPause.removeClass( 'fade-in' ).addClass( 'fade-out' );

                this.buttonPlay.removeClass( 'fade-out' ).addClass( 'fade-in' );

                this.pause();

            }).bind( this ));

        }, dragPBVolumeCursor : function () {

            var pbVolume       =   this.pbVolume;

            var pbVolumeAux    =   this.pbVolumeAux;

            var volumeCursor   =   this.pbVolumeCursor;

            var update         =   this;

            var i = 0;

            $( volumeCursor ).on( 'mousedown', function ( e ) {                

                setElementVolumeToDrag( true );

                $( this ).addClass( 'draggable' );

                var drg_w   =   $( this ).outerWidth();

                var pos_x   =   $( this ).offset().left + drg_w - e.pageX;

                $( document ).on( 'mousemove', function ( e ) {

                    var left      =   e.pageX + pos_x - drg_w;

                    var leftPB    =   $( pbVolumeAux ).parent().offset().left - 2;

                    var rightPB   =   $( pbVolumeAux ).parent().offset().left + $( pbVolumeAux ).parent().width();  

                    if( left > leftPB && left < rightPB && getElementVolumeToDrag() ) {

                        var levelVolume   =   left - ( leftPB + 1 );

                        var volume        =   levelVolume.toFixed(2) / 100;

                        pbVolume.width( levelVolume );

                        update.setLevelVolume( volume );

                        $( '.draggable' ).offset({

                            left: left

                        }).on( 'mouseup', function () {

                            setElementVolumeToDrag( false );

                            $( volumeCursor ).removeClass( 'draggable' );

                        });

                    }                                      

                }).on( 'mouseup', function () {

                    setElementVolumeToDrag( false );

                    $( volumeCursor ).removeClass( 'draggable' );

                });

                e.preventDefault();                 

            }).on( 'mouseup', function () {

                setElementVolumeToDrag( false );

                $( volumeCursor ).removeClass( 'draggable' );

            });

        }, dragPBVideoCursor : function () {

            var pbVideoCursor  =  this.pbVideoCursor;

            var pbVideoProgress        =  this.pbVideoProgress;

            var update         =  this;

            $( pbVideoCursor ).on( 'mousedown', function ( e ) {

                setElementVideoToDrag( true );

                $( pbVideoCursor ).addClass( 'draggable' );

                var drg_w   =   $( pbVideoCursor ).outerWidth();

                var pos_x   =   $( pbVideoCursor ).offset().left + drg_w - e.pageX;   

                //$( '#teste' ).text( pos_x );

                $( document ).on( 'mousemove', function ( e ) {

                    var left      =   e.pageX + pos_x - drg_w;

                    var leftPB    =   $( pbVideoProgress ).parent().offset().left - 6;

                    var rightPB   =   $( pbVideoProgress ).parent().offset().left + $( pbVideoProgress ).parent().width() - 6;

                    if( left > leftPB && left < rightPB && getElementVideoToDrag() ) {

                        update.updateProgressBar( left + 7 );

                        $( '.draggable' ).offset({

                            left: left

                        }).on( 'mouseup', function () {

                            setElementVideoToDrag( false );

                            $( this ).removeClass( 'draggable' );

                            $( pbVideoCursor ).trigger( 'click' );

                        });

                    }                    

                }).on( 'mouseup', function () {

                    setElementVideoToDrag( false );

                    $( pbVideoCursor ).removeClass( 'draggable' );

                    $( pbVideoCursor ).trigger( 'click' );

                });

                e.preventDefault();

            }).on( 'mouseup', function () {

                setElementVideoToDrag( false );

                $( pbVideoCursor ).removeClass( 'draggable' );

                $( pbVideoCursor ).trigger( 'click' );

            });

        }, setTimeVideoByClick :   function () {

            var pbVideo           =   this.pbVideo;

            var pbVideoProgress   =   this.pbVideoProgress;

            var pbVideoCursor     =   this.pbVideoCursor;

            $( pbVideo ).on( 'click', function ( e ) {

                var offset     =   $( this ).offset().left;

                var newWidth   =   e.clientX - offset;

                var offset     =   e.pageX - 7;

                pbVideoProgress.width( newWidth );                

                $( pbVideoCursor ).offset({ left : offset });

            });

        }, getBufferVideo : function () {

            var buffer       =   this.elemMidia.buffered;

            var bufferValue  =   0;

            var tamBuffer    =   0;

            for (var i=  0; i < buffer.length; i++) bufferValue =  buffer.end( i );  

            tamBuffer        =   Math.floor((bufferValue / getDurationElement( this.elemMidia ) ) * 100 )

            tamBuffer        =   tamBuffer == 99 ?  tamBuffer + 1 : tamBuffer;

            this.pbVideoBuffer.css({ 'width' : tamBuffer + '%' });

            setTimeout(( function () { this.getBufferVideo() }).bind(this), 1);

        }, updateProgressBar :   function ( value ) {

            var width  =  value - this.pbVideoProgress.offset().left;

            this.pbVideoProgress.css({ 'width' : width });

        }, play :   function () {

            setVideoExec( true );

            this.elemMidia.play();

        }, pause       :   function () {

            setVideoExec( false );

            this.elemMidia.pause();
            
        }, stop        :   function () {

            setVideoExec( false );

            this.elemMidia.pause();

            this.setCurrentTime( 0 );

        }, setLevelVolume : function ( volume ) {

            this.elemMidia.volume = volume;

        }, setVideoProgress : function () {

            var video             =   this.elemMidia;

            var pbVideoProgress   =   this.pbVideoProgress;

            var pbVideoCursor     =   this.pbVideoCursor;

            $( video ).on('timeupdate', function () {

                var currentTime   =   getCurrentTimeElement( video );

                var duration      =   getDurationElement( video );

                pbVideoProgress.css({

                    width: Math.floor(( currentTime / duration ) * 100) + '%'

                });

                var left   =   $( pbVideoProgress ).offset().left + $( pbVideoProgress ).width() - 6;

                //$( '#teste' ).text( left );

                $( pbVideoCursor ).offset({ left : left });

            });            

        }, getTimeForMidia : function () {

            var elemMidia        =   this.elemMidia;

            var elemCurrentTime  =   this.currentTime;

            var elemTimeEnd      =   this.timeEnd;

            this.$whichMidia.on( 'loadeddata', function () {

                var duration     =   secondsToTime( getDurationElement( elemMidia ) );

                var currentTime  =   secondsToTime( getCurrentTimeElement( elemMidia ) );

                setDurationForElemenMidia( elemTimeEnd, duration );

                setCurretTimeForElemenMidia( elemCurrentTime, currentTime );

            });

        }, restart     :   function () {
            
        }, fullScreen  :   function () {   

            var elemMidia        =   this.elemMidia;         

            $( this.buttonFullScreeen ).on( 'click', function () {

                setStatusFullScreen( true );

                var userAgent  =   detectBrowser();

                if( userAgent == 1 )

                    elemMidia.msRequestFullscreen();

                else if( userAgent == 2 )

                    elemMidia.webkitRequestFullscreen();

                else if( userAgent == 3 )

                    elemMidia.mozRequestFullScreen();

                else if( userAgent == 4 )

                    elemMidia.requestFullscreen();

            });

        }, changeFullScreen : function () {

            var bottomBar       =   this.bottomBar;

            var topBar          =   this.topBar;

            var element         =   this.$element;

            var volumecontent   =   this.contentVolume;

            var pbVideo         =   this.pbVideo;

            $( document ).on( 'fullscreenchange webkitfullscreenchange mozfullscreenchange MSFullscreenChange', function () {

                if ( document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement ) {

                    setStatusFullScreen( true );

                    bottomBar.css( { 'z-index' : 9999999999 } );

                    topBar.css( { 'z-index' : 9999999999 } );

                    topBar.addClass( 'duqueVideo-topBar-fullscreen' );

                    volumecontent.addClass( 'duqueVideo-volume-content-fullscreen' );

                    pbVideo.addClass( 'duqueVideo-progress-fullscreen' );

                    $( 'body' ).append( bottomBar ).append( topBar );

                }else {

                    setStatusFullScreen( false );

                    topBar.removeClass( 'duqueVideo-topBar-fullscreen' );

                    volumecontent.removeClass( 'duqueVideo-volume-content-fullscreen' );

                    pbVideo.removeClass( 'duqueVideo-progress-fullscreen' );

                    element.append( bottomBar );   

                    element.append( topBar );

                }

            });

        }, mouseOverVideo : function () {

            var element         =   this.$element;

            var pbVideo         =   this.pbVideo;

            var pbVideoProgress =   this.pbVideoProgress

            var pbVideoBuffer   =   this.pbVideoBuffer

            var bottomBar       =   this.bottomBar;

            var timeCurrent     =   this.currentTime;

            var timeEnd         =   this.timeEnd;

            var pbVideoCursor   =   this.pbVideoCursor;

            var contentVolume   =   this.contentVolume;

            var fullScreen      =   this.buttonFullScreeen;

            var controlPlayer   =   this.containerControlButton;

            $( element ).on( 'mouseover', function () {     

                if( getVideoExec() && !getStatusFullScreen() ) {

                    $( bottomBar ).removeClass( 'duqueVideo-bottomBar-small' ).addClass( 'duqueVideo-bottomBar-larger' );
                    
                    $( bottomBar ).find( 'div' ).not( pbVideo ).not( pbVideoProgress ).not( pbVideoBuffer ).removeClass( 'hide-all' );  

                    pbVideoCursor.removeClass( 'hide-control-cursor-seek' );

                    timeCurrent.removeClass( 'hide-control-time' );

                    timeEnd.removeClass( 'hide-control-time' );

                    pbVideoCursor.removeClass( 'hide-control-time' );

                    contentVolume.removeClass( 'hide-control-volume' );

                    fullScreen.removeClass( 'hide-control-fullscreen' );

                    controlPlayer.removeClass( 'hide-control-player' );

                    pbVideo.removeClass( 'extend-duqueVideo-progress' );                                

                }  

            }).on( 'mouseleave', function () {

                if( getVideoExec() && !getStatusFullScreen() ) {

                    $( bottomBar ).removeClass( 'duqueVideo-bottomBar-larger' ).addClass( 'duqueVideo-bottomBar-small' );

                    pbVideoCursor.addClass( 'hide-control-cursor-seek' );

                    timeCurrent.addClass( 'hide-control-time' );

                    timeEnd.addClass( 'hide-control-time' );

                    pbVideoCursor.addClass( 'hide-control-time' );

                    contentVolume.addClass( 'hide-control-volume' );

                    fullScreen.addClass( 'hide-control-fullscreen' );

                    controlPlayer.addClass( 'hide-control-player' );

                    pbVideo.addClass( 'extend-duqueVideo-progress' );

                    setTimeout( function () {

                        $( bottomBar ).find( 'div' ).not( pbVideo ).not( pbVideoProgress ).not( pbVideoBuffer ).addClass( 'hide-all' );  

                    }, 600);

                }

            });

        }, mouseBottomBar : function () {

            var bottomBar  =   this.bottomBar;

            var pbVideo    =   this.pbVideo;

            $( bottomBar ).on( 'mouseover', function () {

                $( pbVideo ).removeClass( 'height-small-duqueVideo-progress' ).addClass( 'height-large-duqueVideo-progress' );

            }).on( 'mouseleave', function () {

                $( pbVideo ).removeClass( 'height-large-duqueVideo-progress' ).addClass( 'height-small-duqueVideo-progress' );

            });

        }, mouseMoveDocument : function () {

            var element     =   this.$element;

            var bottomBar   =   this.bottomBar;

            $( document ).on( 'mousemove', function () {

                //$( '#teste' ).text( Math.round(+new Date()/1000) );

                if( getStatusFullScreen() ) {

                    $( bottomBar ).removeClass( 'duqueVideo-bottomBar-small' ).addClass( 'duqueVideo-bottomBar-large' );

                    setDelayMouseMove( Math.round(+new Date()/1000) );

                    setTimeout( function () {

                        $( '#teste' ).text( getDelayMouseMove() );

                        $( bottomBar ).removeClass( 'duqueVideo-bottomBar-large' ).addClass( 'duqueVideo-bottomBar-small' );

                        if( getDelayMouseMove() > 3 ) {

                            $( bottomBar ).removeClass( 'duqueVideo-bottomBar-large' ).addClass( 'duqueVideo-bottomBar-small' );

                        }

                    }, 4000);

                }

            }); 

            setTimeout(( function () { this.detectMouseMoveEnded() }).bind(this), 100);


        }, detectMouseMoveEnded : function () {

            alert( 123 );

            if( !getStatusFullScreen() ) {

                if( getDelayMouseMove() > 4 ) {

                    $( '#teste' ).append( i );

                }else {

                    $( '#teste' ).append( i );

                }

            }else {

                $( '#teste' ).append( i );

            }

        }

    }

    $.fn.duquePlayer = function( options ) {

        return this.each(function() {

            var duquePlayer = new DuquePlayer( this, options);

            // do a loose comparison with null instead of !options; !0 == true
            if (options != null || typeof options === 'object')

                duquePlayer.init();

            else if (typeof options === 'number')

                duquePlayer.slide(options);

              // make sure options is the name of a function on carousel
            else if (typeof options === 'string' && typeof duquePlayer[options] === 'function') {

                duquePlayer[options](); // call the function by name

            }

        });

    };

})( jQuery );