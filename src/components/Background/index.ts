import { Scene } from "phaser";

export class Background {
    private width: number;
    private height: number;
    private graphics!: Phaser.GameObjects.Graphics;
    private scene: Scene;
    private pentagons: Phaser.GameObjects.Arc[];

    constructor(scene: Scene, width: number, height: number) {
        this.scene = scene;
        this.width = width;
        this.height = height;
        this.graphics = this.scene.add.graphics();  
        this.pentagons = [];
    }

    public init(): void {
        this.drawGradient();
        this.drawPentagon();
    }

    private drawGradient(): void {
        this.graphics.fillGradientStyle(0xbf3549, 0xc04437, 0xc12e57, 0xc03943, 1);
        this.graphics.fillRect(0, 0, this.width, this.height);        
    }

    private drawPentagon(): void {
        for(let i=0; i < 15; i++) {
            const x = Phaser.Math.Between(this.width*1/6, this.width*5/6);
            const y = this.height + Phaser.Math.Between(50, 1000);
            const size = Phaser.Math.Between(20, 120);
            const r = this.scene.add.circle(x, y, size, 0xcccccc, 0.05);
            r.setIterations(0.2);
            this.pentagons.push(r);
        }
    }

    public update(dt: number): void {
        this.pentagons.forEach((obj: Phaser.GameObjects.Arc) => {
            this.movePentagons(obj, 0.07, dt);
        });        
    }

    private movePentagons(obj: Phaser.GameObjects.Arc, speed: number, dt: number) {
        obj.y -= speed * dt;
        obj.rotation -= speed/500 * dt;
        if (obj.y < 0) {
            this.respawnPentagon(obj);
        }
    }
    
    private respawnPentagon(obj: Phaser.GameObjects.Arc) {
        obj.y = this.height + 120;
        obj.x = Math.random() * this.width;
        const size = Phaser.Math.Between(0.1, 1);
        obj.setScale(size);
    }
}