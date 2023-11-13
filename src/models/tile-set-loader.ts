import { ITile } from "./tile";
import { RuledTile } from "./tile-rule";

export interface ITileSetLoader {
    loadTileSet(tileSet: string): void;

    getTile(tileId: string): ITile;

    getTileRules(): RuledTile[];
}

export class TileSetLoader implements ITileSetLoader {
    getTile(tileId: string): ITile {
        throw new Error("Method not implemented.");
    }
    loadTileSet(tileSet: string) {
        throw new Error("Method not implemented.");
    }

    getTileRules(): RuledTile[] {
        throw new Error("Method not implemented.");
    }
}