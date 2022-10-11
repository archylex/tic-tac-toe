import { Game, Scale, Types, WEBGL } from 'phaser';
import {LoadingScene, BackgroundScene, GameScene, UIScene, StartMenuScene, GameOver} from './scenes';

export const gameConfig : Types.Core.GameConfig = {
    title: 'Tic-Tac-Toe',
    type: WEBGL,
    parent: 'game-canvas',
    backgroundColor: '#000000',
    scale: {
        mode: Scale.ScaleModes.RESIZE,
        width: window.innerWidth,
        height: window.innerHeight
    },
    canvasStyle: 'display: block; width: 100%; height: 100%;',
    autoFocus: true,
    width: window.innerWidth,
    height: window.innerHeight,
    audio: {
        disableWebAudio: false,
    },
    scene: [LoadingScene, BackgroundScene, StartMenuScene, GameScene, GameOver, UIScene]
}

document.body.classList.add('root');

window.game = new Game(gameConfig);

