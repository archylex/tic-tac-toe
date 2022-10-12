import { GameObjects, Scene } from "phaser";
import { SCENE_NAME } from '../SceneName';
import { TextButton } from '../../components/Button/TextButton'
import { ImageButton } from '../../components/Button/ImageButton'
import { Point } from "../../Game/Types";

export class GameOver extends Scene {
    private restartButton!: TextButton;
    private label!: GameObjects.Text;
    private shareLabel!: GameObjects.Text;
    private signSprite!: GameObjects.Sprite;
    private fbButton!: ImageButton;
    private vkButton!: ImageButton;
    private width!: number;
    private height!: number;

    constructor() {
        super(SCENE_NAME.SCENE_GAMEOVER);
    }

    create() {
        this.height = Number(this.game.config.height);
        this.width = Number(this.game.config.width);

        this.events.on('gameover', (sign: string) => {
            this.show(sign);
        }, this); 
    }

    public show(sign: string): void {
        const message = sign === 'x' ? 'Вы выиграли' : 'Вы проиграли';     
        const frame = sign === 'x' ? 'cross-7' : 'null-7';

        this.signSprite = this.add.sprite(this.width/2, this.height/2, 'sprite', frame);
        const spriteScale = this.height * 0.185 / this.signSprite.height;
        this.signSprite.setScale(spriteScale);
        
        this.label = this.add.text(this.width/2, this.height/2, message);
        this.label.setColor('#ffffff');
        this.label.setFontFamily('Arial');
        this.label.setFontSize(this.height*0.05);
        this.label.setAlign('center');
        this.label.setOrigin(0.5, 0.5);
        this.label.alpha = 0;

        this.shareLabel = this.add.text(this.width/2, this.height*1.2, 'Поделитесь игрой с \n друзьями');
        this.shareLabel.setFontSize(this.height * 0.0175);
        this.shareLabel.setFontFamily('Arial');
        this.shareLabel.setColor('#ffffff');
        this.shareLabel.setAlign('right');
        this.shareLabel.setOrigin(1, 0.5);

        const pos: Point = {x: this.width/2, y: this.height * 1.2};
        
        this.restartButton = new TextButton(this, 'Играть еще', pos, this.restartGame.bind(this));
        this.restartButton.btnHeight = this.height * 0.09;
        this.restartButton.btnWidth = this.restartButton.btnHeight * 3.9;
        this.restartButton.textSize = this.restartButton.btnHeight / 2;
        this.restartButton.initButton(); 

        const vkBtnPos: Point = {x: this.width/2 + this.restartButton.btnWidth * 0.2143, y: this.height * 1.2};
        const fbBtnPos: Point = {x: this.width/2 + this.restartButton.btnWidth * 0.431, y: this.height * 1.2};
        
        this.fbButton = new ImageButton(this, 'fb', fbBtnPos, this.restartGame.bind(this));
        this.fbButton.btnSprite = 'RoundQuadShape2';
        this.fbButton.backgroundColor = 0xa11c22;
        this.fbButton.btnHeight = this.height * 0.0575;
        this.fbButton.btnWidth = this.height * 0.0575;
        this.fbButton.thickness = 0;
        this.fbButton.initButton(); 
        
        this.vkButton = new ImageButton(this, 'vk', vkBtnPos, this.restartGame.bind(this));
        this.vkButton.btnSprite = 'RoundQuadShape2';
        this.vkButton.backgroundColor = 0xa11c22;
        this.vkButton.btnHeight = this.height * 0.0575;
        this.vkButton.btnWidth = this.height * 0.0575;
        this.vkButton.thickness = 0;
        this.vkButton.initButton(); 

        // show and scale sign
        this.tweens.add({
            targets: [this.signSprite],  
            scale: 2  * spriteScale/1.8,          
            yoyo: false,
            alpha: {
                getStart: () => 0,
                getEnd: () => 1
            },            
            duration: 1600,            
            ease: 'Sine.easeInOut',
            onComplete: () => {
                // scale back
                this.tweens.add({
                    targets: [this.signSprite],  
                    scale: 1.8 * spriteScale/1.8,          
                    yoyo: false,                    
                    duration: 300,            
                    ease: 'Sine.easeInOut',
                    onComplete: () => {
                        // move up
                        this.tweens.add({
                            targets: [this.signSprite],  
                            yoyo: false,
                            y: {
                                getStart: () => this.signSprite.y,
                                getEnd: () => this.height * 0.35
                            },
                            duration: 200,            
                            ease: 'Sine.easeInOut'                            
                        });
                    }
                });

                // show text
                this.tweens.add({
                    targets: [this.label],  
                    alpha: {
                        getStart: () => 0,
                        getEnd: () => 1
                    },    
                    yoyo: false,
                    y: {
                        getStart: () => this.height * 0.37,
                        getEnd: () => this.height * 0.53
                    },
                    delay: 500,
                    duration: 300,            
                    ease: 'Sine.easeInOut'
                });
            }
        }); 
        
        // share label popup
        this.tweens.add({
            targets: [this.shareLabel],  
            yoyo: false,
            y: {
                getStart: () => this.height*1.2,
                getEnd: () => this.height * 0.92
            },
            duration: 500,            
            ease: 'Sine.easeInOut',
            delay: 2200,
            onStart: () => {
                this.restartButton.slideY(this.height*1.2, this.height * 0.825, 500);  
                this.fbButton.slideY(this.height*1.2, this.height * 0.92, 500);  
                this.vkButton.slideY(this.height*1.2, this.height * 0.92, 500);  
            }                      
        });
    }

    private restartGame(): void {
        // hide sign and text
        this.tweens.add({
            targets: [this.signSprite, this.label],  
            yoyo: false,
            alpha: {
                getStart: () => 1,
                getEnd: () => 0
            },            
            duration: 500,            
            ease: 'Sine.easeInOut'            
        }); 

        // hide popup
        this.tweens.add({
            targets: [this.shareLabel],  
            yoyo: false,
            y: {
                getStart: () => this.height * 0.92,
                getEnd: () => this.height*1.2
            },
            duration: 500,            
            ease: 'Sine.easeInOut',
            onStart: () => {
                this.restartButton.slideY(this.height * 0.825, this.height*1.2, 500);  
                this.fbButton.slideY(this.height * 0.92, this.height*1.2, 500);  
                this.vkButton.slideY(this.height * 0.92, this.height*1.2, 500);  
            },
            onComplete: () => {                
                setTimeout(() => {
                    this.scene.get(SCENE_NAME.SCENE_INGAME).events.emit('start_game');                               
                }, 500);
            }                              
        });
    }
}