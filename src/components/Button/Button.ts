import { IButton } from './IButton';
import { GameObjects, Scene } from "phaser";
import { Point } from '../../Game/Types';

export class Button implements IButton {
    protected scene: Scene; 
    protected graphics: GameObjects.Graphics;
    protected position: Point;
    protected onClickAction: Function;
    public btnWidth: number = 280;
    public btnHeight: number = 72;
    public btnScale: number = 0.98;
    public thickness: number = 2;
    public backgroundColor: number = 0xffffff;

    constructor(scene: Scene, position: Point, callback: Function) {
        this.scene = scene;
        this.graphics = this.scene.add.graphics();
        this.position = position;
        this.onClickAction = callback; 
    }
    
    public initButton(): void  {
        this.graphics.displayOriginX = 0.5;
        this.graphics.displayOriginY = 0.5;
        
        this.graphics.setX(this.position.x-this.btnWidth/2);
        this.graphics.setY(this.position.y-this.btnHeight/2);

        this.graphics.fillStyle(this.backgroundColor, 1);
        this.graphics.fillRoundedRect(0, 0, this.btnWidth, this.btnHeight, 12);

        this.graphics.lineStyle(this.thickness, 0x000000, 0.2);
        this.graphics.strokeRoundedRect(-this.thickness/2, -this.thickness/2, this.btnWidth+this.thickness, this.btnHeight+this.thickness, 12);

        this.graphics.setInteractive({ useHandCursor: true, 
            hitArea: new Phaser.Geom.Rectangle(0, 0, this.btnWidth, this.btnHeight),
            hitAreaCallback: Phaser.Geom.Rectangle.Contains,
        });

        const offsetXBtn = this.btnWidth * (1 - this.btnScale) / 2;
        const offsetYBtn = this.btnHeight * (1 - this.btnScale) / 2;

        this.graphics.on('pointerdown', () => {
            this.graphics.setScale(this.btnScale);
            this.graphics.setX(this.graphics.x + offsetXBtn);
            this.graphics.setY(this.graphics.y + offsetYBtn);
        })
        .on('pointerup', () => {
            this.graphics.setScale(1);
            this.graphics.setX(this.graphics.x - offsetXBtn);
            this.graphics.setY(this.graphics.y - offsetYBtn);
            this.onClickAction();
        });       
    }

    public show(duration: number): void {
        this.scene.tweens.add({
            targets: [this.graphics],  
            alpha: {
                getStart: () => 0,
                getEnd: () => 1
            },        
            yoyo: false,
            duration: duration,            
            ease: 'Sine.easeInOut'            
        });   
    }

    public hide(duration: number): void {
        this.scene.tweens.add({
            targets: [this.graphics],  
            alpha: {
                getStart: () => 1,
                getEnd: () => 0
            },        
            yoyo: false,
            duration: duration,            
            ease: 'Sine.easeInOut'            
        });   
    }

    public slideY(startPos: number, endPos: number, duration: number): void {
        this.scene.tweens.add({
            targets: [this.graphics],  
            y: {
                getStart: () => startPos - this.btnHeight/2,
                getEnd: () => endPos - this.btnHeight/2
            },        
            yoyo: false,
            duration: duration,            
            ease: 'Sine.easeInOut'            
        });   
    }
}