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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deconstructData = exports.createIngredientSchema = exports.Ingredient = exports.Unit = void 0;
const core_1 = require("@mikro-orm/core");
const BaseEntity_1 = require("./BaseEntity");
const Recipe_1 = require("./Recipe");
const yup_1 = require("yup");
//Defining an enum to use for the unit propery
var Unit;
(function (Unit) {
    Unit["LITERS"] = "liters";
    Unit["GRAMS"] = "grams";
    Unit["MLITERS"] = "mili-liters";
    Unit["MGRAMS"] = "mili-grams";
    Unit["HOLE"] = "hole";
})(Unit || (exports.Unit = Unit = {}));
let Ingredient = class Ingredient extends BaseEntity_1.BaseEntity {
    constructor({ name, amount, unit, description }) {
        super();
        this.recipes = new core_1.Collection(this);
        this.name = name;
        this.amount = amount;
        this.unit = unit;
        this.description = description;
    }
};
exports.Ingredient = Ingredient;
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Ingredient.prototype, "name", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Ingredient.prototype, "description", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", Number)
], Ingredient.prototype, "amount", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Ingredient.prototype, "unit", void 0);
__decorate([
    (0, core_1.ManyToMany)(() => Recipe_1.Recipe, (e) => e.ingredients),
    __metadata("design:type", Object)
], Ingredient.prototype, "recipes", void 0);
exports.Ingredient = Ingredient = __decorate([
    (0, core_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], Ingredient);
//schema for validation of ingredient
exports.createIngredientSchema = (0, yup_1.object)({
    name: (0, yup_1.string)().required(),
    amount: (0, yup_1.number)().required(),
    unit: (0, yup_1.mixed)()
        .oneOf(Object.values(Unit))
        .required(),
    description: (0, yup_1.string)().required(),
});
//function that deconstructs the validated data from the request and assignes the type unit to the unit from the request
function deconstructData(validatedData) {
    const { unit } = validatedData, rest = __rest(validatedData, ["unit"]); //deconstructing to get unit out of valitdatedData
    if (unit) {
        //if no unit in the request then, there is no need to deconstruct
        const ingredientDTO = Object.assign({ 
            //creating the DTO for creating the new Ingredient
            unit: unit }, rest);
        return ingredientDTO;
    }
    const ingredientDTO = validatedData;
    return ingredientDTO;
}
exports.deconstructData = deconstructData;
