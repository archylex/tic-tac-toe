import { GameObjects, Scene } from "phaser";
import { Button } from '../Button/Button';
import { Point } from '../../Game/Types';

export class TextButton extends Button {
    protected scene: Scene; 
    protected graphics: GameObjects.Graphics;
    protected label!: GameObjects.Text;
    protected position: Point;
    protected onClickAction: Function;
    protected text: string;
    public textSize: number = 36;
    public textColor: string = '#ae302b';
    public textFont: string = 'Arial';

    constructor(scene: Scene, text: string, position: Point, callback: Function) {
        super(scene, position, callback);
        this.scene = scene;
        this.graphics = this.scene.add.graphics();
        this.position = position;
        this.onClickAction = callback;
        this.text = text;        
    }

    public initButton() {
        super.initButton();

        this.label = this.scene.add.text(0, 0, this.text);
        this.label.setFontFamily(this.textFont);
        this.label.setAlign('center');
        this.label.setOrigin(0.5,0.5);
        this.label.setFontSize(this.textSize);
        this.label.setColor(this.textColor);
        this.label.setX(this.position.x);

        this.rectSprite.on('pointerdown', () => {
            this.label.setScale(this.btnScale);
            this.label.setX(this.label.x);
            this.label.setY(this.label.y );
        })
        .on('pointerup', () => {
            this.label.setScale(1);
            this.label.setX(this.label.x);
            this.label.setY(this.label.y);
        });   
    }

    public slideY(startPos: number, endPos: number, duration: number): void {
        super.slideY(startPos, endPos, duration);
        
        this.scene.tweens.add({
            targets: [this.label],  
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