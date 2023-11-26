import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./AppRoutes";

export const App = () => {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ChakraProvider>
  );
};
