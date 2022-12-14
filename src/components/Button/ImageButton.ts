import { GameObjects, Scene } from "phaser";
import { Button } from '../Button/Button';
import { Point } from '../../Game/Types';

export class ImageButton extends Button {
    protected scene: Scene; 
    protected graphics: GameObjects.Graphics;
    protected sprite!: GameObjects.Sprite;
    protected position: Point;
    protected onClickAction: Function;
    public image: string;

    constructor(scene: Scene, image: string, position: Point, callback: Function) {
        super(scene, position, callback);
        this.scene = scene;
        this.graphics = this.scene.add.graphics();
        this.position = position;
        this.onClickAction = callback;
        this.image = image;        
    }
   
    public initButton() {
        super.initButton();

        this.sprite = this.scene.add.sprite(this.position.x, this.position.y, this.image);

        const scaler = (this.btnHeight * 0.96) / this.sprite.height;
        this.sprite.setScale(scaler);

        this.rectSprite.on('pointerdown', () => {
            this.sprite.setScale(this.btnScale * scaler);
        })
        .on('pointerup', () => {
            this.sprite.setScale(scaler);
        });   
    }

    public slideY(startPos: number, endPos: number, duration: number): void {
        super.slideY(startPos, endPos, duration);

        this.scene.tweens.add({
            targets: [this.sprite],  
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