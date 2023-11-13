import ImageTile, { ImageTileObj } from "./image-tile";
import NumberTile, { NumberTileObj } from "./number-tile";

export enum DisplayTileType {
    Image,
    Number
}

export interface TileGridStructure {
    tiles: (ImageTileObj|NumberTileObj)[][];
}

export interface TileGridProps {
    tileGridStructure: TileGridStructure;
    imageSize: number;
}

export default function TileGrid(props: TileGridProps) {
    const gridStyle: React.CSSProperties = {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    };
    const rowStyle: React.CSSProperties = {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    }
    return (
        <div style={gridStyle}>
            {
                props.tileGridStructure.tiles.map((row, rowIndex) => {
                    return (
                        <div key={rowIndex} style={rowStyle}>
                            {
                                row.map((tile, colIndex) => {
                                    if (tile.tileType === DisplayTileType.Number) {
                                        return (
                                            <NumberTile key={`${rowIndex}-${colIndex}`} tile={tile} size={props.imageSize}/>
                                        )
        
                                    } else if (tile.tileType === DisplayTileType.Image) {
                                        return (
                                            <ImageTile imageSize={props.imageSize} key={`${rowIndex}-${colIndex}`} displayTile={tile}/>
                                        )
                                    }
                                })
                            }
                        </div>
                    )
                })
            }
        </div>
    )
}