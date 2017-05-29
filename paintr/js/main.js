$(document).ready(function(){

  var lastX;
  var lastY;

  var ticks = 0;

  var $body = $('body');


  var randRange = function ( min, max) {
    return Math.floor( min + (Math.random() * (max - min)) );
  };

  $(document).on('mousemove', function( ev ){

    // store mouse X and Y position when clicked
    var x = ev.pageX;
    var y = ev.pageY;

    var velX = x - lastX;  // calculate mouse velocity as difference between current position and last position
    var velY = y - lastY;

    velX = Math.abs( velX );
    velY = Math.abs( velY );

    lastX = x;  // store current x in lastX for the next time we make the velocity calculation
    lastY = y;

    if( !ev.shiftKey ){  // if( ev.shiftKey === false )
      // don't do any drawing if the shift key is NOT held
      return;
    }

    // console.log( x, y, 'velocity: ', velX, velY );

    console.log('ticks:', ticks);

    var size = velX;   // use the mouse X-axis velocity as the size of our blob

    var r = randRange( 0, 256 );
    var g = randRange( 0, 256 );
    var b = randRange( 0, 256 );

    // if( ticks > 360 ){
    //   ticks = 0;
    // }

    var h = ticks % 360;
    var s = '50%';
    var l = '50%';

    var colour = 'rgb(' + r + ', ' + g + ', ' + b + ')';
    // var colour = "rgb(${r}, ${g}, ${b})";

    var colour = 'hsl(' + h + ', ' + s + ', ' + l + ')';


    // create a new div, set its position and append it to the page
    var $blob = $('<div class="blob">').css({
      width:  size + 'px',
      height: size + 'px',
      top:    y - size/2 + 'px',
      left:   x - size/2 + 'px',
      backgroundColor: colour
    });

    // $blob.attr('originalY', y - size/2);

    $body.append( $blob );  // attach div element to DOM, as child of <body>

    // $blob.animate({
    //     top: (Math.random() > 0.5 ? window.innerHeight : '-200px') + 'px'
    //   }, 1000);

    if( Math.random() > 0.5 ){
      $blob.animate({
        top: window.innerHeight + 'px'
      }, 1000);
    } else {
        $blob.animate({
        top:  '-200px'
      }, 1000);
    }


    // $blob.fadeOut(2000, function () {
    //   $(this).remove();
    // });

    ticks++;

  }); // end of .on('click')
  //
  // window.setInterval(function () {
  //   $('div').each(function () {
  //     // var xpos = parseInt( $(this).css('left') );
  //
  //     var yPos = $(this).attr('originalY');
  //
  //     var sine = ( Math.sin( ticks/100.0 ) * 100 );
  //     console.log(sine);
  //
  //     var newYPos = yPos + sine;
  //
  //
  //     $(this).css('top',  newYPos + 'px' )
  //   });
  //
  // }, 100);

}); // end of .ready()
