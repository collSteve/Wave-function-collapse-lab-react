
import { useState } from "react";
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Select,
    Slider,
    SliderFilledTrack,
    SliderThumb,
    SliderTrack,
    Stack,
    useDisclosure,
} from "@chakra-ui/react";

const ControlPanel = ({...props}) => {
    const { isOpen: isAdvancedOpen, onToggle: onAdvancedToggle } = useDisclosure();
    const [tileSize, setTileSize] = useState(50);
    const [tileType, setTileType] = useState("square");
    const [tileColor, setTileColor] = useState("#000000");

    const handleTileSizeChange = (value: number) => {
        setTileSize(value);
    };

    const handleTileTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setTileType(event.target.value);
    };

    const handleTileColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTileColor(event.target.value);
    };

    return (
        <Box
            height="100%"
            backgroundColor="white"
            boxShadow="0 0 10px rgba(0, 0, 0, 0.2)"
            transition="width 0.3s ease-in-out"
            overflow="scroll"
            {...props}
        >
            <Box padding={4}>
                <Stack spacing={4}>
                    <FormControl>
                        <FormLabel>Tile Size</FormLabel>
                        <Slider
                            value={tileSize}
                            min={10}
                            max={100}
                            step={10}
                            onChange={handleTileSizeChange}
                        >
                            <SliderTrack>
                                <SliderFilledTrack />
                            </SliderTrack>
                            <SliderThumb />
                        </Slider>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Tile Type</FormLabel>
                        <Select value={tileType} onChange={handleTileTypeChange}>
                            <option value="square">Square</option>
                            <option value="circle">Circle</option>
                            <option value="triangle">Triangle</option>
                        </Select>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Tile Color</FormLabel>
                        <Input type="color" value={tileColor} onChange={handleTileColorChange} />
                    </FormControl>
                    <Button onClick={onAdvancedToggle}>Advanced Options</Button>
                    {isAdvancedOpen && (
                        <Box>
                            <FormControl>
                                <FormLabel>Advanced Option 1</FormLabel>
                                <Input />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Advanced Option 2</FormLabel>
                                <Input />
                            </FormControl>
                        </Box>
                    )}
                </Stack>
            </Box>
        </Box>
    );
};

export default ControlPanel;
