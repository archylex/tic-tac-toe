
export function rowAndColumnToId(row: number, column: number, size: number): number {
    return row * size + column;
}

export function getHypotenuse(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2));
}

export function getAngleByPoints(x1: number, y1: number, x2: number, y2: number): number {
    const dX = x2 - x1;
    const dY = y2 - y1;
    let angle = 0;

    if (dX === 0) {
        angle = 0;
    } else if (dY === 0) {
        angle = -Math.PI/2;
    } else if (dX > 0) {
        angle = -Math.PI/4;
    } else if (dX < 0) {
        angle = angle = Math.PI/4;
    }

    return angle;
}