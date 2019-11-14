if (!Array.prototype.last){
    Array.prototype.last = function(){
        return this[this.length - 1];
    };
};

const DOT_RADIUS = 4;
const ROWS = 20;
const COLUMNS = 50;

var loading = true;
var times = [];

var content = [];
// window.setInterval(function() {
//   queryApi();
// }, 20000);

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.height = (DOT_RADIUS*2) * 8 * 5;
canvas.width = Math.max(window.innerWidth - 116, 1000);
const width = Math.floor(canvas.width / (DOT_RADIUS+2));

var megallo = document.getElementById('megallo');
megallo.style.top = canvas.height + 60 + 'px';
megallo.onclick = changeStop;

function changeStop(e) {
  megallo.innerHTML = '<input></input>';
  megallo.onclick = null;
  var inputNode = e.currentTarget.childNodes[0];
  inputNode.focus();
  inputNode.onkeydown = function(f) {
    if (f.keyCode == 13) {
      var stop = Object.keys(names).find(function(s) {
        return s.toLowerCase().includes(inputNode.value.toLowerCase());
      });
      console.log(stop);
      if (names.hasOwnProperty(stop)) {
        stopId = names[stop];
        megallo.innerHTML = stop;
        megallo.onclick = changeStop;
        loading = true;
        queryApi();
      }
    }
  }
}

var last = performance.now();
var state = 0;

function draw() {
  if (last < performance.now() - (loading ? 10 : 1000)) {
    state = (state + 1) % 2;
    last = performance.now();
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (loading) {
      var matrix = randomNoise();
    }
    else {
      var matrix = matrixify(content);
    }
    for (var i = 0; i < matrix.length; i++) {
      for (var j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j] > 0) {
          ctx.fillStyle = 'orange';
        }
        else {
          ctx.fillStyle = '#262626';
        }
        ctx.beginPath();
        ctx.arc(DOT_RADIUS-1+((DOT_RADIUS-1)*2*j), DOT_RADIUS+(DOT_RADIUS*2*i), DOT_RADIUS-2, 0, 2*Math.PI);
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
  if (text.split('').last() == "†" && state == 1) {
    for (var k = 0; k < 7; k++) {
      matrix[k] = matrix[k].concat('0'.repeat(width).split(''));
    }
    return matrix;
  }
  for (var i = 0; i < text.length; i++) {
    if (text[i] == '†') {
      var rest = kern(text.slice(i+1));
      var space = width - (rest[0].length + matrix[0].length);
      for (var k = 0; k < 7; k++) {
        matrix[k] = matrix[k].concat('0'.repeat(Math.max(0, space)).split('')).concat(rest[k]);
      }
      break;
    }
    if (text[i] == '¥') {
      var lengthsofar = matrix[0].length;
      for (var k = 0; k < 7; k++) {
        matrix[k] = matrix[k].concat('0'.repeat((5*7) - lengthsofar).split(''));
      }
      continue;
    }
    if (!Object.keys(CHARS).includes(text[i])) {console.log(text[i]); text = text.replace(text[i], '-')}
    var gap = false;
    if (i < 1) {
      gap = false;
    }
    else if (text[i-1] != '†' && text[i-1] != '¥'){
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

function matrixify(lines) {
  var matrix = [];
  for (var i = 0; i < lines.length; i++) {
    matrix = matrix.concat(addLineSpacing(kern(lines[i])));
  }
  if (lines.length < 5) {
    for (var i = 0; i < (5 - lines.length) * 8; i++) {
      matrix = matrix.concat(['0'.repeat(width).split('')]);
    }
  }
  return matrix;
}

function randomNoise() {
  var matrix = Array(40).fill().map(()=>Array(width).fill(Math.floor(Math.random()*2)));
  // var matrix = Array(40).fill().map(()=>Array(width).fill().map(()=>Math.floor(Math.random()*2)));

  return matrix;
}
