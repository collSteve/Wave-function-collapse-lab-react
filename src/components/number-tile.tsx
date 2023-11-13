import { useState } from "react";
import { DisplayTileType } from "./tile-grid";

export interface NumberTileObj {
    number: number;
    tileType: DisplayTileType.Number;
}

export interface NumberTileProps {
    tile: NumberTileObj;
    size: number;
}

export default function NumberTile({ tile, size }: NumberTileProps) {

    const [hover, setHover] = useState(false);
    let xScale = 1;
    let yScale = 1;
    let zIndex = 0;
    if (hover) {
        xScale = 1.1 * xScale;
        yScale = 1.1 * yScale;
        zIndex = 1;
    }

    const style: React.CSSProperties = {
        display: "flex",
        transform: `scale(${xScale}, ${yScale})`,
        width: `${size}px`,
        height: `${size}px`,
        cursor: `${hover ? "pointer" : "default"}`,
        justifyContent: "center",
        alignItems: "center",
        border: "1px solid black",
        backgroundColor: "white",
        zIndex: zIndex
    }
    return (
        <div style={style}
            onMouseEnter={() => { setHover(true) }}
            onMouseLeave={() => { setHover(false) }}>
            {tile.number == Infinity ? "∞" : tile.number}
        </div>
    )
}