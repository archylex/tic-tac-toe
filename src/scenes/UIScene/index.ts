import { Scene, GameObjects } from "phaser";
import { Logo } from '../../components/Logo';
import { SCENE_NAME } from "../SceneName";
import { STATE } from "../../Game/State";

export class UIScene extends Scene {
    private width!: number;
    private height!: number;
    private state: STATE = STATE.ANIMATION;
    
    private hintText!: GameObjects.Text;
    private continueHintText!: GameObjects.Text;

    constructor() {
        super(SCENE_NAME.SCENE_UI);           
    }

    create(): void {
        this.height = Number(this.game.config.height);
        this.width = Number(this.game.config.width);

        const logo = new Logo(this,{x:18, y:10});
        logo.height = this.height * 0.0975;


        this.events.on('showhint', () => {
            this.showHint();
        }, this); 

        this.input.mouse.disableContextMenu();

        this.input.on('pointerup', (pointer: any) => {
            if (pointer.leftButtonReleased()) {
                if (this.state === STATE.CONTINUE_HINT) {
                    this.state = STATE.ANIMATION;
                    this.hideHint();
                }
            }
        });        
    }

    public showHint(): void {
        const bottomHintPos = this.height * 0.9; 
        
        this.continueHintText = this.add.text(this.width/2, bottomHintPos,
        'Нажмите, чтобы продолжить');
        this.continueHintText.setFontFamily('Arial');
        this.continueHintText.setColor('#ffffff');
        this.continueHintText.setFontSize(this.height * 0.0225);
        this.continueHintText.setAlign('center')
        this.continueHintText.setOrigin(0.5, 0.5);
        this.continueHintText.alpha = 0;

        this.hintText = this.add.text(this.width/2, 0,
        'Для победы постарайтесь\nвыставить в ряд 5\nкрестиков по горизонтали,\nвертикали или диагонали');
        this.hintText.setFontFamily('Arial');
        this.hintText.setColor('#ffffff');
        this.hintText.setFontSize(this.height * 0.04);
        this.hintText.setAlign('center');
        this.hintText.setOrigin(0.5, 1);
        this.hintText.alpha = 0;

        const startPos = this.height/2 - this.hintText.height / 4; 
        const endPos = this.height/2;

        this.tweens.add({
            targets: [this.hintText],      
            yoyo: false,
            alpha: {
                getStart: () => 0,
                getEnd: () => 1
            },
            y: {
                getStart: () => startPos,
                getEnd: () => endPos
            },
            duration: 500,            
            ease: 'Sine.easeInOut'            
        }); 

        this.tweens.add({
            targets: [this.continueHintText],      
            yoyo: false,
            alpha: {
                getStart: () => 0,
                getEnd: () => 1
            },          
            delay: 1000,  
            duration: 700,            
            ease: 'Sine.easeInOut',
            onComplete: () => {
                this.state = STATE.CONTINUE_HINT   
            }
        }); 
    }

    public hideHint(): void {
        const startPos = this.height/2 - this.hintText.height / 4; 
        const endPos = this.height/2;        
       
        this.tweens.add({
            targets: [this.hintText],      
            yoyo: false,
            alpha: {
                getStart: () => 1,
                getEnd: () => 0
            },
            y: {
                getStart: () => endPos,
                getEnd: () => startPos
            },
            duration: 500,            
            ease: 'Sine.easeInOut'            
        }); 

        this.tweens.add({
            targets: [this.continueHintText],      
            yoyo: false,
            alpha: {
                getStart: () => 1,
                getEnd: () => 0
            },          
            duration: 100,            
            ease: 'Sine.easeInOut',
            onComplete: () => {
                this.state = STATE.ANIMATION;   
                setTimeout(() => {
                    this.scene.get(SCENE_NAME.SCENE_INGAME).events.emit('start_game'); 
                }, 700);
            }
        }); 
    }        
}