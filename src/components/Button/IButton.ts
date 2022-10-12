export interface IButton {
    btnWidth: number;
    btnHeight: number;
    btnScale: number; 
    thickness: number;
    backgroundColor: number;
    initButton:() => void;
    slideY:(startPos: number, endPos: number, duration: number) => void ;
}