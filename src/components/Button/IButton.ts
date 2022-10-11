export interface IButton {
    btnWidth: number;
    btnHeight: number;
    btnScale: number; 
    thickness: number;
    backgroundColor: number;
    initButton:() => void;
    show:(duration: number) => void;
    hide:(duration: number) => void;
    slideY:(startPos: number, endPos: number, duration: number) => void ;
}