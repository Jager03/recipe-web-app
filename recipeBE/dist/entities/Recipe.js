"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRecipeSchema = exports.Recipe = void 0;
const core_1 = require("@mikro-orm/core");
const BaseEntity_1 = require("./BaseEntity");
const Ingredient_1 = require("./Ingredient");
const Category_1 = require("./Category");
const yup_1 = require("yup");
let Recipe = class Recipe extends BaseEntity_1.BaseEntity {
    constructor({ name, description, ingredients }) {
        super();
        this.ingredients = new core_1.Collection(this); //Passing the instance of the class in constructor
        this.categories = new core_1.Collection(this);
        this.name = name;
        this.description = description;
    }
};
exports.Recipe = Recipe;
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Recipe.prototype, "name", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Recipe.prototype, "description", void 0);
__decorate([
    (0, core_1.ManyToMany)(() => Ingredient_1.Ingredient),
    __metadata("design:type", Object)
], Recipe.prototype, "ingredients", void 0);
__decorate([
    (0, core_1.ManyToMany)(() => Category_1.Category),
    __metadata("design:type", Object)
], Recipe.prototype, "categories", void 0);
exports.Recipe = Recipe = __decorate([
    (0, core_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], Recipe);
//schema for validation of ingredient
exports.createRecipeSchema = (0, yup_1.object)({
    name: (0, yup_1.string)().required(),
    //this line is throwing an error, so for now ingredients wont be a requiered field
    //ingredients: array().of(createIngredientSchema).required(),      //giving the ingredientSchema to validate that the ingredient is
    description: (0, yup_1.string)().required("Description is requiered"),
});
