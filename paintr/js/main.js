$(document).ready(function(){

  var lastX;
  var lastY;
  var lastDisplacement;

  var ticks = 0;
  var sineTicks = 0;

  var $body = $('body');

  var drawSrc = '';

  var randRange = function ( min, max) {
    return Math.floor( min + (Math.random() * (max - min)) );
  };

  var controls = {
    hueCycle: false,
    opacityCycle: false,
    // scaleCycle: false,
    flyAway: false,
    sineFactor: 1,
    sineMovement: false,
    sizeFactor: 1,
    drawType: 'color',
    blur: 0,
    blendMode: 'normal'
  };

  var gui = new dat.GUI();
  gui.add( controls, 'sizeFactor', 0.5, 5);
  gui.add( controls, 'hueCycle').listen();
  gui.add( controls, 'opacityCycle').listen();
  // gui.add( controls, 'scaleCycle').listen();
  gui.add( controls, 'flyAway').listen();
  gui.add( controls, 'sineFactor', 0.1, 4);
  gui.add( controls, 'sineMovement').listen();
  gui.add( controls, 'drawType', {
    color: 'color',
    fireworksGIF: 'https://media.giphy.com/media/dMp9eZaAlYvvi/giphy.gif',
    flameGIF: 'https://fat.gfycat.com/UncomfortableCourteousInchworm.gif',
    wolfGIF: 'http://bestanimations.com/Animals/Mammals/Dogs/Wolves/wolf-running-animated-gif.gif',
    dogGIF: 'http://files.gamebanana.com/img/ico/sprays/5905d4fe8d7f1.gif'
  })
  // .onChange(function(value) {
  //   drawSrc =
  // });

  gui.add( controls, 'blur', 0, 20).onChange(function(value) {
    if( value > 0) {
      value = 'blur(' + value + 'px)';
    } else {
      value = ''
    }
    $body.css('filter', value);
  });

  gui.add( controls, 'blendMode', [
    "normal",
    "multiply",
    "screen",
    "overlay",
    "darken",
    "lighten",
    "color-dodge",
    "color-burn",
    "hard-light",
    "soft-light",
    "difference",
    "exclusion",
    "hue",
    "saturation",
    "color",
    "luminosity",
  ])
  .onChange(function(value) {
    $('.blob').css('mix-blend-mode', value);
  });



  $(document).on('mousemove', function( ev ){

    // store the mouse X and Y position as it was when we clicked
    var x = ev.pageX;
    var y = ev.pageY;

    // calculate mouse velocity as difference between current position and last position
    var velX = x - lastX;
    var velY = y - lastY;

    // ignore negative sign of values
    velX = Math.abs( velX );
    velY = Math.abs( velY );

    // store current x in lastX for the next time we make the velocity calculation
    lastX = x;
    lastY = y;

    // Pythagorean formula for 2D distance (to get combined x+y position velocity)
    var totalDisplacement = Math.sqrt( (velX*velX) + (velY*velY) );
    var totalVelocity = totalDisplacement - lastDisplacement;
    totalVelocity = Math.abs(totalVelocity); // ignore minus sign
    lastDisplacement = totalDisplacement;    // save into last for next round
    // console.log('totalVelocity:', totalVelocity );

    if( !ev.shiftKey ){  // if( ev.shiftKey === false )
      // don't do any drawing if the shift key is NOT held
      return;
    }

    // var r = randRange( 0, 256 );
    // var g = randRange( 0, 256 );
    // var b = randRange( 0, 256 );
    // var colour = 'rgb(' + r + ', ' + g + ', ' + b + ')';

    // if( ticks > 360 ){
    //   ticks = 0;
    // }
    // ... is equivalent to (ticks % 360)

    // each new blob will get a color slightly rotated around the hue cylinder
    var h = ticks % 360;
    var s = '50%';
    var l = '50%';
    var colour = 'hsl(' + h + ', ' + s + ', ' + l + ')';


    // use the overall mouse velocity to set the size of our blob
    var size = ( (totalVelocity * 2) * controls.sizeFactor ) % 400;

    // create a new div, set some CSS properties and append it to the page
    var $blob = $('<div class="blob">').css({

      width:  10 + size + 'px',
      height: 10 + size + 'px',

      top:    y - size/2 + 'px',
      left:   x - size/2 + 'px',

      backgroundColor: colour,

      mixBlendMode: controls.blendMode,

      // backgroundColor: 'rgba(0, 0, 0, 0.0)',
      // backgroundImage:  'url(img/snowflake.png)',
      // backgroundImage:  'url(https://media.giphy.com/media/dMp9eZaAlYvvi/giphy.gif)'
      // backgroundImage:  'url(https://fat.gfycat.com/UncomfortableCourteousInchworm.gif)',
      // 'url(https://media.giphy.com/media/peAFQfg7Ol6IE/giphy.gif)'
      // 'url(img/sparkler.gif)',
    });
    // when making an <img> tag instead of a <div>:
    // .attr('src', 'https://fat.gfycat.com/UncomfortableCourteousInchworm.gif');
    // .attr('src', 'https://media.giphy.com/media/dMp9eZaAlYvvi/giphy.gif');


    //  handle GIFs
    if( controls.drawType !== 'color' ){
      $blob.css({
        backgroundColor: '',
        borderRadius: '0px',
        // mixBlendMode: 'screen',
        // width: '',
        // height: '',
        backgroundImage:  'url(' + controls.drawType + ')'
      });

      if( controls.drawType === 'http://bestanimations.com/Animals/Mammals/Dogs/Wolves/wolf-running-animated-gif.gif'){
        $blob.css({
          width: '500px',
          height: '341px',
        });
      } else if( controls.drawType === 'https://fat.gfycat.com/UncomfortableCourteousInchworm.gif' ){
          $blob.css({
          width: '400px',
          height: '250px',
          mixBlendMode: 'screen',
        });
      }

    } // controls.drawType !== 'color'




    // set some unique attributes for this div element which we will access later
    // (i.e., in the setInterval $('div').each() callback for animating)
    var movement = 2;
    $blob.attr({
      originalX: x - size/2,
      originalY: y - size/2,
      ticks:  randRange(0, 100),
      xTicks: randRange(0, 100),
      yTicks: randRange(0, 100),

      xRange: velX, //randRange(0, 100),  //velX,
      yRange: velY, //randRange(0, 100),  //velY

      rot:    randRange(-10, 10),

      xSpeed: randRange(-movement, movement),  // set up default speed values, randomly
      ySpeed: randRange(-movement, movement),

      xInc:   randRange(-100, 100),  // increments for sin()/cos() input ticks
      yInc:   randRange(-100, 100),
    });

    $body.append( $blob );  // attach div element to DOM, as child of <body>


    // animate using jQuery instead of doing it ourselves in window.setInterval()
    //
    // $blob.animate({
    //     top: (Math.random() > 0.5 ? window.innerHeight : '-200px') + 'px'
    //   }, 1000, function () {
    //     $(this).fadeOut(1000).remove();  // remove the div when it's finished moving offscreen
    //   });

    // ternary operator '?' above is equivalent to if/else:
    // if( Math.random() > 0.5 ){
    //   $blob.animate({
    //     top: window.innerHeight + 'px'
    //   }, 1000);
    // } else {
    //     $blob.animate({
    //     top:  '-200px'
    //   }, 1000);
    // }


    // simple fadeout:
    //
    // $blob.fadeOut(5000, function () {
    //   $(this).remove();
    // });

    // moved this increment to setInterval to cause hue to cycle even
    // when not drawing (to get interesting jumps in hue)
    // ticks++;

  }); // end of .on('click')



  // helper function to make sin/cos code slightly more readable
  var trigDisplace = function(trigFunc, ticks, range){
    return trigFunc(ticks) * range;
  };


  window.setInterval(function(){

    // every interval, loop over every blob div and make some unique changes to each of them
    $('.blob').each(function( i ){

      var origX =  +$(this).attr('originalX');
      var origY =  +$(this).attr('originalY');
      var yRange  =  +$(this).attr('yRange');
      var xRange  =  +$(this).attr('xRange');

      var newX = origX;
      var newY = origY;

      var newOpacity = '';
      var newTransform = '';

      var newHue = $(this).css('background-color');

      // Uncomment these lines to make the blobs fly off screen
      //

      if( controls.flyAway ){
        // Get speed values and increment position by speed
        var xSpeed = +$(this).attr('xSpeed');
        var ySpeed = +$(this).attr('ySpeed');
        $(this).attr('originalX', origX + xSpeed);
        $(this).attr('originalY', origY + ySpeed);
      }


      // var rot     =  +$(this).attr('rot');
      // $(this).attr('rot', rot + 2 );
      // $(this).css('transform', 'rotate(' + rot%360 + 'deg)')

      var tick  =  +$(this).attr('ticks');  // get ticks
      $(this).attr('ticks', tick+1);        // increment and save to attribute


      // get the increment to apply to the tick counters for each x,y axis
      var xInc =  +$(this).attr('xInc');
      var yInc =  +$(this).attr('yInc');

      // apply the increment to each and save it back to the attribute
      // (these values get passed into the sin()/cos() functions to control the speed of oscillation)
      var xTicks =  +$(this).attr('xTicks');
      $(this).attr('xTicks', xTicks + xInc/50.0);

      var yTicks =  +$(this).attr('yTicks');
      $(this).attr('yTicks', yTicks + yInc/50.0);

      if( controls.sineMovement ){

        // increment tick value and set to element attribute
        newY = origY + trigDisplace(
          Math.sin,
          xTicks / 30.0,
          yRange * 1.5  * controls.sineFactor
        );
        // same as: var newY = origY + ( Math.sin( xTicks/30.0 ) * yRange * 1.5 );

        newX = origX + trigDisplace(
          Math.cos,
          xTicks / 30.0,
          xRange * 1.5  * controls.sineFactor
        );
        // same as: var newX = origX + ( Math.cos( yTicks/30.0 ) * yRange * 1.5 );

      } // controls.sineMovement


        // Use sin() to get a range of values between 0 and 1, multiple by 360 (to get the full hue cylinder range),
      // and add i (index of div in array) to get anice offet of colors for successive divs,
      // otherwise they all rotate the same hue at the same time
      if( controls.hueCycle ){
        var hueVal = (sineTicks*0.7 + i) % 360;  // + (1 + Math.sin( sineTicks/200.0 ))/2.0 * 360 + i;
        newHue = 'hsl(' + hueVal + ', 50%, 50%)'
      }

      if( controls.opacityCycle ){
        // Similarly for opacity (transparency), oscillate between 0.0 and 1.0
        // (tick is unique for each div)
        newOpacity = (1 + Math.sin( tick/120.0 )) / 2.0;
      }

      // if( controls.scaleCycle ){
      //   var scale = (1 + Math.sin( (tick+i)/150.0 )) * 2.0; //   / 2.0;
      //   newTransform = 'scale(' + scale + ')';
      //   // console.log(newTransform);
      // }

      // set new CSS properties for this blob
      $(this).css({

        opacity: newOpacity,

        // transform: newTransform,

        left: newX + 'px',
        top:  newY + 'px',

        backgroundColor: newHue,

        // transform: 'rotate(' + tick/3%360 + 'deg)',  // only noticeable with images
        // filter: 'hue-rotate(' + tick%360 + 'deg)',   // slows down, faster to do it ourselves!

      }); // .css()

    });  // .each()

    sineTicks++;  // used to pass into sin() to rotate hue for all blobs every interval

    ticks++;  // used to rotate hue slightly for each new blob when it's first created

  }, 10);  /// interval callback fires every 10ms


  // clear the screen on spacebar press
  $(document).on('keypress', function (ev) {

    if( ev.key === " " ){
      $('.blob').remove();

    } else if( ev.key === 'c' ){
      controls.hueCycle = !controls.hueCycle;

    } else if( ev.key === 'o' ){
      controls.opacityCycle = !controls.opacityCycle;

    } else if( ev.key === 's' ){
      controls.sineMovement = !controls.sineMovement;

    } else if( ev.key === 'f' ){
      controls.flyAway = !controls.flyAway;
    }
  });


}); // end of .ready()

// https://stackoverflow.com/questions/4127118/can-you-detect-dragging-in-jquery
// $(function() {
//   var pressed, pressX, pressY,
//       dragged,
//       offset = 3; // helps detect when the user really meant to drag
//
//   $(document)
//   .on('mousedown', '.thing', function(e) {
//     pressX = e.pageX;
//     pressY = e.pageY;
//     pressed = true;
//   })
//   .on('mousemove', '.thing', function(e) {
//     if (!pressed) return;
//     dragged = Math.abs(e.pageX - pressX) > offset ||
//               Math.abs(e.pageY - pressY) > offset;
//   })
//   .on('mouseup', function() {
//     dragged && console.log('Thing dragged');
//     pressed = dragged = false;
//   });
// });
