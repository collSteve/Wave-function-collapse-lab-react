import { Rotation, WorldDirection } from "../shared/tile-relations";
import { IConnector } from "./connector";

export interface RuledTile {
    id: string;
    connectors: {[key in WorldDirection]: IConnector}
    flipHorizontal?: boolean;
    uniqueOrientation?: Rotation[];
}