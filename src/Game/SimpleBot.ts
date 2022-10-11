import { Point, CountCell } from './Types';
import { DIRECTION } from './Direction';

export class SimpleBot {
    private winCount: number = 0;
    private sign: string;
    private opponentSign: string;

    constructor(win: number, sign: string = 'o', opponentSign: string = 'x') {
        this.winCount = win;
        this.sign = sign;
        this.opponentSign = opponentSign;
    }

    public setSign(sign: string) {
        this.sign = sign.toLowerCase();
    }

    public setOpponentSign(sign: string) {
        this.opponentSign = sign.toLowerCase();
    }

    public getMove(board: string[][]): Point {
        // check win combination
        const winCell = this.getWinCell(board, this.sign);

        if (winCell.count === this.winCount - 1) {
            if (winCell.empty.x >= 0 && winCell.empty.y >= 0) {
                return winCell.empty;
            }
        }

        // check opponent win combination
        const opponentWinCell = this.getWinCell(board, this.opponentSign);

        if (opponentWinCell.count === this.winCount - 1) {
            if (opponentWinCell.empty.x >= 0 && opponentWinCell.empty.y >= 0) {
                return opponentWinCell.empty;
            }
        }
        
        // check possible opponent combination     
        console.log('oppo', opponentWinCell.empty, opponentWinCell.count)   
        if (opponentWinCell.count >= 2) {
            if (opponentWinCell.empty.x >= 0 && opponentWinCell.empty.y >= 0) {
                return opponentWinCell.empty;
            }
        }
        
        // check empty center
        const centerCell = this.getCenterCell(board);

        if (centerCell.x >= 0 && centerCell.y >= 0) {
            return centerCell;
        }

        // check empty angles
        const angleCell: Point = this.getEmptyAngle(board);

        if (angleCell.x >= 0 && angleCell.y >= 0) {
            return angleCell;
        }

        // check possible opponent move
        if (opponentWinCell.empty.x >= 0 && opponentWinCell.empty.y >= 0) {
            return opponentWinCell.empty;
        }
                
        return this.getRandomEmptyCell(board);
    }

    private getRandomEmptyCell(board: string[][]): Point {
        const array: Point[] = []
        for (let row = 0; row < board.length; row++) {
            for (let column = 0; column < board.length; column++) {
                if (board[row][column] === '') {
                    array.push({ x: column, y: row });
                }
            }
        }

        const index = Math.floor(Math.random() * array.length);
        
        return array[index];
    }

    private getCenterCell(board: string[][]): Point {
        const center = Math.floor(board.length/2);
        if (board[center][center] === '') {
            return { x: center, y: center };
        }
        return { x: -1, y: -1 };
    }

    private getWinCell(board: string[][], sign: string): CountCell {
        let maxCount = 0;
        let emptyCell: Point = { x: -1, y: -1 };

        for (let row = 0; row < board.length; row++) {
            for (let column = 0; column < board.length; column++) {
                if (board[row][column] === sign) {
                    for (let i = 0; i < DIRECTION.length; i++) {
                        const res = this.countByDirection(board, sign, {y: row, x: column}, DIRECTION[i]);                        
                        
                        if (res.count > maxCount && res.empty.x >= 0 && res.empty.y >= 0) {
                            maxCount = res.count;
                            emptyCell = res.empty;
                        }
                    }            
                }
            }
        }

        return { count: maxCount, empty: emptyCell };
    }

    private countByHalfDirection(board: string[][], sign: string, pos: Point, direct: Point, reverse: boolean = false): CountCell {
        let count: number = 0;
        const minus = reverse ? -1 : 1;
        let x = pos.x + direct.x * minus;
        let y = pos.y + direct.y * minus;

        while (board[y] !== undefined && board[y][x] !== undefined && board[y][x] === sign) {
            count++;
            x += direct.x * minus;
            y += direct.y * minus;
        }

        let emptyCell = board[y] !== undefined && board[y][x] !== undefined && board[y][x] === '' 
            ? { x: x, y: y } 
            : { x: -1, y: -1 };
        
        return { count: count, empty: emptyCell };
    }

    private countByDirection(board: string[][], sign: string, pos: Point, direct: Point): CountCell {
        const h1: CountCell = this.countByHalfDirection(board, sign, pos, direct);
        const h2: CountCell = this.countByHalfDirection(board, sign, pos, direct, true);
        let count: number = 1 + h1.count + h2.count;
        let emptyCell: Point = (h1.empty.x >= 0 && h1.empty.y >= 0) ? h1.empty : h2.empty;

        return { count: count, empty: emptyCell };
    }

    private getEmptyAngle(board: string[][]): Point {
        const angles: Point[] = [
            { x: 0, y: 0 },
            { x: board.length - 1, y: 0 },
            { x: 0, y: board.length - 1 },
            { x: board.length - 1, y: board.length - 1 },
        ]

        const emptyCells = angles.filter(pos => board[pos.y][pos.x] === '');

        if (emptyCells.length > 0) {
            const index = Math.floor(Math.random() * emptyCells.length); 
            return {x: emptyCells[index].x, y: emptyCells[index].y};
        } else {
            return { x: -1, y: -1 };
        }        
    }
}