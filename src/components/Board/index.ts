import { GameObjects, Scene } from "phaser";
import { Point } from '../../Game/Types';
import { getAngleByPoints } from '../../utils/Converter';

type Sign = {
    [key: string]: string;
}

export class Board {
    private scene: Scene;
    private boardSize: number;
    private boardWidth: number;
    private cellWidth: number;
    private x: number = 0;
    private y: number = 0;
    private thickness: number = 6;
    private lineColor: number = 0x000011;
    private winLineColor: number = 0xfd9b97;
    private lineAlpha: number = 0.2;
    private duration: number = 200;
    private signScale: number = 0.75;
    private hLines: GameObjects.Rectangle[];
    private vLines: GameObjects.Rectangle[];
    private cellSprites: GameObjects.Sprite[][];
    private signs: Sign = {
        'x': 'cross',
        'o': 'null'
    };

    constructor(scene: Phaser.Scene, boardSize: number, boardWidth: number) {
        this.scene = scene;
        this.boardSize = boardSize;        
        this.boardWidth = boardWidth;

        this.cellWidth = this.boardWidth / this.boardSize; 

        this.hLines = [];
        this.vLines = [];
        this.cellSprites = [];

        this.createGrid();
        this.generateEmptyTexture();
        this.createSprites();     
    }

    public setPosition(x: number, y: number): void {
        this.x = x;
        this.y = y;

        this.update();
    }

    public setWidth(width: number): void {
        this.boardWidth = width;

        this.cellWidth = this.boardWidth / this.boardSize; 

        this.update();
    }

    public setThickness(thickness: number): void {
        this.thickness = thickness;

        this.update();
    }

    public setLineColor(color: number): void {
        this.lineColor = color;

        this.update();
    }

    public setWinLineColor(color: number): void {
        this.winLineColor = color;
    }

    public getBoardSize(): number {
        return this.boardSize;
    }

    public addSignAtBoard(position: Point, sign: string, callback?: Function): void {        
        this.cellSprites[position.y][position.x].play(this.signs[sign]);
        const scale = this.cellWidth / this.cellSprites[position.y][position.x].width * this.signScale;
        this.cellSprites[position.y][position.x].setScale(scale, scale);

        this.cellSprites[position.y][position.x].disableInteractive();

        if (callback !== null && callback !== undefined) {
            this.cellSprites[position.y][position.x].on('animationcomplete', () => {
                callback();
            });
        }
    }

    public show(duration: number): void {
        const startScale = (this.boardSize - 2) / this.boardSize;
        
        this.hLines.forEach((line) => {
            line.scaleX = startScale;
        });

        this.vLines.forEach((line) => {
            line.scaleX = startScale;
        });        

        this.scene.tweens.add({
            targets: [...this.vLines, ...this.hLines],  
            scale: 1,
            alpha: {
                getStart: () => 0,
                getEnd: () => 1
            },        
            yoyo: false,
            duration: duration,            
            ease: 'Sine.easeInOut'            
        }); 
    }

    public expand(): void {        
        this.addNewLines();

        this.boardSize += 2;
        this.addNewSprites();
        this.updateDataSprites();
                
        // scale up animation
        const scale = (this.boardWidth + 2 * this.cellWidth) / this.boardWidth;

        this.scaleLines(this.hLines, 'scaleX', scale, this.scaleBoardAnimation.bind(this, 1, this.duration, 0, 1, 1));
        this.scaleLines(this.vLines, 'scaleY', scale);

        this.cellWidth = this.boardWidth / this.boardSize;         
    }

    public createGrid(): void {   
        const startScale = (this.boardSize - 2) / this.boardSize;
        const startAlpha = 0;

        for (let i: number = 0; i < this.boardSize - 1; i++) {            
            const hline = this.scene.add.rectangle(
                this.x, 
                this.y - this.boardWidth/2 + this.cellWidth * (i + 1), 
                this.boardWidth, 
                this.thickness, 
                this.lineColor, 
                this.lineAlpha
            );
            hline.scaleX = startScale;
            hline.alpha = startAlpha;
            this.hLines.push(hline);

            const vline = this.scene.add.rectangle(
                this.x - this.boardWidth/2 + this.cellWidth * (i + 1), 
                this.y, 
                this.thickness, 
                this.boardWidth, 
                this.lineColor, 
                this.lineAlpha
            );            
            vline.scaleY = startScale;
            vline.alpha = startAlpha;
            this.vLines.push(vline);
        }
    }

