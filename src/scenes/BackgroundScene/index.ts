import { Scene } from 'phaser';
import { Background } from '../../components/Background'
import { SCENE_NAME } from '../SceneName';

export class BackgroundScene extends Scene {
    private width!: number;
    private height!: number;
    private background!: Background;

    constructor() {
        super(SCENE_NAME.SCENE_BACKGROUND);          
    }

    create(): void {
        this.height = Number(this.game.config.height);
        this.width = Number(this.game.config.width);
        
        this.background = new Background(this, this.width, this.height);
        this.background.init();
    }

    update(time: number, delta: number): void {
        this.background.update(delta);
    }
}