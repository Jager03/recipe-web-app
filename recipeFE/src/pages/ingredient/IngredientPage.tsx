import { useEffect, useState } from "react";
import { useApiClient } from "../../api/useApiClient";
import { BaseLayout } from "../../layout/BaseLayout";
import { Ingredient, PostIngredientRequest } from "../../api";
import { IngredientTable } from "./IngredientTable";

import { Button, useDisclosure } from "@chakra-ui/react";
import { ModalIngredientUpdate } from "./components/ModalIngredientUpdate";

export const IngredientPage = () => {
  const client = useApiClient();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const onLoadData = async () => {
    const res = await client.getIngredient();

    setIngredients(res.data);
  };

  useEffect(() => {
    onLoadData();
  }, []);

  const onCreateIngredient = async (data: PostIngredientRequest) => {
    await client.postIngredient(data);
    onClose();
    await onLoadData();
  };

  const onDeleteIngredient = async (recipe: Ingredient) => {
    if (recipe.id) {
      await client.deleteIngredient(recipe.id);
      await onLoadData();
    }
  };

  const [ingredientToBeUpdated, setIngredientToBeUpdated] =
    useState<Ingredient | null>(null);

  const onClickUpdateIngredient = async (recipe: Ingredient) => {
    setIngredientToBeUpdated(recipe);
    onOpen();
  };
  const onUpdateIngredient = async (recipe: PostIngredientRequest) => {
    if (ingredientToBeUpdated?.id) {
      await client.putIngredient(ingredientToBeUpdated?.id, recipe);
    }
    onClose();
    await onLoadData();
    setIngredientToBeUpdated(null);
  };

  const data = ingredients;
  return (
    <BaseLayout>
      <Button
        onClick={() => {
          onOpen();
        }}
      >
        Create new ingredient
      </Button>
      <ModalIngredientUpdate
        initialValues={ingredientToBeUpdated}
        isOpen={isOpen}
        onClose={() => {
          setIngredientToBeUpdated(null);
          onClose();
        }}
        onSubmit={(updatedIngredient) => {
          if (ingredientToBeUpdated) {
            onUpdateIngredient({ ...updatedIngredient });
          } else {
            onCreateIngredient({ ...updatedIngredient });
          }
        }}
      />
      <IngredientTable
        data={data}
        onClickDeleteIngredient={onDeleteIngredient}
        onClickUpdateIngredient={onClickUpdateIngredient}
      />
    </BaseLayout>
  );
};
