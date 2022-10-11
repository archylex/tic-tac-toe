import { GameObjects, Scene } from "phaser";
import { Point } from '../../Game/Types';

export class Logo {
    private scene: Scene; 
    private graphics: GameObjects.Graphics;
    private position: Point;

    constructor(scene: Scene, position: Point) {
        this.scene = scene;
        this.graphics = this.scene.add.graphics();
        this.position = position;

        this.drawLogo();
    }

    private drawLogo() {
        const btnWidth = 230;
        const btnHeight = 74;
        const offsetPic = 12;
        this.graphics.fillStyle(0x353535, 0.2);
        this.graphics.fillRoundedRect(this.position.x-btnWidth/2, this.position.y-btnHeight/2, btnWidth, btnHeight, 36);
        
        const logo = this.scene.add.sprite(this.position.x-offsetPic, this.position.y, 'logo');
       
    }
}