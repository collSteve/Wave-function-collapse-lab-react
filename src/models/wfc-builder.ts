import { TileGridStructure } from "../components/tile-grid";
import { GridPosition, Rotation, WorldDirection, oppositeGlobalDirOf } from "../shared/tile-relations";
import { deepCopy } from "../shared/utils/deep-copy";
import { init2DArray, init2DArrayFunctional } from "../shared/utils/initializer";
import { IQueue, Queue } from "../shared/utils/queue";
import { SetOpConstants, intersectArrays } from "../shared/utils/set-theory";
import { IConnector } from "./connector";
import { ITile } from "./tile";
import { ITileSetLoader } from "./tile-set-loader";
import { ITileConnectorInterpretor, ITileInterpretor } from "./tileInterpretor";

export enum TileType {
    Empty,
    NonEmpty
}

export enum ConnectorEntropyTileType {
    Unset,
    GoballySettled,
    Settled
}
export type TileInWFCInfo = ITile & { position: GridPosition };

export type TileGridTile = TileInWFCInfo & {tileType: TileType};

export interface IWFCBuilder {
    setTile(tile: TileInWFCInfo): void;
    build(): void;
    getTileGrid(): TileInWFCInfo[][];
    reset(nRows?: number, nCols?: number): void;
    loadTileInterpretor(tileInterpretor: ITileInterpretor): void
}

export interface DisplayableWFC {
    getDisplayTileGrid(): TileGridStructure;

}

export class WFCBuilderByConnector implements IWFCBuilder, DisplayableWFC {
    private tileGrid: TileGridTile[][];
    private tileInterpretor: ITileConnectorInterpretor;
    private tileSetLoader: ITileSetLoader;

    constructor(tileInterpretor: ITileConnectorInterpretor, tileSetLoader: ITileSetLoader, nCol: number, nRow: number) {
        this.tileInterpretor = tileInterpretor;
        this.tileSetLoader = tileSetLoader;
        this.tileGrid = WFCBuilderByConnector.initTileGrid(nCol, nRow);
    }

    get gridShape(): { nCol: number, nRow: number } {
        return {
            nCol: this.tileGrid[0].length,
            nRow: this.tileGrid.length
        };
    }

    static initTileGrid(nCol: number, nRow: number): TileGridTile[][] {
        return init2DArrayFunctional(nCol, nRow, (row, col) => {
            return {
                tileType: TileType.Empty,
                id: "",
                position: { row: row, col: col },
                rotation: Rotation.ZERO
            };
        });
    }

