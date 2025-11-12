const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Kích thước canvas
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

// Định nghĩa các đối tượng game
class Tank {
    constructor(x, y, width, height, color, controls) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.speed = 5;
        this.direction = 0; // Góc tính bằng độ, 0 là hướng lên trên
        this.controls = controls;
        this.bullets = [];
        this.cooldown = 0;
        this.cooldownMax = 10; // Số frame phải chờ để bắn viên đạn tiếp theo
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.direction * Math.PI / 180);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
        
        // Vẽ nòng súng
        ctx.fillStyle = this.color;
        ctx.fillRect(-2, -this.height/2 - 15, 4, 15);
        ctx.restore();

        // Vẽ đạn
        this.bullets.forEach(bullet => {
            bullet.draw();
        });
    }

    update(keys) {
        // Xử lý di chuyển
        if (keys[this.controls.up]) {
            this.x += Math.sin(this.direction * Math.PI / 180) * this.speed;
            this.y -= Math.cos(this.direction * Math.PI / 180) * this.speed;
        }
        if (keys[this.controls.down]) {
            this.x -= Math.sin(this.direction * Math.PI / 180) * this.speed;
            this.y += Math.cos(this.direction * Math.PI / 180) * this.speed;
        }
        if (keys[this.controls.left]) {
            this.direction -= 5;
        }
        if (keys[this.controls.right]) {
            this.direction += 5;
        }

        // Giới hạn trong canvas
        if (this.x < 0) this.x = 0;
        if (this.x > canvasWidth) this.x = canvasWidth;
        if (this.y < 0) this.y = 0;
        if (this.y > canvasHeight) this.y = canvasHeight;

        // Xử lý bắn đạn
        if (this.cooldown > 0) {
            this.cooldown--;
        }
        if (keys[this.controls.fire] && this.cooldown === 0) {
            this.shoot();
            this.cooldown = this.cooldownMax;
        }

        // Cập nhật đạn
        this.bullets.forEach((bullet, index) => {
            bullet.update();
            // Xóa đạn nếu ra khỏi màn hình
            if (bullet.x < 0 || bullet.x > canvasWidth || bullet.y < 0 || bullet.y > canvasHeight) {
                this.bullets.splice(index, 1);
            }
        });
    }

    shoot() {
        const bulletX = this.x + Math.sin(this.direction * Math.PI / 180) * (this.height/2 + 10);
        const bulletY = this.y - Math.cos(this.direction * Math.PI / 180) * (this.height/2 + 10);
        const bullet = new Bullet(bulletX, bulletY, this.direction);
        this.bullets.push(bullet);
    }
}

class Bullet {
    constructor(x, y, direction) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.speed = 10;
        this.radius = 3;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.closePath();
    }

    update() {
        this.x += Math.sin(this.direction * Math.PI / 180) * this.speed;
        this.y -= Math.cos(this.direction * Math.PI / 180) * this.speed;
    }
}

// Khởi tạo các xe tăng
const tank1 = new Tank(100, 100, 30, 20, 'red', {
    up: 'KeyW',
    down: 'KeyS',
    left: 'KeyA',
    right: 'KeyD',
    fire: 'Space'
});

const tank2 = new Tank(700, 500, 30, 20, 'blue', {
    up: 'ArrowUp',
    down: 'ArrowDown',
    left: 'ArrowLeft',
    right: 'ArrowRight',
    fire: 'Enter'
});

// Xử lý sự kiện bàn phím
const keys = {};

window.addEventListener('keydown', (e) => {
    keys[e.code] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

// Vòng lặp game
function gameLoop() {
    // Xóa màn hình
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Cập nhật và vẽ xe tăng
    tank1.update(keys);
    tank1.draw();

    tank2.update(keys);
    tank2.draw();

    requestAnimationFrame(gameLoop);
}

gameLoop();
