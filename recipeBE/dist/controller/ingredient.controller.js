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
Object.defineProperty(exports, "__esModule", { value: true });
exports.IngredientController = void 0;
const express_1 = require("express");
const __1 = require("../");
const core_1 = require("@mikro-orm/core");
const Ingredient_1 = require("../entities/Ingredient");
const router = (0, express_1.Router)({ mergeParams: true });
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ingredientEntrys = yield __1.DI.ingredientEntryRepo.findAll(); //finding all 
        res.status(200).send(ingredientEntrys);
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Validating the data and sending code 400: client didnt send correct data
        const validatedData = yield Ingredient_1.createIngredientSchema.validate(req.body).catch((e) => {
            res.status(400).json({ erros: e.errors });
        });
        if (!validatedData) {
            return;
        }
        const ingredientDTO = (0, Ingredient_1.deconstructData)(validatedData); //creating the Data Transfer Object for entity creation   
        const ingredientEntry = new Ingredient_1.Ingredient(ingredientDTO);
        yield __1.DI.em.persistAndFlush(ingredientEntry);
        res.status(201).send(ingredientEntry);
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
}));
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ingredientDTO = (0, Ingredient_1.deconstructData)(req.body); //sending data to deconstruct
        const ingredientEntry = yield __1.DI.ingredientEntryRepo.findOne(req.params.id); //getting the entity
        if (!ingredientEntry) {
            return res.status(404).send({ message: 'Ingredient not found' });
        }
        (0, core_1.wrap)(ingredientEntry).assign(ingredientDTO); //updating entity
        yield __1.DI.em.flush();
        res.status(200).json(ingredientEntry);
    }
    catch (e) {
        return res.status(400).send({ errors: [e.message] });
    }
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingEntry = yield __1.DI.ingredientEntryRepo.find({
            id: req.params.id,
        });
        if (!existingEntry) { //handleing not found
            return res.status(404).json({ errors: [`ID not found`] });
        }
        yield __1.DI.em.remove(existingEntry).flush();
        return res.status(204).send('Ingredient deleted');
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
}));
exports.IngredientController = router;
