import { BaseLayout } from "../../layout/BaseLayout";
import { useEffect, useState } from "react";
import { Ingredient, Recipe } from "../../api";
import { useApiClient } from "../../api/useApiClient";
import { PutRecipeRequest, PostRecipeRequest } from "../../api";
import { RecipeTable } from "./RecipeTable";
import { Button, useDisclosure } from "@chakra-ui/react";
import { ModalCreateRecipe } from "../components/ModalCreateRecipe";

export const Home = () => {
  const client = useApiClient();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const onLoadData = async () => {
    const resRecipe = await client.getRecipe();
    console.log("recipes homePage", resRecipe.data);
    setRecipes(resRecipe.data);
  };

  useEffect(() => {
    onLoadData();
  }, []);

  const onCreateRecipe = async (data: PostRecipeRequest) => {
    await client.postRecipe(data);
    onClose();
    await onLoadData();
  };

  const onDeleteRecipe = async (recipe: Recipe) => {
    if (recipe.id) {
      await client.deleteRecipe(recipe.id);
      await onLoadData();
    }
  };

  const [recipeToBeUpdated, setRecipeToBeUpdated] = useState<Recipe | null>(
    null
  );

  const onClickUpdateRecipe = async (recipe: Recipe) => {
    setRecipeToBeUpdated(recipe);
    onOpen();
  };
  const onUpdateRecipe = async (recipe: PutRecipeRequest) => {
    if (recipeToBeUpdated?.id) {
      console.log("debug");
      const res = await client.putRecipe(recipeToBeUpdated.id, recipe);
      console.log(res);
    }
    onClose();
    await onLoadData();
    setRecipeToBeUpdated(null);
    client;
  };

  return (
    <BaseLayout>
      <Button
        onClick={() => {
          onOpen();
        }}
      >
        Create new recipe
      </Button>
      <ModalCreateRecipe
        initialValues={recipeToBeUpdated}
        isOpen={isOpen}
        onClose={() => {
          setRecipeToBeUpdated(null);
          onClose();
        }}
        onSubmit={() => {
          console.log("onSubmit homepage");
          onLoadData();
        }}
      />
      <RecipeTable
        data={recipes}
        onClickDeleteRecipe={onDeleteRecipe}
        onClickUpdateRecipe={onClickUpdateRecipe}
      />
    </BaseLayout>
  );
};
