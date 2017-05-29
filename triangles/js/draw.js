var tCount = 100;
var triangles = [];
var x = 200;
var y = 200;
var tSize = 100;
var mx = 10;
var my = 0.01;

var up = 10;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();  // no outline
  background(0); // clear screen, i.e. fill background
  colorMode(HSB, 255);
  strokeWeight(2);
  textSize(24);


  for (var i = 0; i < tCount; i++) {
    var ii = i*10;
    triangles.push({
      a: {  //top
        x: {
          val: x + ii,
          orig: x + ii,
          tick: 5,
          step: 0.05,
        },
        y: {
          val: y,
          orig: y,
          tick: 0,
          step: 0.08,
        }
      },
      b: {  // bot L
        x: {
          val: x + ii - tSize,
          orig: x + ii - tSize,
          tick: 0,
          step: 0.01,
        },
        y: {
          val: y + 2*tSize,
          orig: y + 2*tSize,
          tick: 0,
          step: 0.08,
        }
      },
      c: {  // bot R
        x: {
          val: x + ii + tSize,
          orig: x + ii + tSize,
          tick: 0,
          step: 0.08,
        },
        y: {
          val: y + 2*tSize,
          orig: y + 2*tSize,
          tick: 0,
          step: 0.01,
        }
      }
    });
  } // for


}


function draw() {

  angleMode(DEGREES);

  background(0); // clear screen, i.e. fill background

  // mouse X/Y mappings to control parameters
  mx = 50; //map(mouseX, 0, windowWidth, 0, 400);
  my = 0.1; //map(mouseY, 0, windowHeight, 0, 2);

  // mx = up;

  fill(200);
  noStroke();


// push();
// scale(up/10);
// translate(width/2, height/2);
// pop();

  // translate(width-mouseX*(up/10), height-mouseY*(up/10));

  // text("framerate: " + parseInt(frameRate()), 10, 20);

  noFill();

  // stroke(100, 255, 255);
  // line(0, height/2, width, height/2);
  // line(width/2, 0, width/2, height);

  var m = map(mouseX, 0, width, 0, 80);
  var my = map(mouseY, 0, height, 0, 5);

  for (var i = 0; i < triangles.length; i++) {

    var t = triangles[i];

    stroke(i*2.5, 200, 200)


    push();

      translate(20+i*m, height/2);

      push();
      translate(0, 0);
      rotate( frameCount*2 + i*my + sin(frameCount/100.0)  );
      var b = 3;
      // how to center exactly
      // triangle(b*0, b*(100-35), b*50, b*(0-35), b*-50, b*(0-35) );
      line(0, b*100, 0, b*-100);
      pop();


    pop();




    // triangle(t.a.x.val, t.a.y.val, t.b.x.val, t.b.y.val, t.c.x.val, t.c.y.val);
    //  triangle(i-200, mouseY, i, 20, i+100, 300);


    var prev = i > 0 ? i-1 : 0;

    // changing the line below to "* i/50" instead of "+" has a big effect
    t.a.x.val = t.a.x.orig + Math.cos( t.a.x.tick * i/100) * mx;
    // t.a.x.step = my;
    t.a.x.tick += t.a.x.step;

    t.a.y.val = t.a.y.orig + Math.sin( t.a.y.tick * i/50 ) * mx;
    // t.a.y.step = my;
    t.a.y.tick += t.a.y.step;

    // b
    t.b.x.val = t.b.x.orig + Math.cos( t.b.x.tick + i/20) * mx;
    t.b.x.tick += t.b.x.step;
    t.b.y.val = t.b.y.orig + Math.sin( t.b.y.tick + i/20) * mx;
    t.b.y.tick += t.b.y.step;

    // c
    t.c.x.val = t.c.x.orig + Math.cos( t.c.x.tick + i/20) * mx;
    t.c.x.tick += t.c.x.step;
    t.c.y.val = t.c.y.orig + Math.sin( t.c.y.tick + i/20) * mx;
    t.c.y.tick += t.c.y.step;

  }

}

$(document).ready(function () {
  $(document).bind('mousewheel', function(e) {
    e.preventDefault();
    if(e.originalEvent.wheelDelta / 120 > 0) {
      up++;
    } else {
      up--;
    }
    console.log(up);
  });
});
