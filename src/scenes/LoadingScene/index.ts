import { Scene } from "phaser";
import { CrossShape } from '../../components/Shape/CrossShape';
import { CircleShape } from '../../components/Shape/CircleShape';
import { RoundRectShape } from '../../components/Shape/RoundRectShape';
import { RoundQuadShape } from '../../components/Shape/RoundQuadShape';
import { AnimationLoader } from '../../Game/AnimationLoader';
import { SCENE_NAME } from '../SceneName';


export class LoadingScene extends Scene {
    private animationLoader: AnimationLoader;
    private crossShape!: CrossShape;
    private circleShape!: CircleShape;

    constructor() {
        super(SCENE_NAME.SCENE_LOADING);

        this.animationLoader = new AnimationLoader(this);
    }

    preload() : void {
        this.load.baseURL = 'assets/';

        this.crossShape = new CrossShape(this, 'CrossShape');
        this.crossShape.generateTexture(100, 20, 0xffffff, 1, 12);
        this.circleShape = new CircleShape(this, 'CircleShape');
        this.circleShape.generateTexture(100, 20, 0xe688a3, 1, 12);
        
        const roundRectShape = new RoundRectShape(this, 'RoundRectShape');
        roundRectShape.generateTexture(280, 72, 0xffffff, 1, 1);

        const roundQuadShape = new RoundQuadShape(this, 'RoundQuadShape');
        roundQuadShape.generateTexture(86, 4, 0xffffff, 1, 1);

        const roundQuadShape2 = new RoundQuadShape(this, 'RoundQuadShape2');
        roundQuadShape2.generateTexture(48, 2, 0xa11c22, 1, 1);

        this.animationLoader.load('sprite', 'sprites.png', 'sprites.json', 30);

        this.load.image('logo', 'logo_hezzl.png');

        this.load.image('gamepad', 'gamepad.png');

        this.load.image('hand', 'hand.png');

        this.load.image('vk', 'vk.png');
        this.load.image('fb', 'fb.png');
    }

    create(): void {
        this.crossShape.createAnimation(60);
        this.circleShape.createAnimation(60);
        this.animationLoader.createAllAnimations();

        this.scene.start(SCENE_NAME.SCENE_BACKGROUND);
        this.scene.start(SCENE_NAME.SCENE_STARTMENU);
        this.scene.start(SCENE_NAME.SCENE_INGAME);    
        this.scene.start(SCENE_NAME.SCENE_UI);    
        this.scene.start(SCENE_NAME.SCENE_GAMEOVER);
    }
}