import { GameObjects, Scene } from "phaser";
import { Point } from '../../Game/Types';

export class Logo {
    private scene: Scene; 
    private graphics: GameObjects.Graphics;
    private position: Point;
    private height: number = 78;

    constructor(scene: Scene, position: Point) {
        this.scene = scene;
        this.graphics = this.scene.add.graphics();
        this.position = position;

        this.drawLogo();
    }

    private drawLogo() {
        const width = this.height * 2.97435;
        const offsetPic = this.height * 0.1538;
        this.graphics.fillStyle(0x353535, 0.2);
        this.graphics.fillRoundedRect(this.position.x, this.position.y, width, this.height, 36);
        
        const logo = this.scene.add.sprite(this.position.x+offsetPic/2, this.position.y+offsetPic/2, 'logo');
        logo.setOrigin(0,0)
       
    }
}