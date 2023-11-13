import { RelativeDirection } from "../shared/tile-relations";
import { IConnector } from "./connector";
import { ITile } from "./tile";
import { RuledTile } from "./tile-rule";

export type TileInterpretorQuery = {
    [key in RelativeDirection]: IConnector[];
}

export interface ITileInterpretor {
    interpretTileSet(): void;

    reloadTileRules(tileRules: RuledTile[]): void;

    queryPossibleTiles(query: TileInterpretorQuery): ITile[];
}

export class TileInterpretor implements ITileInterpretor{
    private tileRules: RuledTile[];
    constructor(tileRules: RuledTile[]) {
        this.tileRules = tileRules;
        this.interpretTileSet();
    }

    interpretTileSet() {
        throw new Error("Method not implemented.");
    }

    reloadTileRules(tileRules: RuledTile[]): void {
        this.tileRules = tileRules;
        this.interpretTileSet();
    }

    queryPossibleTiles(query: TileInterpretorQuery): ITile[] {
        throw new Error("Method not implemented.");
    }


}