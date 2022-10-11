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

        this.label = this.scene.add.text(this.position.x, this.position.y, this.text)
        .setStyle({ font: "36px Arial", fill: "#ae302b", align: "center" }).setOrigin(0.5,0.5);

        const offsetXBtn = this.btnWidth * (1 - this.btnScale) / 2;
        const offsetYBtn = this.btnHeight * (1 - this.btnScale) / 2;

        this.graphics.on('pointerdown', () => {
            this.label.setScale(this.btnScale);
            this.label.setX(this.label.x + offsetXBtn);
            this.label.setY(this.label.y + offsetYBtn);
        })
        .on('pointerup', () => {
            this.label.setScale(1);
            this.label.setX(this.label.x - offsetXBtn);
            this.label.setY(this.label.y - offsetYBtn);
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