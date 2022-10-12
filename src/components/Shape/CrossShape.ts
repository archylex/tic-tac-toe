import { Scene } from 'phaser';
import { Shape } from './Shape';

export class CrossShape extends Shape {
    protected scene: Scene;
    protected frames: number = 0;
    protected spriteName: string = 'shape';

    constructor(scene: Scene, key: string) {
        super(scene, key);
        this.scene = scene;
        this.spriteName = key;
    }

    public generateTexture(size: number, thickness: number, color: number, alpha: number, frames: number): void {
        const frameSize = Math.sqrt(2 * size * size);
        const graphics = this.scene.add.graphics();

        this.frames = frames;
        
        graphics.setAngle(45);
        graphics.fillStyle(color, alpha);

        let x: number = 1;

        for (let i: number = 1; i <= frames/2; i++) {
            const path = i / (frames / 2);
            const vx = size * x + size / 2 - thickness / 2;
            const vy = -1 * size * x;
            graphics.fillRoundedRect(vx, vy, thickness, size * path, thickness/2);
            
            x++;
        }

        for (let i: number = 1; i <= frames/2; i++) {
            const path = i / (frames / 2);
            const vx = size * x + size / 2 - thickness / 2;
            const vy = -1 * size * x; 
            
            graphics.fillRoundedRect(vx, vy, thickness, size, thickness/2);

            const hx = size * x;
            const hy = size / 2 - thickness / 2 - size * x;
            
            graphics.fillRoundedRect(hx, hy, size * path, thickness, thickness/2);
            
            x++;
        }

        graphics.generateTexture(this.spriteName, frameSize * (frames + 1), frameSize);
        
        graphics.clear();        

        const atlasTexture = this.scene.textures.get(this.spriteName);
        
        for (let i: number = 1; i <= frames; i++) {
            atlasTexture.add(`${this.spriteName}-${i}`, 0, frameSize * i - frameSize/2, 0, frameSize, frameSize);            
        }        
    }
}