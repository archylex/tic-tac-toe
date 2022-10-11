import { GameObjects, Scene } from "phaser";
import { SCENE_NAME } from "../SceneName";
import { Board } from '../../components/Board';
import { GameLogic } from '../../Game/GameLogic';
import { SimpleBot } from '../../Game/SimpleBot';
import { STATE } from '../../Game/State';
import { Point } from "../../Game/Types";

export class GameScene extends Scene {
    private board!: Board;
    private gameLogic!: GameLogic;
    private simpleBot!: SimpleBot;
    private state: STATE = STATE.PLAYER_STEP;
    private handSprite!: GameObjects.Sprite;
    private width!: number;
    private height!: number;

    constructor() {
        super(SCENE_NAME.SCENE_INGAME);
    }

    create(): void {       
        this.height = Number(this.game.config.height);
        this.width = Number(this.game.config.width);

        this.events.on('start_game', this.startGame.bind(this));   
    }   

    public startGame(): void { 
        this.gameLogic = new GameLogic(5, 5);

        this.simpleBot = new SimpleBot(5, 'o', 'x');   

        this.input.on('gameobjectdown',this.pickUp, this);

        this.board = new Board(this, 5, this.height * 0.55); 
        this.board.setPosition(this.width/2, this.height/2);        
        this.board.show(300);

        // hand hint
        this.handSprite = this.add.sprite(this.width/2, this.height/2, 'hand');

        this.tweens.add({
            targets: [this.handSprite],  
            y: {
                getStart: () => this.height/2,
                getEnd: () => this.height/2 + this.handSprite.height/2
            },        
            yoyo: false,
            duration: 800,            
            ease: 'Sine.easeInOut',
            onComplete: () => {
                this.tweens.add({
                    targets: [this.handSprite],  
                    scale: 0.9,        
                    yoyo: true,
                    duration: 300,            
                    repeatDelay: 700,
                    ease: 'Easing.Elastic.In',
                    repeat: -1                    
                });
            }
        });  

        this.state = STATE.PLAYER_STEP;
    }
    
    private checkWin(player: string, num: Point): boolean {
        const winLine = this.gameLogic.getWinLine(player, num);
        
        if (winLine.length > 0) {            
            this.board.showWinAnimation(winLine);
            return true;
        }

        return false;
    }

    private checkExpanse(): void {
        if (this.gameLogic.checkTimeToExtend()) {
            this.gameLogic.extendBoard();
            this.board.expand();
        }     
    }

    private getBotStep(): Point {
        const botStep = this.simpleBot.getMove(this.gameLogic.getBoard())//this.bot.getStep(this.gameLogic.getBoard());
        
        this.gameLogic.addStep('o', botStep);
        
        return botStep;
    }
    
    pickUp(pointer: unknown, gameObject: GameObjects.Sprite): void {   
        if (gameObject.getData('type') !== 'cellSprite') return;

        if (this.handSprite.visible) {
            this.handSprite.visible = false;
        }

        if (this.state !== STATE.PLAYER_STEP) return;
  
        gameObject.disableInteractive();

        const playerPos = JSON.parse(gameObject.getData('position'));

        this.gameLogic.addStep('x', playerPos);
                        
        this.state = STATE.ANIMATION;

        this.board.addSignAtBoard(playerPos, 'x');

        const isWin = this.checkWin('x', playerPos);
        
        if (!isWin) {
            this.checkExpanse();
        } else {
            this.state = STATE.WIN;
            this.emitGameOver('x');
        }       

        setTimeout(() => {
            if (this.state === STATE.WIN) return;

            this.state = STATE.BOT_STEP;

            const botStep = this.getBotStep();
            
            this.state = STATE.ANIMATION;

            this.board.addSignAtBoard(botStep, 'o');

            const isWin = this.checkWin('o', botStep);

            if (!isWin) {
                this.checkExpanse();
            } else {
                this.state = STATE.LOSE;                                    
                this.emitGameOver('o');
            }

            if (this.state !== STATE.LOSE) {
                this.state = STATE.PLAYER_STEP;
            }
        }, 700);
    }    

    private emitGameOver(sign: string): void {
        setTimeout(() => {
            this.scene.get(SCENE_NAME.SCENE_GAMEOVER).events.emit('gameover', sign); 
        }, 1300);
    }
}