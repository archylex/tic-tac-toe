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
        this.signSprite.displayWidth = this.height/5;
        this.signSprite.displayHeight = this.height/5;
        
        this.label = this.add.text(this.width/2, this.height/2, message, { font: "40px Arial", color: '#ffffff' });
        this.label.setAlign('center')
        this.label.setOrigin(0.5, 0.5);
        this.label.alpha = 0;

        this.shareLabel = this.add.text(this.width/2, this.height*1.2, 'Поделитесь игрой с \n друзьями', { font: "14px Arial", color: '#ffffff', align: 'right' });
        this.shareLabel.setOrigin(1, 0.5);

        const pos: Point = {x: this.width/2, y: this.height * 1.2};
        
        this.restartButton = new TextButton(this, 'Играть еще', pos, this.restartGame.bind(this));
        this.restartButton.initButton(); 

        const vkBtnPos: Point = {x: this.width/2 + 52, y: this.height * 1.2};
        const fbBtnPos: Point = {x: this.width/2 + 116, y: this.height * 1.2};
        
        this.fbButton = new ImageButton(this, 'fb', fbBtnPos, this.restartGame.bind(this));
        this.fbButton.backgroundColor = 0xa11c22;
        this.fbButton.btnHeight = 48;
        this.fbButton.btnWidth = 48;
        this.fbButton.thickness = 0;
        this.fbButton.initButton(); 
        
        this.vkButton = new ImageButton(this, 'vk', vkBtnPos, this.restartGame.bind(this));
        this.vkButton.backgroundColor = 0xa11c22;
        this.vkButton.btnHeight = 48;
        this.vkButton.btnWidth = 48;
        this.vkButton.thickness = 0;
        this.vkButton.initButton(); 

        // show and scale sign
        this.tweens.add({
            targets: [this.signSprite],  
            scale: 2,          
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
                    scale: 1.8,          
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
                this.restartButton.slideY(this.height*1.2, this.height * 0.82, 500);  
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
                this.restartButton.slideY(this.height * 0.82, this.height*1.2, 500);  
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