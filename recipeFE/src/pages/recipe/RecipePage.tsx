import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BaseLayout } from "../../layout/BaseLayout";
import { Box, HStack, Heading, VStack, Text } from "@chakra-ui/react";
import { useApiClient } from "../../api/useApiClient";
import { Recipe } from "../../api";

export const RecipePage = () => {
  const { id } = useParams();
  const client = useApiClient();

  const [recipe, setRecipe] = useState<Recipe>();

  const onLoadData = async () => {
    if (id) {
      const res = await client.getRecipeId(id);
      console.log("response", res);
      setRecipe(res.data[0]);
    }
  };

  useEffect(() => {
    onLoadData();
  }, []);

  console.log(recipe);

  return (
    <BaseLayout>
      <Box overflowY={"scroll"}>
        <Box p={10}>
          <Heading>{`Recipe: ${recipe?.name}`}</Heading>
          <Text
            paddingBlockStart={5}
          >{`Recipe Description: ${recipe?.description}`}</Text>
        </Box>

        <Box p={10}>
          <Heading>Ingredients</Heading>
          {recipe?.ingredients?.map((ingredient) => {
            if (ingredient) {
              return (
                <Box paddingTop={5}>
                  <Heading
                    as={"h5"}
                    size={"xs"}
                  >{`Ingredient: ${ingredient?.name}`}</Heading>
                  <Text>{`Amount: ${ingredient?.amount}`}</Text>
                  <Text>{`Unit: ${ingredient?.unit}`}</Text>
                  <Text>{`Description: ${ingredient?.description}`}</Text>
                </Box>
              );
            } else {
              return <Text>No Ingredients for this recipe</Text>;
            }
          })}
        </Box>

        <Box p={10}>
          <HStack>
            <Heading as={"h5"} size={"s"}>
              Categories:
            </Heading>

            {recipe?.categories?.map((category) => {
              return <Text>{category.name}</Text>;
            })}
          </HStack>
        </Box>
      </Box>
    </BaseLayout>
  );
};
