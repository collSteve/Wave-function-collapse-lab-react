import { TileGridStructure } from "../components/tile-grid";
import { Position2D, Rotation } from "../shared/tile-relations";
import { ITileInterpretor } from "./tileInterpretor";

export type TileInWFCInfo = {
    id: string;
    position: Position2D;
    rotation: Rotation;
    flipHorizontal?: boolean;
}

export interface IWFCBuilder {
    setTile(tile: TileInWFCInfo): void;
    build(): void;
    getTileGrid(): TileInWFCInfo[][];
    getDisplayTileGrid(): TileGridStructure;
    reset(): void;
    loadTileInterpretor(tileInterpretor: ITileInterpretor): void
}