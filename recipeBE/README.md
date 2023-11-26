# Recipe Backend!

## Getting started:

In order for the database to run, it is needed to define a .env file with the following infromations: PORT = 3000
DBNAME, DBPASSWORD, DBUSER

- navigate inside the recipeBE folder.
- run the command "npm ci"
- start the database by running "docker-compose up"
- start the server by running "npm run dev"

After that, the server should be up and running and available to test in browser or with postman.

## Project functionality

The project connects to a PostgreSQL data base, that has been initialized with the entities in the /src/entities folder. This entities (Recipe, Ingredient, Category) were discribed using mikro-orm and persisted in the database using its entity manager. It is possible to create, read, update and delete each of the entities.

**Entities**

- Ingredient: name, description, unit, amount
- Category: name
- Recipe: name, description, array of ingredients and array of categories.

## Routes

### recipe.controller.tsx

This file is responsable for the CRUD operations of the recipe entity and describes following routes:

- **/** this route returns all the recipes in the database and accepts also two query parameters in order to narrow the returned recipes searching by a name or by categories. If used with post, creates a new recipe. In order to create a new recipe, only the id of the ingredients needs to be passed in the body of the request.

- **/id/:id** the extra "/id" was put there in order for later in the frontend be able to differentiate between the two get routes. This route returns the recipe with the id passed in the URL. Or deletes or updates the recipe corresponding to the given ID.

- **/ingredient/:ingredientName** this route returns all recipes corresponing to the ingredient passed in the URL.

### recipe.controller.tsx

In this file is the corresponding CRUD operation for the ingredient enity.

- **/** there is only one route that handles all the CRUD. For update and delete it is neccesary to pass a id in the URL.

### recipe.controller.tsx

In this file is the corresponding CRUD operation for the category enity.

- **/** there is only one route that handles all the CRUD. For update and delete it is neccesary to pass a id in the URL.
