import { IButton } from './IButton';
import { GameObjects, Scene } from "phaser";
import { Point } from '../../Game/Types';

export class Button implements IButton {
    protected scene: Scene; 
    protected graphics: GameObjects.Graphics;
    protected position: Point;
    protected onClickAction: Function;
    protected rectSprite!: GameObjects.Sprite;
    public btnWidth: number = 280;
    public btnHeight: number = 72;
    public btnScale: number = 0.98;
    public thickness: number = 2;
    public backgroundColor: number = 0xffffff;
    public btnSprite: string = 'RoundRectShape';

    constructor(scene: Scene, position: Point, callback: Function) {
        this.scene = scene;
        this.graphics = this.scene.add.graphics();
        this.position = position;
        this.onClickAction = callback; 
    }
    
    public initButton(): void  {
        this.rectSprite = this.scene.add.sprite(this.position.x, this.position.y, this.btnSprite, this.btnSprite + '-0');
        this.rectSprite.setOrigin(0.5, 0.5);    
        
        this.rectSprite.setInteractive({ useHandCursor: true, 
            hitArea: new Phaser.Geom.Rectangle(0, 0, this.btnWidth, this.btnHeight),
            hitAreaCallback: Phaser.Geom.Rectangle.Contains,
        });

        this.rectSprite.on('pointerdown', () => {
            this.rectSprite.setScale(this.btnScale);
        })
        .on('pointerup', () => {
            this.rectSprite.setScale(1);
            this.onClickAction();
        });       
    }
    
    public slideY(startPos: number, endPos: number, duration: number): void {
        this.scene.tweens.add({
            targets: [this.rectSprite],  
            y: {
                getStart: () => startPos,
                getEnd: () => endPos
            },        
            yoyo: false,
            duration: duration,            
            ease: 'Sine.easeInOut'            
        });   
    }
}