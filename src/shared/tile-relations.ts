export enum Rotation {
    ZERO = 0,
    Deg90 = 90,
    Deg180 = 180,
    Deg270 = -90
}

export enum WorldDirection {
    North = 0,
    East = 90,
    South = 180,
    West = 270
}

export enum RelativeDirection {
    Up,
    Down,
    Left,
    Right
}

export interface Position2D {
    x: number;
    y: number;
}