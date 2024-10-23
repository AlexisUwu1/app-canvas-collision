const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Obtiene las dimensiones de la pantalla actual
const window_height = window.innerHeight;
const window_width = window.innerWidth;

canvas.height = window_height;
canvas.width = window_width;
canvas.style.background = "#ff8";

// Clase Circle
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
    this.dy = -Math.abs(this.speed); // Siempre hacia arriba
    this.inCollision = false; // Para manejar el flasheo del color
    this.hasHitBottom = false; // Bandera para detectar si tocó el fondo
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
    if (!this.hasHitBottom) {
      this.posY += this.dy;
      if (this.posY - this.radius < 0) {
        this.dy = -this.dy; // Rebotar hacia abajo al tocar el borde superior
      }

      // Detectar si el círculo ha tocado el fondo del canvas
      if (this.posY + this.radius >= window_height) {
        this.dy = -this.dy * 0.8; // Rebote y reducir velocidad
        this.posY = window_height - this.radius; // Asegurarse de que no pase el borde
        if (Math.abs(this.dy) < 0.5) {
          this.dy = 0; // Detener el rebote si es lo suficientemente lento
          this.hasHitBottom = true; // Bloquear el círculo en el fondo
        }
      }
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

  // Función para verificar si el clic del mouse está dentro del círculo
  isClicked(mouseX, mouseY) {
    const distX = this.posX - mouseX;
    const distY = this.posY - mouseY;
    const distance = Math.sqrt(distX * distX + distY * distY); // Distancia entre el círculo y el clic
    return distance < this.radius; // Devuelve true si el clic está dentro del círculo
  }
}

// Crear un array para almacenar N círculos
let circles = [];

// Función para generar un círculo aleatorio que aparezca por debajo del canvas
function generateCircle(index) {
  let radius = Math.random() * 30 + 20; // Radio entre 20 y 50
  let x = Math.random() * (window_width - radius * 2) + radius; // Posición X aleatoria
  let y = window_height + radius; // Comienzan desde debajo del canvas
  let color = `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Color aleatorio
  let speed = Math.random() * 4 + 1; // Velocidad entre 1 y 5
  let text = `C${index + 1}`; // Etiqueta del círculo
  circles.push(new Circle(x, y, radius, color, text, speed));
}

// Función para generar todos los círculos uno por uno
function generateCircles(n) {
  for (let i = 0; i < n; i++) {
    // Usamos setTimeout para generar los círculos con un pequeño retraso
    setTimeout(() => {
      generateCircle(i); // Genera el círculo individualmente
    }, i * 500); // El tiempo entre la aparición de cada círculo (0.5 segundos entre cada uno)
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

// Función para eliminar un círculo cuando se hace clic sobre él
canvas.addEventListener("click", function (event) {
  const mouseX = event.clientX;
  const mouseY = event.clientY;

  // Filtrar los círculos que no han sido clicados
  circles = circles.filter(circle => !circle.isClicked(mouseX, mouseY));
});

// Función para animar los círculos
function animate() {
  ctx.clearRect(0, 0, window_width, window_height); // Limpiar el canvas
  circles.forEach(circle => {
    circle.update(ctx); // Actualizar cada círculo
  });
  detectCollisions(); // Detectar colisiones en cada cuadro de la animación
  requestAnimationFrame(animate); // Repetir la animación
}

// Generar N círculos de manera progresiva y comenzar la animación
generateCircles(10); // Puedes cambiar el número de círculos aquí
animate();
