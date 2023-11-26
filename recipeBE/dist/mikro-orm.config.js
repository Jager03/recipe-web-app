"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Ingredient_1 = require("./entities/Ingredient");
const Category_1 = require("./entities/Category");
const Recipe_1 = require("./entities/Recipe");
require("dotenv/config");
const options = {
    type: 'postgresql',
    entities: [Ingredient_1.Ingredient, Recipe_1.Recipe, Category_1.Category],
    dbName: process.env.DBNAME,
    password: process.env.DBPASSWORD,
    user: process.env.DBUSER,
    debug: true,
};
exports.default = options;
