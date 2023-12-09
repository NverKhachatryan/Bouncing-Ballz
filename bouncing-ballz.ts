class Ball {
    constructor(public x: number, public y: number, public radius: number, public vy: number) {}
  
    update(deltaTime: number, ctx: CanvasRenderingContext2D): boolean {
      const gravity = 9.81; 
      const damping = 0.3; // Damping factor on bounce
      const floorY = ctx.canvas.height - this.radius;
  
      // Update velocity with gravity applied
      this.vy += gravity * deltaTime;
  
      // Update position with velocity applied
      this.y += this.vy * deltaTime;
  
      // Bounce on floor with damping
      if (this.y > floorY) {
        this.y = floorY;
        this.vy = -this.vy * damping;
        
        // If the ball is barely moving after the bounce, consider it as stopped
        if (Math.abs(this.vy) < 0.01) {
          return false; // Ball has stopped moving
        }
      }
      return true; // Ball is still moving
    }
  
    draw(ctx: CanvasRenderingContext2D) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  class BouncingBallzApp {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private balls: Ball[] = [];
    private lastTime: number = 0;
  
    constructor(canvasId: string) {
      this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
      this.ctx = this.canvas.getContext('2d')!;
      this.canvas.addEventListener('click', this.spawnBall);
  
      requestAnimationFrame(this.tick);
    }
  
    private spawnBall = (event: MouseEvent) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const radius = 10; // Radius of the balls
      const vy = 0; // Initial y velocity
  
      if (this.balls.length < 15) {
        this.balls.push(new Ball(x, y, radius, vy));
      }
    }
  
    private tick = (currentTime: number) => {
      if (!this.lastTime) {
        this.lastTime = currentTime;
      }
      const deltaTime = (currentTime - this.lastTime) / 1000; // deltaTime in seconds
  
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      this.balls = this.balls.filter(ball => ball.update(deltaTime, this.ctx));
      this.balls.forEach(ball => ball.draw(this.ctx));
      
      this.lastTime = currentTime;
      requestAnimationFrame(this.tick);
    }
  }
  
  window.onload = () => {
    new BouncingBallzApp('bouncingBallzCanvas');
  };