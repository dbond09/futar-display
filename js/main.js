const DOT_RADIUS = 6;
const ROWS = 20;
const COLUMNS = 50;

var content = "44  Deák   1'";

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

var last = performance.now();
var state = 0;

function draw() {
  if (last < performance.now() - 1000) {
    last = performance.now();
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // if (state == 1) {
    // //   ctx.fillStyle = 'orange';
    //   content = '4444';
    //   state = 0;
    // }
    // else {
    // //   ctx.fillStyle = 'black';
    //   content = 'aaaa';
    //   state = 1;
    // }
  // ctx.fillRect(100, 100, 200, 200);
    for (var i = 0; i < content.length; i++) {
      for (var x = 0; x < CHARS[content[i]][0].length; x++) {
        for (var y = 0; y < CHARS[content[i]].length; y++) {
          if (CHARS[content[i]][y][x] > 0) {
            ctx.fillStyle = 'orange';
          }
          else {
            ctx.fillStyle = '#262626';
          }
          ctx.beginPath();
          ctx.arc(DOT_RADIUS+(DOT_RADIUS*2*(x+i*6)), DOT_RADIUS+(DOT_RADIUS*2*(y+1)), DOT_RADIUS-1, 0, 2*Math.PI);
          ctx.closePath();
          ctx.fill();
        }
      }
    }

  }
  window.requestAnimationFrame(draw);
}
window.requestAnimationFrame(draw);
