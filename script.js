const myImage = new Image();

fetch("./image1.txt")
  .then(function (res) {
    return res.text();
  })
  .then(function (data) {
    myImage.src = data;
  });

myImage.addEventListener("load", function () {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 821;
  canvas.height = 890;

  //   Add gradient color
  const gradient1 = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient1.addColorStop(0.2, "pink");
  gradient1.addColorStop(0.3, "red");
  gradient1.addColorStop(0.4, "orange");
  gradient1.addColorStop(0.5, "yellow");
  gradient1.addColorStop(0.6, "green");
  gradient1.addColorStop(0.7, "turquoise");
  gradient1.addColorStop(0.8, "violet");

  let switcher = 1;
  let counter = 0;

  setInterval(function () {
    counter++;

    if (counter % 50 === 0) {
      switcher *= -1;
    }
  }, 500);

  ctx.drawImage(myImage, 0, 0, canvas.width, canvas.height);
  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let particlesArray = [];
  const numberOfParticles = 5000;

  let mappedImage = [];
  for (let y = 0; y < canvas.height; y++) {
    let row = [];
    for (let x = 0; x < canvas.width; x++) {
      const red = pixels.data[y * 4 * pixels.width + x * 4];
      const green = pixels.data[y * 4 * pixels.width + (x * 4 + 1)];
      const blue = pixels.data[y * 4 * pixels.width + (x * 4 + 2)];
      const brightness = calculateRelativeBrightness(red, green, blue);
      const cell = [
        (cellBrightness = brightness),
        (cellColor = "rgb(" + red + "," + green + "," + blue + ")"),
      ];
      row.push(cell);
    }
    mappedImage.push(row);
  }

  function calculateRelativeBrightness(red, green, blue) {
    let value1 = red * red * 0.299;
    let value2 = green * green * 0.587;
    let value3 = blue * blue * 0.114;

    return Math.sqrt(value1 + value2 + value3) / 100;
  }

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.speed = 0;
      this.velocity = Math.random() * 0.5;
      this.size = Math.random() * 1.5 + 1;
      this.position1 = Math.floor(this.y);
      this.position2 = Math.floor(this.x);
      this.angle = 0;
    }

    update() {
      this.position1 = Math.floor(this.y);
      this.position2 = Math.floor(this.x);

      //   Maps the speed to the brightness of the pixel color
      if (
        mappedImage[this.position1] &&
        mappedImage[this.position1][this.position2]
      ) {
        this.speed = mappedImage[this.position1][this.position2][0];
      }

      let movement = 2.5 - this.speed + this.velocity;
      this.angle += this.speed / 20;
      this.size = this.speed * 1.5;

      if (switcher === 1) {
        ctx.globalCompositeOperation = "luminosity";
      } else {
        ctx.globalCompositeOperation = "lighten";
      }

      if (counter % 50 === 0) {
        this.x = Math.random() * canvas.width;
        this.y = 0;
      }

      //   Changes the angle of the particles
      this.y += movement * Math.cos(this.angle);
      this.x += movement + Math.sin(this.angle);
      //   this.x += movement;

      if (this.y >= canvas.height) {
        this.y = 0;
        this.x = Math.random() * canvas.width;
      }

      if (this.x >= canvas.width) {
        this.x = 0;
        this.y = Math.random() * canvas.height;
      }
    }

    draw() {
      ctx.beginPath();
      //   Gets the colors of the particles
      if (
        mappedImage[this.position1] &&
        mappedImage[this.position1][this.position2]
      ) {
        // ctx.fillStyle = mappedImage[this.position1][this.position2][1];
        ctx.strokeStyle = mappedImage[this.position1][this.position2][1];
      }

      //   ctx.fillStyle = gradient1;
      //   ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.strokeRect(this.x, this.y, this.size, this.size);
      //   ctx.fillText("#", this.x, this.y);
      ctx.fill();
    }
  }

  function init() {
    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle());
    }
  }

  init();

  function animate() {
    ctx.globalAlpha = 0.05;
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 0.2;
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
      ctx.globalAlpha = particlesArray[i].speed * 0.5;
      //   ctx.globalAlpha = 1;
      particlesArray[i].draw();
    }
    requestAnimationFrame(animate);
  }

  animate();
});
