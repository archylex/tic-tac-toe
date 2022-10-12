import { Scene } from 'phaser';
import { Shape } from './Shape';

export class RoundRectShape extends Shape {
    protected scene: Scene;
    protected frames: number = 0;
    protected spriteName: string = 'shape';

    constructor(scene: Scene, key: string) {
        super(scene, key);
        this.scene = scene;
        this.spriteName = key;
    }

    public generateTexture(size: number, thickness: number, color: number, alpha: number = 1, frames: number = 1): void {
        const graphics = this.scene.add.graphics();
               
        graphics.fillStyle(0x000000, 0.2);
        graphics.fillRoundedRect(2, 2, size, thickness + 4, Math.floor(size/12));        

        graphics.fillStyle(color, alpha);
        graphics.fillRoundedRect(0, 0, size, thickness, Math.floor(size/16));
                    
        graphics.generateTexture(this.spriteName, size+4, thickness+4);
        
        graphics.clear();                 
    }
}