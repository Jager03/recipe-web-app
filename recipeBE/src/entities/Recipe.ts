import {
  Collection,
  Entity,
  ManyToMany,
  Property,
  ManyToOne,
} from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";
import {
  Ingredient,
  createIngredientSchema,
  Unit,
  IngredientDTO,
} from "./Ingredient";
import { Category, CategoryDTO } from "./Category";
import { object, string, array, number, mixed, ObjectSchema } from "yup";

@Entity()
export class Recipe extends BaseEntity {
  @Property()
  name: string;

  @Property()
  description: string;

  @ManyToMany(() => Ingredient)
  ingredients? = new Collection<Ingredient>(this); //Passing the instance of the class in constructor

  @ManyToMany(() => Category)
  categories? = new Collection<Category>(this);

  constructor({ name, description, ingredients }: RecipeDTO) {
    super();
    this.name = name;

    this.description = description;
  }
}

//schema for validation of ingredient
export const createRecipeSchema = object({
  name: string().required(),
  //this line is throwing an error, so for now ingredients wont be a requiered field
  //ingredients: array().of(createIngredientSchema).required(),      //giving the ingredientSchema to validate that the ingredient is

  description: string().required("Description is requiered"),
});

export type RecipeDTO = {
  name: string;
  //imageURL?: string;
  description: string;
  ingredients?: IngredientDTO[];
  categories?: CategoryDTO[];
};
