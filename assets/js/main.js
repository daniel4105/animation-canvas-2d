const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let canvasWidth = 600;
let canvasHeight = 400;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

let direccion = "top";

class Circle {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;

    this.dx = (Math.random() - 0.5) * 2;
    this.dy = 0;

    // variación ligera en física
    this.gravity = 0.15 + Math.random() * 0.15;
    this.friction = 0.65 + Math.random() * 0.2;

    this.rebotes = 0;
    this.detener = false;
  }

  draw(ctx) {
    ctx.beginPath();

    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(255,255,255,0.8)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.closePath();
  }

  update(ctx) {
    if (this.detener) {
      this.draw(ctx);
      return;
    }

    this.draw(ctx);

    // gravedad con ligera variación
    this.dy += this.gravity * (0.95 + Math.random() * 0.1);

    // suelo
    if (this.y + this.radius >= canvasHeight) {
      this.y = canvasHeight - this.radius;

      this.dy *= -(this.friction + Math.random() * 0.05);
      this.rebotes++;

      if (this.rebotes > 4) {
        this.dy *= 0.7;
      }

      // corte de movimiento
      if (Math.abs(this.dy) < 0.8 || this.rebotes > 8) {
        this.dy = 0;
      }
    }

    // paredes laterales
    if (this.x + this.radius >= canvasWidth) {
      this.x = canvasWidth - this.radius;
      this.dx *= -1;
    }

    if (this.x - this.radius <= 0) {
      this.x = this.radius;
      this.dx *= -1;
    }

    // fricción horizontal progresiva
    if (this.rebotes > 3) {
      this.dx *= 0.92;

      if (Math.abs(this.dx) < 0.2) {
        this.dx = 0;
      }
    }

    this.x += this.dx;
    this.y += this.dy;

    // detener completamente
    if (this.dy === 0 && Math.abs(this.dx) < 0.2) {
      this.dx = 0;
      this.detener = true;
    }
  }
}

// lista
let listaCirculos = [];

// generar
function crearCirculo() {
  let r = Math.random() * 30 + 20;
  let x, y;
  let dx = (Math.random() - 0.5) * 2;
  let dy = 0;

  if (direccion === "top") {
    x = Math.random() * canvasWidth;
    y = -r;
    dy = Math.random() * 2;
  }

  if (direccion === "bottom") {
    x = Math.random() * canvasWidth;
    y = canvasHeight + r;
    dy = -4 - Math.random() * 2;
  }

  if (direccion === "left") {
    x = -r;
    y = Math.random() * canvasHeight;
    dx = Math.random() * 4;
  }

  if (direccion === "right") {
    x = canvasWidth + r;
    y = Math.random() * canvasHeight;
    dx = -Math.random() * 4;
  }

  let color = `rgba(${Math.random()*255}, ${Math.random()*255}, ${Math.random()*255}, 0.4)`;

  let c = new Circle(x, y, r, color);
  c.dx = dx;
  c.dy = dy;

  return c;
}

// aplicar cambios
function aplicarCambios() {
  let cantidad = parseInt(document.getElementById("numCircles").value);

  canvasWidth = parseInt(document.getElementById("canvasWidth").value);
  canvasHeight = parseInt(document.getElementById("canvasHeight").value);

  direccion = document.getElementById("direction").value;

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  listaCirculos = [];

  for (let i = 0; i < cantidad; i++) {
    listaCirculos.push(crearCirculo());
  }
}

// animación
function animar() {
  requestAnimationFrame(animar);
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  listaCirculos.forEach((c) => {
    c.update(ctx);
  });
}

// inicio
aplicarCambios();
animar();