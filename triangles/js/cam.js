
var capture;
var h =  window.innerHeight;
var w = window.innerWidth;

function setup() {
  createCanvas(w, h);
  capture = createCapture(VIDEO);
  capture.size(w/10, h/10);
  capture.hide();

  noStroke();
  fill(0);
}

function draw() {
  background(255);
  capture.loadPixels();
  var stepSize = round(constrain(mouseX / 8, 6, 32));
  for (var y=0; y<height; y+=stepSize) {
    for (var x=0; x<width; x+=stepSize) {
      var i = y * width + x;
      var darkness = (255 - capture.pixels[i*4]) / 255;
      var radius = stepSize * darkness;
      ellipse(x, y, radius, radius);
    }
  }
  // image(capture, 0, 0,w, h);
  // filter('INVERT');
  //filter(POSTERIZE,2);
  // filter(THRESHOLD);
}
