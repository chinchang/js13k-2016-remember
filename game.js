ctx = c.getContext('2d');
c.width = window.innerWidth;
c.height = window.innerHeight;
var particles = [];

function getCube(sizeClass) {
  var node = document.createElement('div');
  node.classList.add('_3dbox');
  node.classList.add(sizeClass);
  node.innerHTML = '<div class="f f--front"></div><div class="f f--top"></div><div class="f f--bottom"></div><div class="f f--left"></div><div class="f f--right"></div><div class="f f--back"></div>';
  return node;
}

for(var i = 0; i<3; i++)
for(var j = 0;j<3;j++) {
	var cube = getCube('cube-100px');
  var cube2 = getCube('cube-30px');
  cube.appendChild(cube2);
  cube.style.left = (120 * i) + 'px';
  cube.style.zIndex = j;
  cube.style.transform = 'translateZ(' + (j * 200) + 'px)';
  cube.addEventListener('click', function (e) {
    e.currentTarget.classList.toggle('open');
  });
  space.appendChild(cube);
}

function drawParticle(p){
  ctx.fillStyle = "yellow";
  ctx.fillRect(0, 0, 10, 10);
}
function loop() {
  for (var i=0; i< particles.length;i++) {
    drawParticle(particles[i]);
  }
  requestAnimationFrame(loop);
}
loop();