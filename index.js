const $canvas = document.querySelector('#canvas')

const $$spansColors = document.querySelectorAll('.colors span')


const $empty = document.querySelector('.empty')

const $download = document.querySelector('.download')

const $eraser = document.querySelector('.eraser')

const $pen = document.querySelector('.pen')

let drawing = false
let eraserEnable = false
let currentColor = 'black'
let ctx = $canvas.getContext('2d');
ctx.lineCap = 'round'
ctx.lineWidth = '4'
let isTouchDevice = 'ontouchstart' in document.documentElement
let last


class Canvas {

  constructor() {
    this.init()
    this.bind()
  }

  init() {
    $canvas.width = document.documentElement.clientWidth
    $canvas.height = document.documentElement.clientHeight

    if (isTouchDevice) {
      $canvas.ontouchstart = (e) => {
        let x = e.touches[0].clientX
        let y = e.touches[0].clientY
        last = [x, y]
      }

      $canvas.ontouchmove = (e) => {
        let x = e.touches[0].clientX
        let y = e.touches[0].clientY
        drawCircular(x, y, ctx.lineWidth / 2)
        drawLine(last[0], last[1], x, y)
        last = [x, y]
      }
    } else {

      $canvas.onmousedown = (e) => {
        drawing = true
        last = [e.clientX, e.clientY]
      }

      $canvas.onmousemove = (e) => {
        if (drawing) {
          drawCircular(e.clientX, e.clientY, ctx.lineWidth / 2)
          drawLine(last[0], last[1], e.clientX, e.clientY)
          last = [e.clientX, e.clientY]
        } else {
          return
        }
      }

      $canvas.onmouseup = () => {
        drawing = false
      }
    }

    function drawLine(x1, y1, x2, y2) {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.strokeStyle = currentColor
      ctx.fillStyle = currentColor
      if (eraserEnable) {
        ctx.lineWidth = '40'
        ctx.fillStyle = 'white'
        ctx.strokeStyle = 'white'
      } else {
        ctx.lineWidth = '4'
      }
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    function drawCircular(x, y, radius) {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

  }

  bind() {
    $$spansColors.forEach($span => {
      $span.onclick = () => {
        $$spansColors.forEach($span => {
          $span.classList.remove('active')
        })
        $span.classList.add('active')
        if (eraserEnable) {
          ctx.fillStyle = 'white'
          ctx.strokeStyle = 'white'
        } else {
          ctx.fillStyle = $span.dataset.color
          ctx.strokeStyle = $span.dataset.color
          console.log('橡皮不能用')
        }
        currentColor = $span.dataset.color
      }
    })

    $pen.onclick = () => {
      $pen.classList.add('active')
      $eraser.classList.remove('active')
      eraserEnable = false
    }

    $eraser.onclick = () => {
      $pen.classList.remove('active')
      $eraser.classList.add('active')
      eraserEnable = true
    }

    $empty.onclick = () => {
      ctx.clearRect(0, 0, $canvas.width, $canvas.height)
    }

    $download.onclick = () => {
      var compositeOperation = ctx.globalCompositeOperation;
      ctx.globalCompositeOperation = "destination-over";
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, $canvas.width, $canvas.height);
      var imageData = $canvas.toDataURL("image/png");
      ctx.putImageData(
        ctx.getImageData(0, 0, $canvas.width, $canvas.height),
        0,
        0
      );
      ctx.globalCompositeOperation = compositeOperation;
      var a = document.createElement("a");
      document.body.appendChild(a);
      a.href = imageData;
      a.download = "myPicture";
      a.target = "_blank";
      a.click();
    }
  }
}

let canvas = new Canvas()