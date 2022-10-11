import { GameObjects, Scene } from 'phaser';
import { TextButton } from '../../components/Button/TextButton';
import { ImageButton } from '../../components/Button/ImageButton';
import { Point } from '../../Game/Types';
import { SCENE_NAME } from '../SceneName';

export class StartMenuScene extends Scene {
    private width!: number;
    private height!: number;
    private startGameButton!: ImageButton;
    private spriteX!: GameObjects.Sprite;
    private spriteO!: GameObjects.Sprite;
    private startSingleButton!: TextButton;
    private startFriendButton!: TextButton;
    private gamepadPos!: Point;
    private singleButtonPos!: Point;
    private friendButtonPos!: Point;

    constructor() {
        super(SCENE_NAME.SCENE_STARTMENU);          
    }

    create() {
        this.height = Number(this.game.config.height);
        this.width = Number(this.game.config.width);

        this.createStartMenu();

        this.spriteX.alpha = 0;
        this.spriteO.alpha = 0;

        this.show(400);
    }

    public createStartMenu(): void {        
        const spriteOffsetX = this.width * 0.04;
        
        this.spriteX = this.add.sprite(this.width/2 - spriteOffsetX, this.height/2, 'sprite', 'cross-7');                     
        const scale = this.height * 0.225 / this.spriteX.height;
        this.spriteX.setScale(scale);
        this.spriteX.setOrigin(1,1);
        
        this.spriteO = this.add.sprite(this.width/2 + spriteOffsetX, this.height/2, 'sprite', 'null-7');        
        this.spriteO.setScale(scale);
        this.spriteO.setOrigin(0,1);

        this.singleButtonPos = {x: this.width * 0.609, y: this.height * 0.73};
        
        this.startSingleButton = new TextButton(this, 'Одиночная', this.singleButtonPos, this.startGame.bind(this));
        this.startSingleButton.btnHeight = this.height * 0.09;
        this.startSingleButton.btnWidth = this.startSingleButton.btnHeight * 3.9;
        this.startSingleButton.textSize = this.startSingleButton.btnHeight / 2;
        this.startSingleButton.initButton();

        this.friendButtonPos = {x: this.width * 0.609, y: this.height * 0.8375};        

        this.startFriendButton = new TextButton(this, 'С другом', this.friendButtonPos, this.startGame.bind(this));
        this.startFriendButton.btnHeight = this.height * 0.09;
        this.startFriendButton.btnWidth = this.startSingleButton.btnHeight * 3.9;
        this.startFriendButton.textSize = this.startSingleButton.btnHeight / 2;
        this.startFriendButton.initButton();

        this.gamepadPos = { x: this.width * 0.2, y: this.height * 0.73 };

        this.startGameButton = new ImageButton(this, 'gamepad', this.gamepadPos, this.startGame.bind(this));
        this.startGameButton.btnHeight = this.height * 0.1075;
        this.startGameButton.btnWidth = this.height * 0.1075;
        this.startGameButton.btnScale = 0.98;
        this.startGameButton.thickness = 2;
        this.startGameButton.initButton();        
    }

    public show(duration: number): void {
        this.tweens.add({
            targets: [this.spriteO, this.spriteX],  
            alpha: {
                getStart: () => 0,
                getEnd: () => 1
            },        
            yoyo: false,
            duration: duration,            
            ease: 'Sine.easeInOut'            
        }); 

        const hideOffset = this.height*1.2;
        this.startGameButton.slideY(this.gamepadPos.y+hideOffset, this.gamepadPos.y, duration);
        this.startFriendButton.slideY(this.friendButtonPos.y+hideOffset, this.friendButtonPos.y, duration);
        this.startSingleButton.slideY(this.singleButtonPos.y+hideOffset, this.singleButtonPos.y, duration);   
    }

    public hide(duration: number): void {
        this.tweens.add({
            targets: [this.spriteO, this.spriteX],  
            alpha: {
                getStart: () => 1,
                getEnd: () => 0
            },        
            yoyo: false,
            duration: duration,            
            ease: 'Sine.easeInOut',
            onComplete: () => {
                this.scene.get(SCENE_NAME.SCENE_UI).events.emit('showhint');
            }
        }); 

        const hideOffset = this.height*1.2;
        this.startGameButton.slideY(this.gamepadPos.y, this.gamepadPos.y+hideOffset, duration);
        this.startFriendButton.slideY(this.friendButtonPos.y, this.friendButtonPos.y+hideOffset, duration);
        this.startSingleButton.slideY(this.singleButtonPos.y, this.singleButtonPos.y+hideOffset, duration);   
    }

    public startGame() {
        this.hide(400);        
    }
}