    public showWinAnimation(cells: Point[]): void {
        // draw win line        
        const posX = this.cellSprites[cells[0].y][cells[0].x].x;
        const posY = this.cellSprites[cells[0].y][cells[0].x].y;
        const posX2 = this.cellSprites[cells[cells.length-1].y][cells[cells.length-1].x].x;
        const posY2 = this.cellSprites[cells[cells.length-1].y][cells[cells.length-1].x].y;
        const width = Math.sqrt(Math.pow(posY2 - posY, 2) + Math.pow(posX2 - posX, 2));
        const line = this.scene.add.rectangle(posX , posY, this.thickness, width, this.winLineColor, 1);
        line.scaleY = 0.1;

        // get sprites by line
        const winSprites: GameObjects.Sprite[] = [];
        

        // set line direction
        const angle = getAngleByPoints(cells[0].x, cells[0].y, cells[cells.length-1].x, cells[cells.length-1].y);
        
        line.setOrigin(0, 0);
        line.setRotation(angle);
        
        // start line animation
        this.scene.tweens.add({
            targets: [line],  
            scaleY: 1,          
            yoyo: false,
            duration: this.duration * 2,            
            ease: 'Sine.easeInOut',
            onComplete: () => {
                // create win sprite duplicates
                cells.forEach(pos => {            
                    const winSprite = this.createSprite(0, 0);
                    winSprite.frame = this.cellSprites[pos.y][pos.x].frame;                                   
                    winSprite.width = this.cellSprites[pos.y][pos.x].width;
                    winSprite.height = this.cellSprites[pos.y][pos.x].height;            
                    winSprite.setScale(this.cellSprites[pos.y][pos.x].scale);
                    winSprite.setOrigin(0.5, 0.5);
                    winSprite.setPosition(this.cellSprites[pos.y][pos.x].x, this.cellSprites[pos.y][pos.x].y); 
                    winSprites.push(winSprite);
                    this.cellSprites[pos.y][pos.x].setTexture('emptyCell');            
                });

                // scale win sprites
                winSprites.forEach(sprite =>{
                    this.scene.tweens.add({
                        targets: [sprite],  
                        scale: (sprite.scale * sprite.width * this.signScale) / this.cellWidth,          
                        yoyo: false,
                        duration: this.duration,            
                        ease: 'Sine.easeInOut'                        
                    });            

                    // move sprites to center                           
                    this.scene.tweens.add({
                        targets: [sprite],  
                        scale: (sprite.scale * sprite.width * this.signScale) / this.cellWidth, 
                        x: {
                            getStart: () => sprite.x,
                            getEnd: () => this.x
                        },
                        y: {
                            getStart: () => sprite.y,
                            getEnd: () => this.y
                        },   
                        yoyo: false,
                        delay: this.duration * 4,
                        duration: this.duration * 4/3,            
                        ease: 'Sine.easeInOut',
                    });
                });

                // hide line
                this.scene.tweens.add({
                    targets: [line],  
                    alpha: {
                        getStart: () => 1,
                        getEnd: () => 0
                    },   
                    yoyo: false,
                    duration: this.duration*2,            
                    ease: 'Sine.easeInOut',
                });

                // scale and hide board
                const oldBoardWidth = this.boardWidth;
                this.boardWidth = this.boardWidth - 2 * this.cellWidth;
                this.cellWidth = this.boardWidth / this.boardSize;
                const scale = this.boardWidth / oldBoardWidth;
                this.scaleBoardAnimation(scale, 700, this.duration * 5, 1, 0);

                winSprites.forEach(sprite =>{
                    this.scene.tweens.add({
                        targets: [sprite],  
                        alpha: {
                            getStart: () => 1,
                            getEnd: () => 0
                        },
                        delay: 1500,
                        yoyo: false,
                        duration: this.duration,            
                        ease: 'Sine.easeInOut'                        
                    });          
                });
            }
        }); 
    }

    private generateEmptyTexture(): void {
        const graphics = this.scene.make.graphics({x: 0, y: 0, add: false});
        graphics.fillStyle(0xffffff, 0);
        graphics.fillRect(0, 0, this.cellWidth, this.cellWidth);
        graphics.generateTexture('emptyCell', this.cellWidth, this.cellWidth);
        
        graphics.destroy();
    }

    private scaleBoardAnimation(scale: number, duration: number, delay: number = 0, startAlpha: number = 1, endAlpha: number = 1): void {
        this.hLines.forEach((line, index)=> {                        
            const y = this.y - this.boardWidth/2 + this.cellWidth * (index + 1);

            this.scene.tweens.add({
                targets: [line],
                delay: delay,
                scaleX: scale,
                y: {
                    getStart: () => line.y,
                    getEnd: () => y
                },
                alpha: {
                    getStart: () => startAlpha,
                    getEnd: () => endAlpha
                },
                yoyo: false,
                duration: duration,
                ease: 'Sine.easeInOut'
            });
        });

        this.vLines.forEach((line, index)=> {            
            const x = this.x - this.boardWidth/2 + this.cellWidth * (index + 1);

            this.scene.tweens.add({
                targets: [line],
                delay: delay,
                scaleY: scale,
                x: {
                    getStart: () => line.x,
                    getEnd: () => x
                },
                alpha: {
                    getStart: () => startAlpha,
                    getEnd: () => endAlpha
                },
                yoyo: false,
                duration: duration,
                ease: 'Sine.easeInOut'
            });
        });

        this.cellSprites.forEach((sprites, row)=> {
            sprites.forEach((sprite, column) => {
                const x = this.x - this.boardWidth/2 + column * this.cellWidth + this.cellWidth/2;
                const y = this.y - this.boardWidth/2 + row * this.cellWidth + this.cellWidth/2;
                const scale = this.cellWidth / sprite.width * this.signScale;

                this.scene.tweens.add({
                    targets: [sprite],
                    delay: delay,
                    scale: scale,
                    x: {
                        getStart: () => sprite.x,
                        getEnd: () => x
                    },
                    y: {
                        getStart: () => sprite.y,
                        getEnd: () => y
                    },
                    alpha: {
                        getStart: () => startAlpha,
                        getEnd: () => endAlpha
                    },
                    yoyo: false,
                    duration: duration,
                    ease: 'Sine.easeInOut'
                });
            });
        });
    }

