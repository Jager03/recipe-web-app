"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipeController = void 0;
const express_1 = require("express");
const __1 = require("../");
const core_1 = require("@mikro-orm/core");
const entities_1 = require("../entities");
const router = (0, express_1.Router)({ mergeParams: true });
router.get("/id/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const recipeEntries = yield __1.DI.recipeEntryRepo.find({
        id: id,
    }, { populate: ["ingredients", "categories"] });
    if (!recipeEntries) {
        return res.status(404).send({ message: "Recipe not found" });
    }
    res.status(200).send(recipeEntries);
}));
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let recipeEntries;
        const { categories, recipeName } = req.query;
        //Logic to handle params in the request
        //Handle if both categories and name are in the request
        if (categories && recipeName) {
            const categoriesName = categories.split(",");
            recipeEntries = yield __1.DI.recipeEntryRepo.find({
                categories: { name: categoriesName },
                name: recipeName,
            }, { populate: ["ingredients", "categories"] });
        }
        else if (categories && !recipeName) {
            //Handeling if only categories in request
            const categoriesName = categories.split(",");
            recipeEntries = yield __1.DI.recipeEntryRepo.find({
                categories: { name: categoriesName },
            }, { populate: ["ingredients", "categories"] });
        }
        else if (!categories && recipeName) {
            //Handeling if only name in request
            recipeEntries = yield __1.DI.recipeEntryRepo.find({
                name: recipeName,
            }, { populate: ["ingredients", "categories"] });
        }
        else {
            //Handeling if neither name or categories in request
            recipeEntries = yield __1.DI.recipeEntryRepo.findAll({
                populate: ["ingredients", "categories"],
            });
        }
        //Logic for sending the response
        if (recipeEntries.length == 0) {
            res.status(404).send({ error: "No recipe found" });
            return;
        }
        res.status(200).send(recipeEntries);
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ error: "Internal Server Error" });
    }
}));
router.get("/ingredient/:ingredientName", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ingredientName = req.params.ingredientName;
    const recipeEntries = yield __1.DI.recipeEntryRepo.find({
        ingredients: { name: ingredientName },
    }, { populate: ["ingredients", "categories"] });
    if (!recipeEntries) {
        return res.status(404).send({ message: "Recipe not found" });
    }
    res.status(200).send(recipeEntries);
}));
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Validating the data and sending code 400: client didnt send correct data
        const validatedData = yield entities_1.createRecipeSchema
            .validate(req.body)
            .catch((e) => {
            res.status(400).json({ erros: e.errors });
        });
        if (!validatedData) {
            return;
        }
        const recipeDTO = validatedData; //creating the Data Transfer Object for entity creation
        console.log(recipeDTO);
        const recipeEntry = new entities_1.Recipe(recipeDTO);
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
                }
                else if (curCategroy.name) {
                    //save the category (this case only the name) of non existing category
                    categoriesWithName.push(curCategroy);
                }
            }
        }
        //Loading the existing categories and merging both existing and non existing
        const loadedCategories = yield __1.DI.categoryEntryRepo.find({
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
        const loadedIngredients = yield __1.DI.ingredientEntryRepo.find(
        //loading the ingredients
        { id: { $in: ingredientsIds } });
        //wraping the new Recipie with the categories and the em in order for creating those categories that dont exist yet
        (0, core_1.wrap)(recipeEntry).assign({ categories: mergedCategories, ingredients: loadedIngredients }, { em: __1.DI.em });
        yield __1.DI.em.persistAndFlush(recipeEntry);
        res.status(201).send(recipeEntry);
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ error: "Internal Server Error" });
    }
}));
router.put("/id/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("put recipe");
        const recipeEntry = yield __1.DI.recipeEntryRepo.findOne(req.params.id); //getting the entity
        if (!recipeEntry) {
            return res.status(404).send({ message: "Recipe not found" });
        }
        //const recipeDTO: RecipeDTO = validatedData; //creating the Data Transfer Object for entity creation
        const _a = req.body, { ingredients, categories } = _a, rest = __rest(_a, ["ingredients", "categories"]); //getting the ingredients out of the body
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
                }
                else if (curCategroy.name) {
                    //save the category (this case only the name) of non existing category
                    categoriesWithName.push(curCategroy);
                }
            }
        }
        //Loading the existing categories and merging both existing and non existing
        const loadedCategories = yield __1.DI.categoryEntryRepo.find({
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
        const loadedIngredients = yield __1.DI.ingredientEntryRepo.find(
        //loading the ingredients
        { id: { $in: ingredientsIds } });
        //wraping the new Recipie with the categories and the em in order for creating those categories that dont exist yet
        (0, core_1.wrap)(recipeEntry).assign({ ingredients: loadedIngredients, categories: mergedCategories }, { em: __1.DI.em });
        (0, core_1.wrap)(recipeEntry).assign(rest); //updating entity
        yield __1.DI.em.flush();
        res.status(200).json(recipeEntry);
    }
    catch (e) {
        return res.status(400).send({ errors: [e.message] });
    }
}));
router.delete("/id/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingEntry = yield __1.DI.recipeEntryRepo.find({
            //loading the entity
            id: req.params.id,
        });
        if (!existingEntry) {
            //handleing not found
            return res.status(404).json({ errors: [`ID not found`] });
        }
        yield __1.DI.em.remove(existingEntry).flush();
        return res.status(204).send({});
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ error: "Internal Server Error" });
    }
}));
exports.RecipeController = router;
