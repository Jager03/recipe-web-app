import express from 'express';
import http from 'http';
import 'dotenv/config';

import { EntityManager, MikroORM, RequestContext} from '@mikro-orm/core';

import { RecipeController } from './controller/recipe.controller';
import { IngredientController } from './controller/ingredient.controller';
import { CategoryController } from './controller/category.controller';
import { Ingredient, Recipe, Category } from './entities/index';
import { EntityRepository } from '@mikro-orm/postgresql';

const PORT = process.env.PORT;
const app = express();

export const DI = {} as {       //as: keyword to define Types in TS
    server: http.Server;
    orm: MikroORM;
    em: EntityManager;
    ingredientEntryRepo: EntityRepository<Ingredient>;
    recipeEntryRepo: EntityRepository<Recipe>;
    categoryEntryRepo: EntityRepository<Category>;
};

export const initializeServerasync = async () => {
    DI.orm = await MikroORM.init();
    DI.em = DI.orm.em;
    DI.ingredientEntryRepo = DI.orm.em.getRepository(Ingredient);
    DI.recipeEntryRepo = DI.orm.em.getRepository(Recipe);
    DI.categoryEntryRepo = DI.orm.em.getRepository(Category);

    app.use(express.json());
    app.use((req, res, next) => RequestContext.create(DI.orm.em, next));

    app.get('/', (req, res) =>{
        res.send('Hello this world');
    })
    
    //Registering routs with respective controllers
    app.use('/recipe', RecipeController);
    app.use('/ingredient', IngredientController);
    app.use('/category', CategoryController);
    
    app.listen(PORT, ()=>{
        console.log(`Listening on port ${PORT}`);
    })
}

initializeServerasync();

