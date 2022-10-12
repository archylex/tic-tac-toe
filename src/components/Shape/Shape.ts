import { Scene } from 'phaser';
import { IShape } from './IShape';

export class Shape implements IShape {
    protected scene: Scene;
    protected frames: number = 0;
    protected spriteName: string = 'shape';

    constructor(scene: Scene, key: string) {
        this.scene = scene;
        this.spriteName = key;
    }

    public generateTexture(size: number, thickness: number, color: number, alpha: number, frames: number): void {
        
    }

    public createAnimation(frameRate: number): void {
        this.scene.anims.create({
            key: this.spriteName,
            frames: this.scene.anims.generateFrameNames(this.spriteName, {
              prefix: `${this.spriteName}-`,
              end: this.frames,
            }),
            frameRate: frameRate,
        });        
    }
}