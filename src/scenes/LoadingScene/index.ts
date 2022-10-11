import { Scene } from "phaser";
import { AnimationLoader } from '../../Game/AnimationLoader';
import { SCENE_NAME } from '../SceneName';


export class LoadingScene extends Scene {
    private animationLoader: AnimationLoader;

    constructor() {
        super(SCENE_NAME.SCENE_LOADING);

        this.animationLoader = new AnimationLoader(this);
    }

    preload() : void {
        this.load.baseURL = 'assets/';

        this.animationLoader.load('sprite', 'sprites.png', 'sprites.json', 30);

        this.load.image('logo', 'logo_hezzl.png');

        this.load.image('gamepad', 'gamepad.png');

        this.load.image('hand', 'hand.png');

        this.load.image('vk', 'vk.png');
        this.load.image('fb', 'fb.png');
    }

    create(): void {
        this.animationLoader.createAllAnimations();

        this.scene.start(SCENE_NAME.SCENE_BACKGROUND);
        this.scene.start(SCENE_NAME.SCENE_STARTMENU);
        this.scene.start(SCENE_NAME.SCENE_INGAME);    
        this.scene.start(SCENE_NAME.SCENE_UI);    
        this.scene.start(SCENE_NAME.SCENE_GAMEOVER);
    }
}