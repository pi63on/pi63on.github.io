// sin animation vars
let xs = new Array(100).fill(0);
let ys = new Array(100).fill(0);
let xr, yr;
let sinAnim = new Array(10).fill(0);

let currentText = 0;
let currentIm = 0;
let textiky = [ 'so einmal die Tickets bitte', 'magnetic field as "just" a relativistic consequence', 'deine Scheiße Laune as "just" a relativistic consequence', 'ja ist so halt - mit Alles bitte', 'mit all den relativistichen Konsequenzen', 'aj s kecupom aj s horcicou aj trocha csipos moze byt', 'and so we go in lockstep through eternity' ];
let imgs = new Array(4);
let pointsIm;
let circleIm;

let lastPos = [0,0];

let flashCube = false;
let glowSpread = 40;
let glowSteps = 20;

let animCounter =  0;
let orthoFlag = false;
let rotDeg = 0;
let rotateCounter = 0;

let boxSize = 140;
let boxBg;
//sound
let env;
let mySound;

let sinx = 270;
let siny = 220;
let sinR = 50;


let cubex = -20, cubey = 110;


function preload(){
  // font loading
  font = loadFont('font/arialnarrow.ttf');
  //ims loading a resizing
  for (let i = 0; i < imgs.length ; i++){
    let currentIndex = i +1;
    let imName = `images/ob${currentIndex}.jpeg`;
    imgs[i] = loadImage(imName);
  }

  boxBg = loadImage('images/ob5_contrast_up.jpg')
  // sound loading
  soundFormats('mp3', 'ogg');                         
  mySound = loadSound('sound/lockstep.mp3');   

  pointsIm = loadImage('images/points.jpg');
  circleIm = loadImage('images/circle.jpg');
}

function setup() {
  createCanvas(1280, 720, WEBGL);
  frameRate(12);

  // text setup
  textFont(font);
  textSize(62);

  // sound setup
  env = new p5.Envelope(2, 0.7, 0.7, 1);
  env.setInput(mySound);

  //ims downsizing
  for (let i =0 ; i< imgs.length ; i++){
    imgs[i].resize(150, 0); //contain aspect ratio
  }
  circleIm.resize(170, 0)
  pointsIm.resize(120, 0)
  
  //for sin animation discrete points on timeline
  for (let i = 0 ; i < xs.length; i++){
    xs[i] = map(i, 0, xs.length-1, -width/2 + sinx, width/2);
  }
}

function draw() {
  // background
  fill('white'); stroke('black');
  rect(-width/2 + 1, -height/2 + 1 , width -2  , height - 2);
  //frame around
  stroke('black'); fill('rgba(255, 241, 176, 0.62)')
  
  //draw cube
  drawCube();

  // sin wave
  sinDraw();
  
  //obrazky low res
  showIms();
  disjointIms();
  
  // textik
  fill('black');
  text(textiky[currentText], -width/2 + 4, height/2 - 14);
  
  push(); //credit a instruction text
  textSize(20);
  text('sound from: The Mechanical Universe...And Beyond, Ep. 39 (Caltech, 1985-86)', width/2 - 590, - height/2 + 30) ;
  text('click around (and at the cube), add phase with <- and ->, F for fullscreen', width/2 - 590, - height/2 + 50) ;
  text('', width/2 - 120, - height/2 + 70) ;
  pop();

  // keeping track vars
  if (flashCube){
    flashCube = false;
  }
  animCounter++;
}

function mousePressed(){
  // change im
  changeIm();

  //box on click
  if (dist(mouseX, mouseY, width/2 + cubex, height/2 + cubey) <= boxSize  ){
    console.log('box clicked');
    clickBox();
  }
}

function keyPressed() {
    if (key == 'f') {
    let fs = fullscreen();
    fullscreen(!fs);
    } else if (key == 'ArrowRight'){
      refreshTopBox();
      frameCount += 20;
      currentText += 1;
      currentText = currentText % textiky.length;
      currentIm = (currentIm+1)%4;

    } else if (key == 'ArrowLeft'){
      refreshTopBox();
      frameCount -= 20;
      if (currentText > 0){
        currentText -= 1;
      } else if (currentText == 0 ){
        currentText = textiky.length-1;
      }
      if (currentIm > 0){
        currentIm -= 1;
      } else if (currentIm == 0 ){
        currentIm = imgs.length-1;
      }
    }
  }

function refreshTopBox(){
  flashCube = true;
  glowSpread = 0;
}

function changeIm(){
  currentIm = (currentIm+1)%4;
}

