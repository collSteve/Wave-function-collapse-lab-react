import { TileInWFCInfo } from "./wfc-builder";

export interface IWFCHistory {
    getExploreHistory(): TileInWFCInfo[][];
    getSuccessHistory(): TileInWFCInfo[][];
}