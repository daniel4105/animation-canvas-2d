const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Dimensiones iniciales
let canvasWidth = 600;
let canvasHeight = 400;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

// Clase base (igual lógica del profe)
class Circle {
  constructor(x, y, radius, color, label, speed) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.label = label;

    this.speed = speed;

    this.dx = speed;
    this.dy = speed;
  }

  draw(ctx) {
    ctx.beginPath();

    // relleno
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // borde
    ctx.strokeStyle = "rgba(255,255,255,0.8)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.closePath();

    // texto
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "14px Arial";
    ctx.fillText(this.label, this.x, this.y);
  }

  update(ctx) {
    this.draw(ctx);

    // límites (misma lógica que ya traías)
    if (this.x + this.radius > canvasWidth) {
      this.x = canvasWidth - this.radius;
      this.dx *= -1;
    }

    if (this.x - this.radius < 0) {
      this.x = this.radius;
      this.dx *= -1;
    }

    if (this.y + this.radius > canvasHeight) {
      this.y = canvasHeight - this.radius;
      this.dy *= -1;
    }

    if (this.y - this.radius < 0) {
      this.y = this.radius;
      this.dy *= -1;
    }

    this.x += this.dx;
    this.y += this.dy;
  }
}

// arreglo de círculos
let listaCirculos = [];

// generación
function crearCirculos(num) {
  listaCirculos = [];

  for (let i = 0; i < num; i++) {
    let r = Math.random() * 30 + 20;

    let x = Math.random() * (canvasWidth - 2 * r) + r;
    let y = Math.random() * (canvasHeight - 2 * r) + r;

    let color = `hsl(${Math.random() * 360}, 70%, 50%)`;
    let speed = Math.random() * 2 + 1;

    listaCirculos.push(new Circle(x, y, r, color, i + 1, speed));
  }
}

// aplicar cambios desde inputs
function aplicarCambios() {
  const cantidad = parseInt(document.getElementById("numCircles").value);
  canvasWidth = parseInt(document.getElementById("canvasWidth").value);
  canvasHeight = parseInt(document.getElementById("canvasHeight").value);

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  crearCirculos(cantidad);
}

// animación
function animar() {
  requestAnimationFrame(animar);
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  listaCirculos.forEach(c => c.update(ctx));
}

// inicio
aplicarCambios();
animar();