function clickBox(){
  // orthogonal animation
  orthoFlag = !orthoFlag;
  animCounter = 0;
  rotateCounter = 0;
  rotDeg = 0;
  

  //play audio
  if (!mySound.isPlaying()){
    // mySound.setVolume(1);
    mySound.play();
    env.triggerAttack();
  } else {
    env.triggerRelease();
    mySound.stop();
  }
}

function showIms(){ // beton kocka ims
  push();
  translate(310, -52,0);
  image(imgs[currentIm], 0, 0, 300, 300/4  * 3);
  noFill();
  colorMode(HSB); // HSB farby Punkt
  stroke(345, 51, 80);
  rect(40, 30, 200, 150)
  pop();
}

function sinDraw(){
  //circle non-orthogonal part
  push();
  push();
  translate(-width/2 + sinx, -height/2 + siny, 100);
  stroke('black'); noFill();
  image(circleIm, -circleIm.width/2, -circleIm.height/2)
  // circle(0,0, sinR*2);
  line(0,-sinR ,0,sinR);
  
  // solver..
  let t = map(frameCount % 100, 0, 100, -PI, PI);
  xr = sin(t) * sinR;
  yr = cos(t) * sinR;
  
  //drawing
  stroke('blue');
  stroke('rgb(255, 168, 168)')
  stroke('black');
  line(0, 0, xr, yr);
  line(xr, 0, xr, yr);
  stroke('blue');
  line(0, yr, xr, yr);
  fill('white');
  circle(xr, yr, 3);
  circle(0, yr,3 );
  pop();
  
  
  //axis of oscillation
  push();
  stroke('black')
  line(-width/2 + sinx - sinR, -height/2 + siny, 100, width/2, -height/2 + siny, 100) //axis of oscillation
  pop();

  
  //points on timeline, update
  ys.unshift(yr); 
  ys.pop();
  
  // axis points animations
  push();
  translate(0, -height/2 + siny, 100);
  stroke('black')
  for (let i = 0; i<xs.length; i++){
    let ynoise = ys[i] + randomGaussian(sinR * 0.1);
    fill('white');
    strokeWeight(1);
    line(xs[i], 0, xs[i], ynoise);
    circle(xs[i], ynoise, 3);
  }
  pop();
  
  // orthopart
  push();
  stroke('black'); noFill();
  translate(-width/2 + sinx, -height/2 + siny, 100);

  if (orthoFlag){
    if (rotDeg < PI/2){ // animation of rotating into ortho
      rotDeg += (PI/2)/40 //num of steps for animation
      rotateX(-rotDeg);
    } else {
      rotateX(-PI/2)
    }

    line(0, -sinR, 0, sinR);
    // circle(0,0, sinR*2);
    image(circleIm, 0- circleIm.width/2, 0 - circleIm.height/2 + 10)
    stroke('blue');
    point(xr, yr);
    point(0, yr);
    stroke('black');
    line(0, 0, xr, yr);
    line(0, yr, xr, yr);
    push();
    translate(width/2 - sinx, 0, 0)
    for (let i = 0; i<xs.length; i++){
      let ynoise = ys[i] + randomGaussian(sinR * 0.1);
      line(xs[i], 0, xs[i], ynoise);
      point(xs[i], ynoise);
    }
  }
  pop();
  pop();

}

// part with the cube
function drawCube(){
  
  push();
  //overall position of center
  translate(cubex, cubey ,0);

  // background image
  push();
  image(boxBg, -200, -160, 400, 320)
  noFill(); stroke('black');
  rect(-200, -160, 400, 320);
  pop();

  // animated flash rect on time skip
  push();
  noStroke();
  fill(color('rgba(253, 123, 155, 0.54)'));
  if (glowSpread < glowSteps+1){
    rect(-200 + (200/glowSteps)*glowSpread, -160 + (160/glowSteps)*glowSpread, -2 * (-200 + (200/glowSteps)*glowSpread) , -2*(-160 + (160/glowSteps)*glowSpread))
    glowSpread += 1;
  }
  pop();

  // 3d part cube
  push();
  ambientLight(100);
  directionalLight(255, 180, 204, -2, 0, -1);
  stroke('blue');
  if (flashCube){
    fill('blue');
  } else {
    fill(255,255,255);
  }
  rotateY(frameCount / 100);
  box(boxSize);
  pop();
  pop();

}

function disjointIms(){ // tie vlavo
  push();
  translate(-width/2 + 35, 30, 0);
  //im1
  image(pointsIm, 0 ,0 , 400 * 0.7, 300 * 0.8);
  noStroke();
  
  noFill();
  colorMode(HSB);
  stroke(345, 51, 80);
  rect(40, 80, 210, 80)
  pop();

}