const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Obtiene las dimensiones de la pantalla actual
const window_height = window.innerHeight;
const window_width = window.innerWidth;

canvas.height = window_height;
canvas.width = window_width;
canvas.style.background = "#ff8";

class Circle {
  constructor(x, y, radius, color, text, speed) {
    this.posX = x;
    this.posY = y;
    this.radius = radius;
    this.color = color;
    this.originalColor = color; // Guardar el color original
    this.text = text;
    this.speed = speed;
    this.dx = (Math.random() < 0.5 ? -1 : 1) * this.speed; // Dirección aleatoria en X
    this.dy = (Math.random() < 0.5 ? -1 : 1) * this.speed; // Dirección aleatoria en Y
    this.inCollision = false; // Para manejar el flasheo del color
  }

  draw(context) {
    context.beginPath();
    context.strokeStyle = this.color;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "20px Arial";
    context.fillText(this.text, this.posX, this.posY);
    context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
    context.stroke();
    context.closePath();
  }

  update(context) {
    this.draw(context);
    // Actualizar la posición X
    this.posX += this.dx;
    if (this.posX + this.radius > window_width || this.posX - this.radius < 0) {
      this.dx = -this.dx;
    }
    // Actualizar la posición Y
    this.posY += this.dy;
    if (this.posY + this.radius > window_height || this.posY - this.radius < 0) {
      this.dy = -this.dy;
    }
  }

  // Función para detectar colisiones con otros círculos
  detectCollision(otherCircle) {
    const distX = this.posX - otherCircle.posX;
    const distY = this.posY - otherCircle.posY;
    const distance = Math.sqrt(distX * distX + distY * distY); // Distancia entre los centros

    // Verificar si la distancia entre los centros es menor que la suma de los radios
    if (distance < this.radius + otherCircle.radius) {
      if (!this.inCollision) {
        this.inCollision = true;
        otherCircle.inCollision = true;
        
        // Cambiar a azul durante la colisión
        this.color = "#0000FF";
        otherCircle.color = "#0000FF";
        
        // Invertir las direcciones (rebote)
        this.dx = -this.dx;
        this.dy = -this.dy;
        otherCircle.dx = -otherCircle.dx;
        otherCircle.dy = -otherCircle.dy;

        // Volver al color original después de un tiempo
        setTimeout(() => {
          this.color = this.originalColor;
          otherCircle.color = otherCircle.originalColor;
          this.inCollision = false;
          otherCircle.inCollision = false;
        }, 200); // Cambiar color de nuevo a los 200ms
      }
    }
  }
}

// Crear un array para almacenar N círculos
let circles = [];

// Función para generar círculos aleatorios
function generateCircles(n) {
  for (let i = 0; i < n; i++) {
    let radius = Math.random() * 30 + 20; // Radio entre 20 y 50
    let x = Math.random() * (window_width - radius * 2) + radius;
    let y = Math.random() * (window_height - radius * 2) + radius;
    let color = `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Color aleatorio
    let speed = Math.random() * 4 + 1; // Velocidad entre 1 y 5
    let text = `C${i + 1}`; // Etiqueta del círculo
    circles.push(new Circle(x, y, radius, color, text, speed));
  }
}

// Función para detectar colisiones entre todos los círculos
function detectCollisions() {
  for (let i = 0; i < circles.length; i++) {
    for (let j = i + 1; j < circles.length; j++) {
      circles[i].detectCollision(circles[j]);
    }
  }
}

// Función para animar los círculos
function animate() {
  ctx.clearRect(0, 0, window_width, window_height); // Limpiar el canvas
  circles.forEach(circle => {
    circle.update(ctx); // Actualizar cada círculo
  });
  detectCollisions(); // Detectar colisiones en cada cuadro de la animación
  requestAnimationFrame(animate); // Repetir la animación
}

// Generar N círculos y comenzar la animación
generateCircles(10); // Puedes cambiar el número de círculos aquí
animate();
