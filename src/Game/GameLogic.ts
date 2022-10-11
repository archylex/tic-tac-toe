import { Point } from './Types';
import { DIRECTION } from './Direction';

const EXTEND_NUM = 2;

export class GameLogic {
    private board: string[][];
    private size: number = 0;
    private stepCounter: number = 0;
    private expansePercent: number;
    private win: number;

    constructor(size: number, win: number = 5, expanse: number = 0.7) {
        this.board = this.board = new Array(size).fill('').map(e => e = new Array(size).fill(''));
        this.size = size;
        this.expansePercent = expanse;
        this.win = win;
    }

    public getBoard(): string[][] {
        return this.board;
    }

    public addStep(player: string, pos: Point): void {
        if (this.board[pos.y] === undefined || this.board[pos.y][pos.x] === undefined) {
            throw new Error(` !!! Out of range !!!
                This move is not allowed. 
                ${player} was trying to go for ${JSON.stringify(pos)}.                
            `);
        }

        if (this.board[pos.y][pos.x] !== '') {
            throw new Error(`This move is not allowed. ${player} was trying to go for ${JSON.stringify(pos)}.`);
        }

        this.board[pos.y][pos.x] = player.toLowerCase();

        this.stepCounter++;
    }

    public extendBoard(): void {
        this.size += EXTEND_NUM;
        
        this.board.forEach(row => {
            row.unshift('');
            row.push('');
        });

        this.board.unshift(new Array(this.size).fill(''));
        this.board.push(new Array(this.size).fill(''));
    }

    public checkTimeToExtend(): boolean {
        return this.stepCounter / (this.size * this.size) >= this.expansePercent;
    }

    public getWinLine(player: string, pos: Point): Point[] {    
        let winLine: Point[] = [];
        let x = pos.x;
        let y = pos.y;
        
        for (const direct of DIRECTION) {
            let count = 1;   
            let result: Point [] = [];

            result.push({x: pos.x, y: pos.y});

            y = pos.y + direct.y;
            x = pos.x + direct.x;            

            while (this.board[y] !== undefined && this.board[y][x] !== undefined && this.board[y][x] === player.toLowerCase()) {
                count++;
                
                result.unshift({x: x, y: y});
                
                winLine = result;

                y += direct.y;
                x += direct.x;                   
            }

            y = pos.y - direct.y;
            x = pos.x - direct.x;

            while (this.board[y] !== undefined && this.board[y][x] !== undefined && this.board[y][x] === player.toLowerCase()) {
                count++;                
                
                result.push({x: x, y: y});
                
                winLine = result;
                
                y -= direct.y;
                x -= direct.x;                      
            }

            if (count >= this.win) {
                 return winLine;
            } 
        };

        return [];
    }
}