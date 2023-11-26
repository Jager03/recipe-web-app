import { Box, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useState } from "react";

type navProps = {
  route: string;
  text: string;
  size: number;
};

export const NavBarItem = ({ route, text, size }: navProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  return (
    <Box
      margin={1.5}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <RouterLink to={route}>
        <Text fontSize={{ size }} color={isHovered ? "orange.400" : "gray:900"}>
          {text}
        </Text>
      </RouterLink>
    </Box>
  );
};
