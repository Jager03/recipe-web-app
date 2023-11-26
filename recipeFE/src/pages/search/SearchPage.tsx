import { Button, Heading, Select, Text } from "@chakra-ui/react";
import { BaseLayout } from "../../layout/BaseLayout";
import { useEffect, useState } from "react";
import { useApiClient } from "../../api/useApiClient";
import { Category, Ingredient, Recipe } from "../../api";

import { Input, VStack } from "@chakra-ui/react";
import { ModalCreateRecipe } from "../components/ModalCreateRecipe";
import { RecipeTable } from "../home/RecipeTable";

export const SearchPage = () => {
  const client = useApiClient();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [data, setData] = useState<Recipe[]>([]);
  //const [displayTable, setDisplayTable] = useEffect<boolean>

  const onLoadData = async () => {
    const resIngredients = await client.getIngredient();
    const resCategories = await client.getCategory();

    setIngredients(resIngredients.data);
    setCategories(resCategories.data);
  };

  useEffect(() => {
    onLoadData();
  }, []);

  const [recipeName, setRecipeName] = useState<string>("");
  const [categoriesSelected, setCategoriesSelected] = useState<Category[]>([]);
  const [ingredientSelected, setIngredientSelected] = useState<Ingredient>();

  const handleRecipeNameChange = (e: React.FormEvent<HTMLInputElement>) => {
    console.log(e);
    setRecipeName(e.currentTarget.value);
  };

  const handleCategoriesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategoryName = e.currentTarget.value;

    const selectedCategory = categories.find(
      (category) => category.name === selectedCategoryName
    );
    if (selectedCategory) {
      setCategoriesSelected((prevCategory) => [
        ...prevCategory,
        selectedCategory,
      ]);
    }
    console.log(categoriesSelected);
  };

  const handleIngredientsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIngredientId = e.currentTarget.value;

    const selectedIngredient = ingredients.find(
      (ingredient) => ingredient.id === selectedIngredientId
    );
    if (selectedIngredient) {
      setIngredientSelected(selectedIngredient);
    }
    console.log(selectedIngredient);
  };

  const handleButtonClick = async () => {
    const categoriesString: string = categoriesSelected
      .map((category) => category.name)
      .join(",");

    if (ingredientSelected) {
      if (ingredientSelected.name) {
        const res = await client.getRecipeIngredient(ingredientSelected.name);
        setData(res.data);
      }
      return;
    }

    if (recipeName) {
      const res = await client.getRecipe(recipeName);
      setData(res.data);
    } else if (categoriesSelected) {
      const res = await client.getRecipe("", categoriesString);
      setData(res.data);
    } else if (categoriesSelected && recipeName) {
      const res = await client.getRecipe(recipeName, categoriesString);
      setData(res.data);
    }
  };

  return (
    <BaseLayout>
      <Heading>Search Page</Heading>
      <Heading as={"h5"} size={"xs"}>
        It is possible to search for only a recipe name, only for a set of
        categories, both, or neither. If you select an ingredient to search for,
        then the search will only be focused on that ingredient{" "}
      </Heading>
      <VStack>
        <Input
          backgroundColor={"teal.200"}
          placeholder="enter recipe name to search for"
          onChange={handleRecipeNameChange}
          id="recipeName"
          type="string"
        />
        <Select
          backgroundColor={"teal.200"}
          placeholder="enter categorys to search for"
          onChange={handleCategoriesChange}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </Select>
        <Text>
          {categoriesSelected.map((category) => {
            return `${category.name}, `;
          })}
        </Text>
        <Select
          backgroundColor={"teal.200"}
          placeholder="enter ingredient"
          onChange={handleIngredientsChange}
        >
          {ingredients.map((ingredient) => (
            <option key={ingredient.id} value={ingredient.id}>
              {ingredient.name}
            </option>
          ))}
        </Select>
        <Button onClick={handleButtonClick}>Submit</Button>
        {/* <RecipeTable data={data} /> */}
        {data.length == 0 ? <Text></Text> : <RecipeTable data={data} />}
      </VStack>
    </BaseLayout>
  );
};