    /**
     * @returns a 2D array of possible connectors for each tile in grid
     */
    computeConnectorEntropyDiagram(): ({[key in WorldDirection]: IConnector[]} & {tileType:ConnectorEntropyTileType, pos: GridPosition, tiles: ITile[]})[][] {
        const gridShape = this.gridShape;
        const connectorEntropyDiagram = init2DArrayFunctional<{[key in WorldDirection]: IConnector[]} & {tileType:ConnectorEntropyTileType, pos: GridPosition, tiles: ITile[]}>(gridShape.nRow, gridShape.nCol, 
            (row: number, col: number) =>{ 
                return{
                    [WorldDirection.North]: deepCopy(this.tileInterpretor.getAllConnectors()),
                    [WorldDirection.South]: deepCopy(this.tileInterpretor.getAllConnectors()),
                    [WorldDirection.East]: deepCopy(this.tileInterpretor.getAllConnectors()),
                    [WorldDirection.West]: deepCopy(this.tileInterpretor.getAllConnectors()),
                    tileType: ConnectorEntropyTileType.Unset,
                    pos: { row: row, col: col },
                    tiles: []
                };
            });

        // set settled tiles
        const settledTiles = this.getGloballySettledTiles();
        for (const settledTile of settledTiles) {
            const { row, col } = settledTile.position;
            connectorEntropyDiagram[row][col].tileType = ConnectorEntropyTileType.GoballySettled;
            connectorEntropyDiagram[row][col].tiles.push(
                deepCopy(settledTile)
            );

            // set connectors
            const tileRule = this.tileSetLoader.getTileRule(this.tileGrid[row][col].id);
            connectorEntropyDiagram[row][col][WorldDirection.North] = [deepCopy(tileRule.connectors[WorldDirection.North])];
            connectorEntropyDiagram[row][col][WorldDirection.South] = [deepCopy(tileRule.connectors[WorldDirection.South])];
            connectorEntropyDiagram[row][col][WorldDirection.West] = [deepCopy(tileRule.connectors[WorldDirection.West])];
            connectorEntropyDiagram[row][col][WorldDirection.East] = [deepCopy(tileRule.connectors[WorldDirection.East])];
        }

        // ripples
        const updateTilesQueue: IQueue<GridPosition> = new Queue<GridPosition>();
        const exploreConnectorsQueue: IQueue<GridPosition> = new Queue<GridPosition>();
        const toFindNextQueue: IQueue<GridPosition> = new Queue<GridPosition>();

        // initialize updateTilesQueue
        for (const settledTile of settledTiles) {
            const positionsToExplore: GridPosition[] = this.getNeighbourPositions(settledTile.position);

            positionsToExplore.forEach(pos => {
                if (connectorEntropyDiagram[pos.row][pos.col].tileType === ConnectorEntropyTileType.Unset) {
                    updateTilesQueue.enqueue(pos);
                }
            });
        }

        // start
        while (not all tiles are settled) {

        // update tiles
        while (updateTilesQueue.size() > 0) {
            const tilePosToUpdate = updateTilesQueue.dequeue();
            if (tilePosToUpdate === undefined) {
                throw new Error("tilePosToUpdate is undefined");
            }
            const tileToUpdate = connectorEntropyDiagram[tilePosToUpdate.row][tilePosToUpdate.col];

            // compute constraints connectors from neighbours
            const constrainConnectors: {[key in WorldDirection]: IConnector[] | SetOpConstants} = {
                [WorldDirection.North]: SetOpConstants.AnySet,
                [WorldDirection.South]: SetOpConstants.AnySet,
                [WorldDirection.East]: SetOpConstants.AnySet,
                [WorldDirection.West]: SetOpConstants.AnySet
            };
            const neighbourPositions = this.getNeighbourPositions(tileToUpdate.pos);

            for (const neighbourPos of neighbourPositions) {
                const neighbour = connectorEntropyDiagram[neighbourPos.row][neighbourPos.col];
                if (neighbour.tileType === ConnectorEntropyTileType.Settled || neighbour.tileType === ConnectorEntropyTileType.GoballySettled) {
                    for (const dir of [WorldDirection.North, WorldDirection.South, WorldDirection.East, WorldDirection.West]) {
                        if (constrainConnectors[dir] === SetOpConstants.AnySet) {
                            constrainConnectors[dir] = deepCopy(neighbour[dir]);
                        } else {
                            constrainConnectors[dir] = intersectArrays(constrainConnectors[dir] as IConnector[], neighbour[dir]);
                        }
                    }
                }
            }
            // cast constrainConnectors to IConnector[]
            for (const dir of [WorldDirection.North, WorldDirection.South, WorldDirection.East, WorldDirection.West]) {
                if (constrainConnectors[dir] === SetOpConstants.AnySet) {
                    constrainConnectors[dir] = deepCopy(this.tileInterpretor.getAllConnectors());
                }
            }
            const pureConstrainConnectors = constrainConnectors as {[key in WorldDirection]: IConnector[]};

            // compute tiles
            tileToUpdate.tiles = this.tileInterpretor.queryPossibleTiles(pureConstrainConnectors).map(tile => {
                return {
                    ...tile,
                    position: tileToUpdate.pos
                };
            });

            // update exploreConnectorsQueue
            exploreConnectorsQueue.enqueue(tileToUpdate.pos);
        }

        while (exploreConnectorsQueue.size() > 0) {
            const tilePosToExplore = exploreConnectorsQueue.dequeue();
            if (tilePosToExplore === undefined) {
                throw new Error("tilePosToExplore is undefined");
            }
            const tileToExplore = connectorEntropyDiagram[tilePosToExplore.row][tilePosToExplore.col];

            // compute self connectors
            const connectorsMap = this.tileInterpretor.queryPossibleConnectorsFromTiles(tileToExplore.tiles);
            const neighbourPositions = this.getNeighbourPositions(tileToExplore.pos);

            for (const neighbourPos of neighbourPositions) {
                const neighbour = connectorEntropyDiagram[neighbourPos.row][neighbourPos.col];
                if (neighbour.tileType == ConnectorEntropyTileType.GoballySettled || neighbour.tileType == ConnectorEntropyTileType.Settled) {
                    // check if connectorsMap[neighbourPos.dir] is same as neighbour[oppositedir]
                } else if (neighbour.tileType == ConnectorEntropyTileType.Unset) {
                    const connectorsInCommon = intersectArrays(connectorsMap[neighbourPos.dir], neighbour[oppositeGlobalDirOf(neighbourPos.dir)]);
                    tileToExplore[neighbourPos.dir] = deepCopy(connectorsInCommon);
                    // update neighbour's as well
                    neighbour[oppositeGlobalDirOf(neighbourPos.dir)] = deepCopy(connectorsInCommon);
                }
            }

            tileToExplore.tileType = ConnectorEntropyTileType.Settled;
            toFindNextQueue.enqueue(tileToExplore.pos);
        }

        while (toFindNextQueue.size() > 0) {
            const tilePosToFindNext = toFindNextQueue.dequeue();
            if (tilePosToFindNext === undefined) {
                throw new Error("tilePosToFindNext is undefined");
            }

            const neighbourPositions = this.getNeighbourPositions(tilePosToFindNext);

            for (const neighbourPos of neighbourPositions) {
                const neighbour = connectorEntropyDiagram[neighbourPos.row][neighbourPos.col];
                if (neighbour.tileType === ConnectorEntropyTileType.Unset) {
                    updateTilesQueue.enqueue(neighbourPos);
                }
            }
        }

    } // end while

    return connectorEntropyDiagram;
    }

