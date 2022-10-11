export type Point = {
    x: number,
    y: number
}

export type CountCell = {
    count: number,
    empty: Point
}

export type CountKey = {
    [key: string]: number;
};

export type Atlas = {
    name: string,
    textureUrl: string,
    jsonUrl: string,
    frameRate: number
};
