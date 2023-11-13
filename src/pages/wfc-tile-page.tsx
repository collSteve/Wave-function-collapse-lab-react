import { HStack } from "@chakra-ui/react";
import TileGrid, { DisplayTileType, TileGridStructure } from "../components/tile-grid";
import { Rotation } from "../shared/tile-relations";
import ControlPanel from "./wfc-tile-page/control-panel";
import { NumberTileObj } from "../components/number-tile";

function initTileGridStructure(numW:number, numH: number): TileGridStructure {
    const tiles: NumberTileObj[][] = [];
    for (let i = 0; i < numH; i++) {
        tiles.push([]);
        for (let j = 0; j < numW; j++) {
            tiles[i].push({
                tileType: DisplayTileType.Number,
                number: Infinity
            });
        }
    }
    return {
        tiles: tiles
    }
}

export default function WfcTilePage() {
    const imgUrl = "https://cdn.pixabay.com/photo/2015/04/19/08/32/marguerite-729510_1280.jpg";
    let tileGridStructure: TileGridStructure = {
        tiles: [
            [
                {
                    id: 1,
                    imageSrc: imgUrl,
                    rotation: Rotation.Deg90,
                    description: "1",
                    tileType: DisplayTileType.Image
                },
                {
                    id: 2,
                    imageSrc: imgUrl,
                    rotation: 0,
                    flipHorizontal: true,
                    description: "2",
                    tileType: DisplayTileType.Image

                },
                {
                    id: 3,
                    imageSrc: imgUrl,
                    rotation: Rotation.Deg90,
                    flipHorizontal: true,
                    description: "3",
                    tileType: DisplayTileType.Image

                }
            ],
            [
                {
                    id: 4,
                    imageSrc: imgUrl,
                    rotation: 0,
                    description: "4",
                    tileType: DisplayTileType.Image

                },
                {
                    id: 5,
                    imageSrc: imgUrl,
                    rotation: 0,
                    description: "5",
                    tileType: DisplayTileType.Image

                },
                {
                    id: 6,
                    imageSrc: imgUrl,
                    rotation: 0,
                    description: "6",
                    tileType: DisplayTileType.Image

                }
            ],
            [
                {
                    id: 7,
                    imageSrc: imgUrl,
                    rotation: 0,
                    description: "7",
                    tileType: DisplayTileType.Image

                },
                {
                    id: 8,
                    imageSrc: imgUrl,
                    rotation: 0,
                    description: "8",
                    tileType: DisplayTileType.Image

                },
                {
                    number: 9,
                    tileType: DisplayTileType.Number
                }
            ]
        ]
    };

    tileGridStructure = initTileGridStructure(10, 10);
    return (
        <HStack height="100%">  
            <ControlPanel isOpen={true} onClose={()=>{}} width="25vw"/>
            <div style={{justifyContent: "center", alignItems: "center", width:"75vw", 
            overflow:"scroll", height:"100%"}}>
                <TileGrid imageSize={50} tileGridStructure={tileGridStructure}/>
            </div>
        </HStack>
    )
}