var canvas = document.querySelector("canvas");
var c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

// Variables
var mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2,
};

var colors = ["#2E112D", "#540032", "#820333", "#C9283E", "#F0433A"];

var gravity = 0;
var friction = 0.9;

// Event Listeners
addEventListener("mousemove", function (event) {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

addEventListener("resize", function () {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    init();
});

addEventListener("click", function (event) {
    init();
});

// Utility Functions
function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)];
}

// Objects
function Ball(x, y, dx, dy, radius, color) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.color = color;

    this.update = function () {
        if (this.y + this.radius > canvas.height) {
            this.y = canvas.height - this.radius;
            this.dy = -this.dy * friction;
            this.dx = this.dx * friction;
        } else if (this.y - this.radius < 0) {
            this.y = this.radius;
            this.dy = -this.dy * friction;
            this.dx = this.dx * friction;
        }

        if (this.x + this.radius > canvas.width) {
            this.x = canvas.width - this.radius;
            this.dx = -this.dx * friction;
        } else if (this.x - this.radius < 0) {
            this.x = this.radius;
            this.dx = -this.dx * friction;
        }

        this.dy += gravity;

        this.x += this.dx;
        this.y += this.dy;

        this.draw();
    };

    this.draw = function () {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
        c.closePath();
    };
}

// Implementation
var ballArray = [];

function init() {
    ballArray = [];

    for (let i = 0; i < 250; i++) {
        var radius = randomIntFromRange(8, 30);
        var x = randomIntFromRange(radius, canvas.width - radius);
        var y = randomIntFromRange(radius, canvas.height - radius);
        var dx = randomIntFromRange(-5, 5);
        var dy = randomIntFromRange(-3, 3);
        ballArray.push(new Ball(x, y, dx, dy, radius, randomColor(colors)));
    }
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    c.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < ballArray.length; i++) {
        ballArray[i].update();
    }
}

init();
animate();