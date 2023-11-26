import { chakra, HTMLChakraProps } from "@chakra-ui/react";

export interface PageProps extends HTMLChakraProps<"main"> {}

export const Page = ({ children, ...boxProps }: PageProps) => (
  <chakra.main
    flex={1}
    px={30}
    py={8}
    overflowX="hidden"
    display="flex"
    flexDirection="column"
    ml="auto"
    bg={"#CEF2EF"}
    mr="auto"
    maxWidth="90rem"
    width="100%"
    {...boxProps}
  >
    {children}
  </chakra.main>
);
