import {
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  VStack,
  Text,
  Select,
  Button,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import {
  FormControl,
  InputControl,
  SubmitButton,
  TextareaControl,
} from "formik-chakra-ui";
import {
  Category,
  Ingredient,
  PostRecipeRequest,
  PutRecipeRequest,
  Recipe,
} from "../../api/api.ts";
import ReactSelectControl from "../../components/ReactSelectControl.tsx";
import { GroupBase } from "react-select";
import { useApiClient } from "../../api/useApiClient.ts";
import { OptionBase } from "chakra-react-select";
import { MultiSelect } from "react-multi-select-component";
import { useEffect, useState } from "react";

interface CategoryOption extends OptionBase {
  id?: string;
  label?: string;
  value?: string;
}

interface ingredientOptions extends OptionBase {
  label: string;
  value: string;
}

export const ModalCreateRecipe = ({
  initialValues,
  onSubmit,
  ...restProps
}: Omit<ModalProps, "children"> & {
  initialValues: Recipe | null;
  onSubmit?: () => void;
}) => {
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

  //effect to set the ingredients and categories whenever the initialValue changes
  useEffect(() => {
    if (
      initialValues?.categories &&
      initialValues?.ingredients &&
      initialValues.name &&
      initialValues.description
    ) {
      setCategoriesSelected(initialValues.categories);
      setIngredientsSelected(initialValues.ingredients);
      setRecipeName(initialValues.name);
      setDescription(initialValues.description);
    }
  }, [initialValues]);

  useEffect(() => {
    onLoadData();
  }, []);

  const [recipeName, setRecipeName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [categoriesSelected, setCategoriesSelected] = useState<Category[]>([]);
  const [ingredientsSelected, setIngredientsSelected] = useState<Ingredient[]>(
    []
  );

  const handleRecipeNameChange = (e: React.FormEvent<HTMLInputElement>) => {
    setRecipeName(e.currentTarget.value);
  };
  const handleDescriptionChange = (e: React.FormEvent<HTMLInputElement>) => {
    setDescription(e.currentTarget.value);
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
      setIngredientsSelected((prevIngredients) => [
        ...prevIngredients,
        selectedIngredient,
      ]);
    }
    console.log(selectedIngredient);
  };

  const validateData = () => {
    return true;
  };

  //Modifing the onClose function given by the props to clear the categories and ingredients selected
  //in case next open of the modal is on creation mode
  const { onClose, ...rest } = restProps;
  const handleClose = () => {
    console.log("handleClose");
    setCategoriesSelected([]);
    setIngredientsSelected([]);
    setRecipeName("");
    setDescription("");
    onClose();
  };
  const handleButtonSubmit = async () => {
    if (validateData()) {
      const newRecipe: PostRecipeRequest = {
        name: recipeName,
        description: description,
        ingredients: ingredientsSelected,
        categories: categoriesSelected,
      };
      if (initialValues?.id) {
        await client.putRecipe(initialValues.id, newRecipe);
      } else {
        await client.postRecipe(newRecipe);
      }
      if (onSubmit) {
        onSubmit();
      }

      handleClose();
    }
  };

  const updatedProps = { onClose: handleClose, ...rest };

  return (
    <Modal {...updatedProps}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {initialValues ? "Update Recipe" : "Create Recipe"}
        </ModalHeader>
        <ModalCloseButton />
        <VStack p={5}>
          <FormLabel>Name</FormLabel>
          <Input
            value={recipeName != "" ? recipeName : ""}
            onChange={handleRecipeNameChange}
            id="recipeName"
            type="string"
            backgroundColor={"teal.50"}
          />
          <FormLabel>Description</FormLabel>
          <Input
            value={description != "" ? description : ""}
            onChange={handleDescriptionChange}
            id="description"
            type="string"
            backgroundColor={"teal.50"}
          />
          <FormLabel>Ingredients</FormLabel>
          <Select
            placeholder="select ingredient"
            onChange={handleIngredientsChange}
            backgroundColor={"teal.50"}
          >
            {ingredients.map((ingredient) => (
              <option key={ingredient.id} value={ingredient.id}>
                {ingredient.description}
              </option>
            ))}
          </Select>
          <Text>
            Selected ingredients:
            {ingredientsSelected.map((ingredient) => {
              return ` ${ingredient.description}, `;
            })}
          </Text>
          <FormLabel>Categories</FormLabel>
          <Select
            placeholder="select category"
            onChange={handleCategoriesChange}
            backgroundColor={"teal.50"}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </Select>
          <Text>
            Selected categories:
            {categoriesSelected.map((category) => {
              return ` ${category.name}, `;
            })}
          </Text>
          <Button onClick={handleButtonSubmit}>Submit</Button>
        </VStack>
      </ModalContent>

      {/* <Formik<PutRecipeRequest>
        initialValues={initialValues ?? { name: "", description: "" }} //nullish coalescing to set default values if initial values is null
        //onSubmit function, parameters is the values and a set of helpersw functions from formik
        onSubmit={(e, formikHelpers) => {
          console.log("submit", e);
          onSubmit?.(e);
          formikHelpers.setSubmitting(false);
        }}
      >
        <ModalContent as={Form}>
          <ModalHeader>
            {initialValues ? "Update Recipe" : "Create Recipe"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <InputControl name={"name"} label={"Name"} />
              <TextareaControl name={"description"} label={"Description"} />

              <MultiSelect
                options={options}
                value={selectedIngredient}
                onChange={setSelectedIngredient}
                labelledBy="Ingredients"
              />
              <FormControl
                id="ingredients"
                name="ingredients"
                label="Ingredients"
              >
                <Select isMulti={true} options={options} />
              </FormControl>

              <ReactSelectControl<
                CategoryOption,
                true,
                GroupBase<ingredientOptions>
              >
                name="categories"
                label="Categories"
                selectProps={{
                  isMulti: true,
                  defaultOptions: true,
                  loadOptions: async (inputValue) => {
                    const categories = await client.getCategory();
                    console.log(categories);
                    if (categories.status === 200) {
                      return categories.data
                        .filter(
                          (category) => category?.name?.includes(inputValue)
                        )
                        .map((category) => ({
                          id: category.id,
                          label: category.name,
                          value: category.name,
                        }));
                    }
                    return [];
                  },
                }}
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <SubmitButton>
              {initialValues ? "Update recipe" : "Create recipe"}
            </SubmitButton>
          </ModalFooter>
        </ModalContent>
      </Formik> */}
    </Modal>
  );
};
