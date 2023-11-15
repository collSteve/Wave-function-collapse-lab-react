import { Rotation } from "../shared/tile-relations";

// tile with no orientation or flip properties
export interface IRawTile {

}

export interface ITile{
    id: string;
    rotation: Rotation;
    flipHorizontal?: boolean;
}