    private scaleLines(array: GameObjects.Rectangle[], scaleKey: string = 'scaleX', scale: number, callback?: Function): void {
        array.forEach((line) => {  
            this.scene.tweens.add({
                targets: [line],
                [scaleKey]: scale,
                yoyo: false,
                duration: this.duration,
                ease: 'Sine.easeInOut',
                onComplete: callback
            });
        });
    }

    private addNewLines(): void {        
        let line = this.scene.add.rectangle(this.x + this.boardWidth/2 , this.y, this.thickness, this.boardWidth, this.lineColor, this.lineAlpha);
        this.vLines.push(line);
        
        line = this.scene.add.rectangle(this.x - this.boardWidth/2, this.y, this.thickness, this.boardWidth, this.lineColor, this.lineAlpha);
        this.vLines.unshift(line);

        line = this.scene.add.rectangle(this.x, this.y + this.boardWidth/2, this.boardWidth, this.thickness, this.lineColor, this.lineAlpha);
        this.hLines.push(line);

        line = this.scene.add.rectangle(this.x, this.y - this.boardWidth/2, this.boardWidth, this.thickness, this.lineColor, this.lineAlpha);
        this.hLines.unshift(line);
    }

    private addNewSprites(): void { 
        this.cellSprites.forEach(cells=>{
            cells.unshift(this.createSprite(0, 0));
            cells.push(this.createSprite(0, 0));
        });

        this.cellSprites.unshift(this.createSpriteArray());        
        this.cellSprites.push(this.createSpriteArray());                          
    }

    private updateDataSprites(): void {
        this.cellSprites.forEach((sprites, row)=> {
            sprites.forEach((sprite, column) => {                
                const position = JSON.stringify({ y: row, x: column });
                sprite.setData('position', position);

                const x = this.x - this.boardWidth/2 - this.cellWidth + column * this.cellWidth + this.cellWidth/2;
                const y = this.y - this.boardWidth/2 - this.cellWidth + row * this.cellWidth + this.cellWidth/2;
                sprite.setPosition(x, y);
                sprite.setDisplaySize(this.cellWidth * this.signScale, this.cellWidth * this.signScale);
            });
        });        
    }

    private createSpriteArray(): GameObjects.Sprite[] {
        const array: GameObjects.Sprite[] = [];
        
        for (let i: number = 0; i < this.boardSize; i++) {
            array.push(this.createSprite(0, 0));  
        }

        return array;
    }

    private createSprite(row: number, column: number): GameObjects.Sprite {
        const sprite: GameObjects.Sprite = this.scene.add.sprite(0, 0, 'emptyCell');
        sprite.setDisplaySize(this.cellWidth * this.signScale, this.cellWidth * this.signScale);        

        const position = JSON.stringify({ y: row, x: column });

        sprite.setData('position', position);
        sprite.setData('type', 'cellSprite');        
        sprite.setInteractive();
        
        return sprite;
    }

    private createSprites(): void {
        for (let row: number = 0; row < this.boardSize; row++) {
            const array: GameObjects.Sprite[] = [];

            for (let column: number = 0; column < this.boardSize; column++) {
                const sprite = this.createSprite(row, column);                                
                array.push(sprite);                
            }

            this.cellSprites.push(array);
        }
    }
  
    private update(): void {
        this.hLines.forEach((line, i) => {
            line.setX(this.x); 
            line.setY(this.y - this.boardWidth/2 + this.cellWidth * (i + 1));
            line.displayWidth = this.boardWidth;
            line.displayHeight = this.thickness;
            line.fillColor = this.lineColor;
            line.fillAlpha = this.lineAlpha;
        });

        this.vLines.forEach((line, i) => {
            line.setX(this.x - this.boardWidth/2 + this.cellWidth * (i + 1)); 
            line.setY(this.y);
            line.displayWidth = this.thickness;
            line.displayHeight = this.boardWidth;
            line.fillColor = this.lineColor;
            line.fillAlpha = this.lineAlpha;
        });

        this.cellSprites.forEach((sprites, row)=> {
            sprites.forEach((sprite, column) => {
                const x = this.x - this.boardWidth/2 + column * this.cellWidth + this.cellWidth/2;
                const y = this.y - this.boardWidth/2 + row * this.cellWidth + this.cellWidth/2;
                sprite.setPosition(x, y);
                sprite.setDisplaySize(this.cellWidth * this.signScale, this.cellWidth * this.signScale);
            });
        });
    }  
}