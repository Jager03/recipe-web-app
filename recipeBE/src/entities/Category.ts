import { Collection, Entity, ManyToMany, Property } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";
import { Recipe } from "./Recipe";
import { object, string } from "yup";

@Entity()
export class Category extends BaseEntity {
  @Property()
  name: string;

  @ManyToMany(() => Recipe, (e) => e.categories)
  recipes = new Collection<Recipe>(this);

  constructor(name: string) {
    super();
    this.name = name;
  }
}

/* export type CategoryDTO = {     //saying that the DTO also has the properties from the superclase
    name: string;                           //in order to avoid error in post method of Recipe
}; */

export type CategoryDTO = Partial<Pick<Category, "id" | "name">>;

//schema for validation of ingredient
export const categoryCreateIngredientSchema = object({
  name: string().required(),
});
