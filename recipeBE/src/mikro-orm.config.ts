import {Options} from '@mikro-orm/core';
import { Ingredient } from './entities/Ingredient';
import { Category } from './entities/Category';
import { Recipe } from './entities/Recipe';
import 'dotenv/config';

const options: Options = {
    type: 'postgresql',
    entities: [Ingredient, Recipe, Category],
    dbName: process.env.DBNAME,
    password: process.env.DBPASSWORD,
    user: process.env.DBUSER,
    debug: true,
}

export default options;