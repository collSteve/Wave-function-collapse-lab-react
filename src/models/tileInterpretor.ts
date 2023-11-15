import { RelativeDirection, WorldDirection } from "../shared/tile-relations";
import { IConnector } from "./connector";
import { ITile } from "./tile";
import { RuledTile } from "./tile-rule";

export type TilesFromConnectorsQuery = {
    [key in WorldDirection]: IConnector[];
}

export interface ITileInterpretor {
    interpretTileSet(): void;

    reloadTileRules(tileRules: RuledTile[]): void;

    queryPossibleTiles(query: TilesFromConnectorsQuery): ITile[];

    queryPossibleConnectorsFromTiles(query: ITile[]): {[key in WorldDirection]: ITile[]};
}

export interface ITileConnectorInterpretor extends ITileInterpretor {
    getAllConnectors(): IConnector[];
}

export class TileInterpretor implements ITileConnectorInterpretor{
    private tileRules: RuledTile[];
    constructor(tileRules: RuledTile[]) {
        this.tileRules = tileRules;
        this.interpretTileSet();
    }
    getAllConnectors(): IConnector[] {
        throw new Error("Method not implemented.");
    }

    interpretTileSet() {
        throw new Error("Method not implemented.");
    }

    reloadTileRules(tileRules: RuledTile[]): void {
        this.tileRules = tileRules;
        this.interpretTileSet();
    }

    queryPossibleTiles(query: TilesFromConnectorsQuery): ITile[] {
        throw new Error("Method not implemented.");
    }

    queryPossibleConnectorsFromTiles(query: ITile[]): {[key in WorldDirection]: ITile[]} {
        throw new Error("Method not implemented.");
    }
}