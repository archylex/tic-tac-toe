import { Scene } from 'phaser';
import { Shape } from './Shape';

export class CircleShape extends Shape {
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
        let angle = -90;        

        this.frames = frames;
        
        graphics.lineStyle(thickness, color, alpha);

        for (let i: number = 1; i <= frames; i++) {
            angle += 360 / frames - 1;            

            graphics.beginPath();
            graphics.arc(frameSize*i - frameSize/2, frameSize/2, size/2 - thickness, Phaser.Math.DegToRad(-90), Phaser.Math.DegToRad(angle), false);
            
            if (i === frames) {                
                graphics.closePath();    
            }
            
            graphics.strokePath();
            
        }

        graphics.generateTexture(this.spriteName, frameSize * (frames + 1), frameSize);
        
        graphics.clear();        

        const atlasTexture = this.scene.textures.get(this.spriteName);
        
        for (let i: number = 1; i <= frames; i++) {
            atlasTexture.add(`${this.spriteName}-${i}`, 0, frameSize * i - frameSize, 0, frameSize, frameSize);            
        }          
    }
}