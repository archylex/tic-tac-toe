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
    private topPadding: number = 40;
    private spriteOffsetY: number = 88;
    private gamepadOffsetX: number = 162;
    private buttonOffsetX: number = 55;
    private buttonOffsetY: number = 132;
    private gamepadPos!: Point;
    private btnPos!: Point;
    private secondBtnPos!: Point;

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
        const btnOffsetY = this.buttonOffsetY + this.spriteOffsetY;        
        const offsetY = (this.topPadding + this.height - btnOffsetY) / 2;
        this.btnPos = {x: this.width/2 + this.buttonOffsetX, y: this.height - btnOffsetY};
        
        this.spriteX = this.add.sprite(this.width/2, offsetY, 'sprite', 'cross-7');
        const scale = this.height / this.spriteX.height / 3 ;
        const spriteOffsetX = this.spriteX.width / 4;
        this.spriteX.setX(this.width/2 + spriteOffsetX);
        
        this.spriteX.setScale(scale);
        this.spriteX.setOrigin(1,0.5);
        
        this.spriteO = this.add.sprite(this.width/2 + spriteOffsetX, offsetY, 'sprite', 'null-7');
        
        this.spriteO.setScale(scale);
        this.spriteO.setOrigin(0,0.5);
        
        this.startSingleButton = new TextButton(this, 'Одиночная', this.btnPos, this.startGame.bind(this));
        this.startSingleButton.initButton();

        this.secondBtnPos = JSON.parse(JSON.stringify(this.btnPos));
        this.secondBtnPos.y = this.height - this.buttonOffsetY;

        this.startFriendButton = new TextButton(this, 'С другом', this.secondBtnPos, this.startGame.bind(this));
        this.startFriendButton.initButton();

        this.gamepadPos = {x: this.width/2 - this.gamepadOffsetX, y: this.btnPos.y};

        this.startGameButton = new ImageButton(this, 'gamepad', this.gamepadPos, this.startGame.bind(this));
        this.startGameButton.btnHeight = 86;
        this.startGameButton.btnWidth = 86;
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

        const hideOffset = 300;
        this.startGameButton.slideY(this.gamepadPos.y+hideOffset, this.gamepadPos.y, duration);
        this.startFriendButton.slideY(this.secondBtnPos.y+hideOffset, this.secondBtnPos.y, duration);
        this.startSingleButton.slideY(this.btnPos.y+hideOffset, this.btnPos.y, duration);   
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

        const hideOffset = 300;
        this.startGameButton.slideY(this.gamepadPos.y, this.gamepadPos.y+hideOffset, duration);
        this.startFriendButton.slideY(this.secondBtnPos.y, this.secondBtnPos.y+hideOffset, duration);
        this.startSingleButton.slideY(this.btnPos.y, this.btnPos.y+hideOffset, duration);   
    }

    public startGame() {
        this.hide(400);        
    }
}