ctx = c.getContext('2d');
var W = window.innerWidth;
var H = window.innerHeight;
c.width = W;
c.height = H;
var lastTime = 0,
  currentTime,
  dt;
var cube1, cube2;
var particles = [];
var started =false;
var finishTime = 0;

function random(a,b){
  return a + ~~(Math.random()*(b-a));
}

function getCube(sizeClass) {
  var node = document.createElement('div');
  node.classList.add('_3dbox');
  node.classList.add(sizeClass);
  node.innerHTML = '<div class="f f--front"></div><div class="f f--top"></div><div class="f f--bottom"></div><div class="f f--left"></div><div class="f f--right"></div><div class="f f--back"></div>';
  return node;
}

function generateCubes() {
  var colors = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6];
  for(var x = colors.length; x--;) {
    var y = random(0, colors.length);
    var temp = colors[x];
    colors[x] = colors[y];
    colors[y] = temp;
  }
  x = 0;
  for(var i = 0; i<4; i++)
  for(var j = 0;j<3;j++) {
  	var cube = getCube('cube-100px');
    var cubeinner = getCube('cube-30px');
    var colorValue = colors[x++];
    cubeinner.classList.add('cube--c' + colorValue);
    cube.value = colorValue;
    cube.appendChild(cubeinner);
    cube.style.left = (120 * i) + 'px';
    cube.style.zIndex = j;
    cube.z = j;
    // cube.style.transitionDuration = (0.3 + Math.random() * 1.5) + 's';
    cube.transform = { x: 0, y: 300, z: j * 200 };
    setTransform(cube);
    (function(cube) {
      setTimeout(function() {
        cube.transform.y = 0;
        setTransform(cube);
      }, random(50, 1000));
    })(cube);

    cube.addEventListener('click', function (e) {
      if (!cube1) {
        cube1 = e.currentTarget;
      } else {
        if (cube1 === e.currentTarget) { return; }
        cube2 = e.currentTarget;
        checkMatch();
      }
      var bound = e.currentTarget.getBoundingClientRect()
      e.currentTarget.classList.add('open');
      blast(bound.left + bound.width/2, e.pageY, e.currentTarget.z)
    });
    space.appendChild(cube);
  }
}

function setTransform(el) {
  el.style.transform = 'translateZ(' + el.transform.z + 'px) translateY(' + el.transform.y + 'px)';
}

function destroyCubes() {
  var bound1 = cube1.getBoundingClientRect()
  var bound2 = cube2.getBoundingClientRect()
  blast(bound1.left + bound1.width/2, bound1.top + bound1.height/2, cube1.z);
  blast(bound2.left + bound2.width/2, bound2.top + bound2.height/2, cube2.z);
  cube1.transform.y = -100;
  cube2.transform.y = -100;
  cube1.classList.add('destroy');
  cube2.classList.add('destroy');
  setTransform(cube1);
  setTransform(cube2);
  cube1.addEventListener('transitionend', function () {
    if (!cube1) return;
    cube1.remove();
    cube2.remove();
    cube1 = undefined;
    cube2 = undefined;
    if (!space.children.length) {
      started = false;
      ui.classList.add('finish');
    }
  });
}
function checkMatch() {
  if (cube1.value === cube2.value) {
    console.log('match found');
    setTimeout(destroyCubes, 1000);
  } else {
    console.log('no match');
    setTimeout(function () {
      cube1.classList.remove('open');
      cube2.classList.remove('open');
      cube1 = cube2 = undefined;
    }, 1000);
  }
}

function blast(x, y, z) {
  for (var i = 10; i--;) {
    particles.push({ x: x + random(-50,50), y: y + random(-50,50), size: random(2+2*z,10+6*z), vx: random(0,0), vy: random(-5,-1), alpha: 1 });
  }
}
function drawParticle(p){
  p.x += p.vx * Math.sin(Date.now() / 500);
  p.y += p.vy;
  p.vy -= dt;
  // p.alpha -= dt;
  p.size -= 10 * dt;
  if (p.size < 0) p.size = 0;
  ctx.fillStyle = 'hsla(54, 100%, 56%, ' + p.alpha + ')';
  ctx.fillRect(p.x, p.y, p.size, p.size);
}

function loop() {
  currentTime = Date.now();
  dt = (currentTime - lastTime)/1000;
  lastTime = currentTime;
  ctx.clearRect(0,0,W,H);
  if (started) {
    finishTime += dt;
    timer.textContent = ~~(finishTime);
  }
  for (var i=particles.length;i--;) {
    drawParticle(particles[i]);
    if (particles[i].y < 0) {
      particles.splice(i, 1);
    }
  }
  requestAnimationFrame(loop);
}
function start() {
  started = true;
  ui.classList.add('small');
  generateCubes();
}
loop();
window.onload = function () {
  // setTimeout(generateCubes, 500);
  setTimeout(function() {
    ui.classList.add('show');
  }, 500);
}