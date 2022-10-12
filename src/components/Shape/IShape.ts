export interface IShape {    
    generateTexture:(size: number, thickness: number, color: number, alpha: number, frames: number) => void;
    createAnimation:(frameRate: number) => void;
}