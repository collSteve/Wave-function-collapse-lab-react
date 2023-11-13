import { Outlet, Link as ReactRouterLink } from "react-router-dom";
import { Box, Stack, Flex } from "@chakra-ui/react";

const NavItems = [
    { name: "Home", href: "/" },
    { name: "WFC Grid", href: "wfc-grid" },
];

export default function Root() {
    return (
        <Stack width="100%" height="100%" gap={0} overflow="hidden">
            <Flex as="nav"
      align="center"
      justify="flex-start"
      wrap="wrap"
      w="100%" 
      height="10vh"
      gap="2">
                {
                    NavItems.map(({ name, href }) => {
                        return (<Box key={name} as={ReactRouterLink} to={href}>
                            {name}
                        </Box>);
                    })
                }
            </Flex>
            <div style={{height: "90vh"}}>
                <Outlet />
            </div>
        </Stack>
    );
}