    setTile(tile: TileInWFCInfo): void {
        this.tileGrid[tile.position.row][tile.position.col] = {...tile, tileType: TileType.NonEmpty};
    }

    build(): void {
        throw new Error("Method not implemented.");
    }

    getTileGrid(): TileInWFCInfo[][] {
        return this.tileGrid;
    }

    reset(nRows?: number, nCols?: number): void {
        const prevShape = this.gridShape;
        const nRow = nRows ?? prevShape.nRow;
        const nCol = nCols ?? prevShape.nCol;
        this.tileGrid = WFCBuilderByConnector.initTileGrid(nCol, nRow);
    }

    loadTileInterpretor(tileInterpretor: ITileConnectorInterpretor): void {
        this.tileInterpretor = tileInterpretor;
    }

    getDisplayTileGrid(): TileGridStructure {
        throw new Error("Method not implemented.");
    }

    private getGloballySettledTiles(): TileGridTile[] {
        const settledTiles: TileGridTile[] = [];
        for (let row = 0; row < this.gridShape.nRow; row++) {
            for (let col = 0; col < this.gridShape.nCol; col++) {
                if (this.tileGrid[row][col].tileType === TileType.NonEmpty) {
                    settledTiles.push(deepCopy(this.tileGrid[row][col]));
                }
            }
        }
        return settledTiles;
    }

    private getNeighbourPositions(position: GridPosition): (GridPosition & {dir: WorldDirection})[] {
        const neighbourPositions: (GridPosition & {dir: WorldDirection})[] = [];
        const { row, col } = position;
        if (row - 1 >= 0) {
            neighbourPositions.push({ row: row - 1, col: col, dir: WorldDirection.North });
        }
        if (row + 1 < this.gridShape.nRow) {
            neighbourPositions.push({ row: row + 1, col: col, dir: WorldDirection.South });
        }
        if (col - 1 >= 0) {
            neighbourPositions.push({ row: row, col: col - 1, dir: WorldDirection.West });
        }
        if (col + 1 < this.gridShape.nCol) {
            neighbourPositions.push({ row: row, col: col + 1, dir: WorldDirection.East });
        }
        return neighbourPositions;
    }
}
