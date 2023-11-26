import { ReactNode } from "react";
import { VStack } from "@chakra-ui/react";
import { Header } from "./Header.tsx";
import { Page } from "./Page.tsx";

export const BaseLayout = ({ children }: { children: ReactNode }) => {
  return (
    <VStack bg={"blue.50"} h={"100vh"} w={"100%"}>
      <Header />
      <Page>{children}</Page>
    </VStack>
  );
};
