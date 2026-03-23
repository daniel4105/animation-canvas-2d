const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let canvasWidth = 600;
let canvasHeight = 400;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

// dirección de origen
let direccion = "top";

class Circle {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;

    this.dx = (Math.random() - 0.5) * 2;
    this.dy = 0;

    this.gravity = 0.2;
    this.friction = 0.6;

    this.life = 1;
    this.rebotes = 0;
  }

  draw(ctx) {
    ctx.beginPath();

    ctx.globalAlpha = this.life;

    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(255,255,255,0.8)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.closePath();

    ctx.globalAlpha = 1;
  }

  update(ctx) {
    this.draw(ctx);

    // gravedad
    this.dy += this.gravity;

    // suelo
    if (this.y + this.radius >= canvasHeight) {
      this.y = canvasHeight - this.radius;
      this.dy *= -this.friction;
      this.rebotes++;

      if (this.rebotes > 5) {
        this.dy = 0;
        this.life -= 0.02;
      }
    }

    // paredes
    if (this.x + this.radius >= canvasWidth) {
      this.x = canvasWidth - this.radius;
      this.dx *= -1;
    }

    if (this.x - this.radius <= 0) {
      this.x = this.radius;
      this.dx *= -1;
    }

    this.x += this.dx;
    this.y += this.dy;
  }
}

// lista
let listaCirculos = [];
let maxCirculos = 5;

// generar según dirección
function crearCirculo() {
  let r = Math.random() * 30 + 20;
  let x, y;
  let dx = (Math.random() - 0.5) * 2;
  let dy = 0;

  if (direccion === "top") {
    x = Math.random() * canvasWidth;
    y = -r;
  }

  if (direccion === "bottom") {
    x = Math.random() * canvasWidth;
    y = canvasHeight + r;
    dy = -3;
  }

  if (direccion === "left") {
    x = -r;
    y = Math.random() * canvasHeight;
    dx = Math.random() * 3;
  }

  if (direccion === "right") {
    x = canvasWidth + r;
    y = Math.random() * canvasHeight;
    dx = -Math.random() * 3;
  }

  let color = `rgba(${Math.random()*255}, ${Math.random()*255}, ${Math.random()*255}, 0.4)`;

  let c = new Circle(x, y, r, color);
  c.dx = dx;
  c.dy = dy;

  return c;
}

// aplicar cambios
function aplicarCambios() {
  maxCirculos = parseInt(document.getElementById("numCircles").value);
  canvasWidth = parseInt(document.getElementById("canvasWidth").value);
  canvasHeight = parseInt(document.getElementById("canvasHeight").value);

  direccion = document.getElementById("direction").value;

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  listaCirculos = [];
}

// spawner
function spawn() {
  if (listaCirculos.length < maxCirculos) {
    listaCirculos.push(crearCirculo());

    if (Math.random() < 0.3 && listaCirculos.length < maxCirculos) {
      listaCirculos.push(crearCirculo());
    }
  }

  let delay = Math.random() * 1000 + 300;
  setTimeout(spawn, delay);
}

// animación
function animar() {
  requestAnimationFrame(animar);
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  listaCirculos.forEach((c, i) => {
    c.update(ctx);

    if (c.life <= 0) {
      listaCirculos.splice(i, 1);
    }
  });
}

// inicio
aplicarCambios();
spawn();
animar();