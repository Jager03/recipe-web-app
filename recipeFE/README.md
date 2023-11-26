# Front end for recipe we app

## How to start the program

- run command npm ci
- run command npm run dev

## Front end strucutre / routes

- route "/" this route renders the home page of the application where a table with all the recipies is to be found. In the table there is the possibility to update and delete any of the recipes by clicking the buttons to the right of each row. Additionally there is a create recipe button for creating new recipes. If you click on the name of any recipe on this table you will be redirected to the route "/recipe/:id"

- route "/recipe/:id" this route displays all the information of the recipe passed by in the url

- route "/ingredient" similar to the "/" route, this renders a table with all the ingredients. Each row contains all the information about each ingredient and you can also update, delete or create ingredients.

- route "/category" also similar to the "/" route, here you can delete, update or create categorys.

- route "/search" here a form is rendered that lets you search for a recipe. It is possible to search for only a recipe name, only for a set of categories, both, or neither. If you select an ingredient to search for, then the search will only be focused on that ingredient. After submitting the search, a table will apear with the sear results. Clicking in the recipe name will route you to the detail recipe page
