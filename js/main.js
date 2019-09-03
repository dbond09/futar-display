if (!Array.prototype.last){
    Array.prototype.last = function(){
        return this[this.length - 1];
    };
};

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
    var matrix = addLineSpacing(kern(content));
    for (var i = 0; i < matrix.length; i++) {
      for (var j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j] > 0) {
          ctx.fillStyle = 'orange';
        }
        else {
          ctx.fillStyle = '#262626';
        }
        ctx.beginPath();
        ctx.arc(DOT_RADIUS+(DOT_RADIUS*2*j), DOT_RADIUS+(DOT_RADIUS*2*i), DOT_RADIUS-2, 0, 2*Math.PI);
        ctx.closePath();
        ctx.fill();
      }
    }


  }
  window.requestAnimationFrame(draw);
}
window.requestAnimationFrame(draw);

function kern(text) {
  var matrix = [[],[],[],[],[],[],[]];
  for (var i = 0; i < text.length; i++) {
    var gap = false;
    if (i < 1) {
      gap = false;
    }
    else {
      for (var j = 0; j < 7; j++) {
        if (CHARS[text[i-1]][j].last() > 0 && (CHARS[text[i]][j][0] > 0 ||
                                              (CHARS[text[i]][j-1] && CHARS[text[i]][j-1][0] > 0) ||
                                              (CHARS[text[i]][j+1] && CHARS[text[i]][j+1][0] > 0))) {
          gap = true;
          break;
        }
      }
    }
    for (var k = 0; k < 7; k++) {
      matrix[k] = matrix[k].concat(gap ? [0] : []).concat(CHARS[text[i]][k]);
    }
  }
  return matrix;
}

function addLineSpacing(line) {
  return ['0'.repeat(line[0].length).split('')].concat(line);
}
