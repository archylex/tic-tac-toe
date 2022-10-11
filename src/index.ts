import { Game, Scale, Types, WEBGL } from 'phaser';
import {LoadingScene, BackgroundScene, GameScene, UIScene, StartMenuScene, GameOver} from './scenes';

export const gameConfig : Types.Core.GameConfig = {
    title: 'Tick-Tack-Toe',
    type: WEBGL,
    parent: 'game-canvas',
    backgroundColor: '#000000',
    scale: {
        mode: Scale.ScaleModes.RESIZE,
        width: window.innerWidth,
        height: window.innerHeight
    },
    callbacks: {
        postBoot: () => { window.sizeChanged(); }
    },
    canvasStyle: 'display: block; width: 100%; height: 100%;',
    autoFocus: true,
    audio: {
        disableWebAudio: false,
    },
    scene: [LoadingScene, BackgroundScene, StartMenuScene, GameScene, GameOver, UIScene]
}

window.sizeChanged = () => {
    if (window.game.isBooted) {
        setTimeout(() => {
            window.game.scale.resize(window.innerWidth, window.innerHeight);  
            window.game.canvas.setAttribute(
                'style',
                `display: block; width: ${window.innerWidth}px; height: ${window.innerHeight}px;`
            );
        }, 100);
    }
};

window.onresize = () => window.sizeChanged();

document.body.classList.add('root');

window.game = new Game(gameConfig);












///
let n = 3;
let d1_template: number = 0b100010001; // 3
let d2_template: number = 0b100010001; // n-2 = 1
let v_template: number = 0b1001001; // n-1 = 2
let h_template: number = 0b111;

let str = '1001001';
str.charCodeAt(0).toString(2);

console.log(d1_template);

function createWinTemplates(num: number, size: number) {
    const horizontal: number = generateMask(num, size, size);
    const vertical: number = generateMask(num, size, 1) ;
    const d1: number = generateMask(num, size, 0) ;
    const d2: number = generateMask(num, size, 2);
    console.log(horizontal.toString(2));
    console.log(vertical.toString(2));
    console.log(d1.toString(2));
    console.log(d2.toString(2));
}

const generateMask = (n: number, size: number, offset: number, s: number = 0): number => {
    if (n === 1) return 1;
    s = 1 << (size + 1 - offset) * (n - 1);
    return s + generateMask(n - 1, size, offset, s);    
}

const countBits = (n: number) => {
    let count = 0;
    while (n != 0) {
        count++;
        n >>= 1;
    }
      
    return count;
}

createWinTemplates(n,n);

const player = 0b100001010100000;
const tmp = 0b10101;

function checkWin(board: number, mask: number) {
    for (let i = 0; i < (countBits(board) - countBits(mask)); i++) {
        const fragment = (board & (mask << i)) >> i ;
        if (fragment === mask) return true;
    }
    return false;
}

console.log(checkWin(player, tmp));

