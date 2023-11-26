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
exports.Recipe = void 0;
const core_1 = require("@mikro-orm/core");
const BaseEntity_1 = require("./BaseEntity");
const Ingredient_1 = require("./Ingredient");
let Recipe = class Recipe extends BaseEntity_1.BaseEntity {
    constructor({ name, imageURL, description }) {
        super();
        this.ingredients = new core_1.Collection(this);
        this.name = name;
        this.imageURL = imageURL;
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
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Recipe.prototype, "imageURL", void 0);
__decorate([
    (0, core_1.ManyToMany)(() => Ingredient_1.Ingredient, (e) => e.recipes),
    __metadata("design:type", Object)
], Recipe.prototype, "ingredients", void 0);
exports.Recipe = Recipe = __decorate([
    (0, core_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], Recipe);
