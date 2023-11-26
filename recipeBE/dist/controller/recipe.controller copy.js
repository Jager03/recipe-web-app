"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipeController = void 0;
const express_1 = require("express");
const router = (0, express_1.Router)({ mergeParams: true });
router.get('/', (req, res) => {
    res.send('hello recipe/get');
});
router.post('/', (req, res) => {
    res.send('hello recipe/post');
});
router.put('/', (req, res) => {
    res.send('hello recipe/put');
});
router.delete('/', (req, res) => {
    res.send('hello recipe/delete');
});
exports.RecipeController = router;
