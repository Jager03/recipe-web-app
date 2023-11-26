import { Router } from "express";
import { DI } from "../";
import { wrap } from "@mikro-orm/core";

import { RecipeDTO, createRecipeSchema, Recipe } from "../entities";
import { populate } from "dotenv";

export type recipeQuery = {
  categories?: string;
  recipeName?: string;
};

const router = Router({ mergeParams: true });

router.get("/id/:id", async (req, res) => {
  const id = req.params.id;
  const recipeEntries = await DI.recipeEntryRepo.find(
    {
      id: id,
    },
    { populate: ["ingredients", "categories"] }
  );
  if (!recipeEntries) {
    return res.status(404).send({ message: "Recipe not found" });
  }
  res.status(200).send(recipeEntries);
});

router.get("/", async (req, res) => {
  try {
    let recipeEntries;
    const { categories, recipeName }: recipeQuery = req.query;

    //Logic to handle params in the request
    //Handle if both categories and name are in the request
    if (categories && recipeName) {
      const categoriesName = categories.split(",");

      recipeEntries = await DI.recipeEntryRepo.find(
        {
          categories: { name: categoriesName },
          name: recipeName,
        },
        { populate: ["ingredients", "categories"] }
      );
    } else if (categories && !recipeName) {
      //Handeling if only categories in request
      const categoriesName = categories.split(",");

      recipeEntries = await DI.recipeEntryRepo.find(
        {
          categories: { name: categoriesName },
        },
        { populate: ["ingredients", "categories"] }
      );
    } else if (!categories && recipeName) {
      //Handeling if only name in request
      recipeEntries = await DI.recipeEntryRepo.find(
        {
          name: recipeName,
        },
        { populate: ["ingredients", "categories"] }
      );
    } else {
      //Handeling if neither name or categories in request
      recipeEntries = await DI.recipeEntryRepo.findAll({
        populate: ["ingredients", "categories"],
      });
    }

    //Logic for sending the response
    if (recipeEntries.length == 0) {
      res.status(404).send({ error: "No recipe found" });
      return;
    }
    res.status(200).send(recipeEntries);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

router.get("/ingredient/:ingredientName", async (req, res) => {
  const ingredientName = req.params.ingredientName;
  const recipeEntries = await DI.recipeEntryRepo.find(
    {
      ingredients: { name: ingredientName },
    },
    { populate: ["ingredients", "categories"] }
  );
  if (!recipeEntries) {
    return res.status(404).send({ message: "Recipe not found" });
  }
  res.status(200).send(recipeEntries);
});

router.post("/", async (req, res) => {
  try {
    //Validating the data and sending code 400: client didnt send correct data
    const validatedData = await createRecipeSchema
      .validate(req.body)
      .catch((e) => {
        res.status(400).json({ erros: e.errors });
      });
    if (!validatedData) {
      return;
    }

    const recipeDTO: RecipeDTO = validatedData; //creating the Data Transfer Object for entity creation
    console.log(recipeDTO);
    const recipeEntry = new Recipe(recipeDTO);
    console.log(recipeEntry);

    //Logic to ensure, that if from front end, a category without id comes, then it is created
    //and recipe updated
    const categoryIds = [];
    const categoriesWithName = [];
    if (recipeDTO.categories) {
      for (const curCategroy of recipeDTO.categories) {
        if (curCategroy.id) {
          //save the ids of every existing category
          categoryIds.push(curCategroy.id);
        } else if (curCategroy.name) {
          //save the category (this case only the name) of non existing category
          categoriesWithName.push(curCategroy);
        }
      }
    }

    //Loading the existing categories and merging both existing and non existing
    const loadedCategories = await DI.categoryEntryRepo.find({
      id: { $in: categoryIds },
    });
    const mergedCategories = [...loadedCategories, ...categoriesWithName];

    //Logic for adding already existing ingredient to the recipe entity
    const ingredientsIds = [];
    if (recipeDTO.ingredients) {
      for (const ingredient of recipeDTO.ingredients) {
        ingredientsIds.push(ingredient.id); //saving the ingredients id
      }
    }
    const loadedIngredients = await DI.ingredientEntryRepo.find(
      //loading the ingredients
      { id: { $in: ingredientsIds } }
    );

    //wraping the new Recipie with the categories and the em in order for creating those categories that dont exist yet
    wrap(recipeEntry).assign(
      { categories: mergedCategories, ingredients: loadedIngredients },
      { em: DI.em }
    );

    await DI.em.persistAndFlush(recipeEntry);
    res.status(201).send(recipeEntry);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

router.put("/id/:id", async (req, res) => {
  try {
    console.log("put recipe");
    const recipeEntry = await DI.recipeEntryRepo.findOne(req.params.id); //getting the entity
    if (!recipeEntry) {
      return res.status(404).send({ message: "Recipe not found" });
    }

    //const recipeDTO: RecipeDTO = validatedData; //creating the Data Transfer Object for entity creation
    const { ingredients, categories, ...rest } = req.body; //getting the ingredients out of the body

    //Logic to ensure, that if from front end, a category without id comes, then it is created
    //and recipe updated
    const categoryIds = [];
    const categoriesWithName = [];
    if (categories) {
      for (const curCategroy of categories) {
        if (curCategroy.id) {
          //save the ids of every existing category
          categoryIds.push(curCategroy.id);
          //Because frontend sends category both with name and id, continue when seeing the id
          continue;
        } else if (curCategroy.name) {
          //save the category (this case only the name) of non existing category
          categoriesWithName.push(curCategroy);
        }
      }
    }

    //Loading the existing categories and merging both existing and non existing
    const loadedCategories = await DI.categoryEntryRepo.find({
      id: { $in: categoryIds },
    });
    const mergedCategories = [...loadedCategories, ...categoriesWithName];

    //Logic for adding already existing ingredient to the recipe entity
    const ingredientsIds = [];
    if (ingredients) {
      for (const ingredient of ingredients) {
        ingredientsIds.push(ingredient.id); //saving the ingredients id
        console.log(ingredient.id);
      }
    }
    const loadedIngredients = await DI.ingredientEntryRepo.find(
      //loading the ingredients
      { id: { $in: ingredientsIds } }
    );

    //wraping the new Recipie with the categories and the em in order for creating those categories that dont exist yet
    wrap(recipeEntry).assign(
      { ingredients: loadedIngredients, categories: mergedCategories },
      { em: DI.em }
    );

    wrap(recipeEntry).assign(rest); //updating entity
    await DI.em.flush();

    res.status(200).json(recipeEntry);
  } catch (e: any) {
    return res.status(400).send({ errors: [e.message] });
  }
});

router.delete("/id/:id", async (req, res) => {
  try {
    const existingEntry = await DI.recipeEntryRepo.find({
      //loading the entity
      id: req.params.id,
    });
    if (!existingEntry) {
      //handleing not found
      return res.status(404).json({ errors: [`ID not found`] });
    }
    await DI.em.remove(existingEntry).flush();
    return res.status(204).send({});
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

export const RecipeController = router;
