import { Entity, ManyToMany, Property, Collection } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";
import { Recipe } from "./Recipe";
import { object, string, mixed, number, ObjectSchema } from "yup";

//Defining an enum to use for the unit propery
export enum Unit {
  LITERS = "liters",
  GRAMS = "grams",
  MLITERS = "mili-liters",
  MGRAMS = "mili-grams",
  HOLE = "hole",
}

@Entity()
export class Ingredient extends BaseEntity {
  @Property()
  name: string;

  @Property()
  description: string;

  @Property()
  amount: number;

  @Property()
  unit: Unit;

  @ManyToMany(() => Recipe, (e) => e.ingredients)
  recipes = new Collection<Recipe>(this);

  constructor({ name, amount, unit, description }: IngredientDTO) {
    super();
    this.name = name;
    this.amount = amount;
    this.unit = unit;
    this.description = description;
  }
}

export type IngredientDTO = {
  name: string;
  amount: number;
  unit: Unit;
  description: string;
  id: string;
};

//schema for validation of ingredient
export const createIngredientSchema = object({
  name: string().required(),
  amount: number().required(),
  unit: mixed()
    .oneOf(Object.values(Unit) as Unit[])
    .required(), //making the unit requierd being an Enum
  description: string().required(),
});

//function that deconstructs the validated data from the request and assignes the type unit to the unit from the request
export function deconstructData(validatedData: any): IngredientDTO {
  const { unit, ...rest } = validatedData; //deconstructing to get unit out of valitdatedData

  if (unit) {
    //if no unit in the request then, there is no need to deconstruct
    const ingredientDTO: IngredientDTO = {
      //creating the DTO for creating the new Ingredient
      unit: unit as Unit, //declarting unit as from type unit
      ...rest,
    };
    return ingredientDTO;
  }

  const ingredientDTO: IngredientDTO = validatedData;
  return ingredientDTO;
}
