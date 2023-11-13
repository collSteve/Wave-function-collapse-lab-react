import { useState } from "react";
import { Rotation } from "../shared/tile-relations";
import { DisplayTileType } from "./tile-grid";

export interface ImageTileObj {
    tileType: DisplayTileType.Image;
    id: number;
    imageSrc: string;
    flipHorizontal?: boolean;
    rotation: Rotation;
    description: string;
}

export interface ImageTileProps  {
    displayTile: ImageTileObj;
    imageSize: number;
}

export default function ImageTile({displayTile, imageSize}: ImageTileProps) {
    const [hover, setHover] = useState(false);

    let xScale = displayTile.flipHorizontal ? -1 : 1;
    let yScale = 1;

    if (hover) {
        xScale = 1.1 * xScale;
        yScale = 1.1 * yScale;
    }

    const imgStyle = {
        transform: `rotate(${displayTile.rotation}deg) scale(${xScale}, ${yScale})`,
        width: `${imageSize}px`,
        height: `${imageSize}px`,
        cursor: `${hover ? "pointer" : "default"}`
    }
    return (
        <div style={{lineHeight: 0}}>
            <img className="imgTile" 
                style={imgStyle} 
                src={displayTile.imageSrc} 
                alt={displayTile.description}
                onMouseEnter={()=>{setHover(true)}}
                onMouseLeave={()=>{setHover(false)}} />
        </div>
    )
}