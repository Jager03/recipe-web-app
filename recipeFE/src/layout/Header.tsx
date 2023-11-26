import { HStack, Image, Box, Text } from "@chakra-ui/react";
import { NavBarItem } from "./components/navBarItem";
import img1 from "../img/logo.png";

export const Header = () => {
  return (
    <HStack
      bg={"blue.300"}
      p={6}
      w={"100%"}
      //alignItems={"flex-end"}
      justify="space-between"
      align="self"
      //justifyContent={"center"}
    >
      <Box w={"33.3%"} textAlign={"center"}>
        <HStack>
          <Image src={img1} alt="Logo" boxSize="40px"></Image>
          <NavBarItem text="Home" route="/" size={26} />
          <NavBarItem text="Ingredient" route="/ingredient" size={20} />
          <NavBarItem text="Category" route="/category" size={20} />
        </HStack>
      </Box>

      <Box w={"33.3%"} textAlign={"center"}>
        <Text fontSize={30}>Joha's Recipes</Text>
      </Box>

      <Box w={"33.3%"} textAlign={"right"}>
        <NavBarItem text="search" route="/search" size={26} />
      </Box>
    </HStack>
  );
};
