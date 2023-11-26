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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeServerasync = exports.DI = void 0;
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const core_1 = require("@mikro-orm/core");
const recipe_controller_1 = require("./controller/recipe.controller");
const ingredient_controller_1 = require("./controller/ingredient.controller");
const category_controller_1 = require("./controller/category.controller");
const index_1 = require("./entities/index");
const PORT = process.env.PORT;
const app = (0, express_1.default)();
exports.DI = {};
const initializeServerasync = () => __awaiter(void 0, void 0, void 0, function* () {
    exports.DI.orm = yield core_1.MikroORM.init();
    exports.DI.em = exports.DI.orm.em;
    exports.DI.ingredientEntryRepo = exports.DI.orm.em.getRepository(index_1.Ingredient);
    exports.DI.recipeEntryRepo = exports.DI.orm.em.getRepository(index_1.Recipe);
    exports.DI.categoryEntryRepo = exports.DI.orm.em.getRepository(index_1.Category);
    app.use(express_1.default.json());
    app.use((req, res, next) => core_1.RequestContext.create(exports.DI.orm.em, next));
    app.get('/', (req, res) => {
        res.send('Hello this world');
    });
    //Registering routs with respective controllers
    app.use('/recipe', recipe_controller_1.RecipeController);
    app.use('/ingredient', ingredient_controller_1.IngredientController);
    app.use('/category', category_controller_1.CategoryController);
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    });
});
exports.initializeServerasync = initializeServerasync;
(0, exports.initializeServerasync)();
