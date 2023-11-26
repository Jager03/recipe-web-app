import {Router} from 'express';
import { DI } from '../';
import { wrap } from '@mikro-orm/core';

import { IngredientDTO, createIngredientSchema, Ingredient, Unit, deconstructData } from '../entities/Ingredient';

const router = Router({mergeParams:true});
router.get('/', async (req, res)=>{
    try{
        const ingredientEntrys = await DI.ingredientEntryRepo.findAll();    //finding all 
        res.status(200).send(ingredientEntrys);
    }catch(error){
        console.error(error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
})

router.post('/', async (req, res)=>{
    try{
        //Validating the data and sending code 400: client didnt send correct data
        const validatedData = await createIngredientSchema.validate(req.body).catch((e) => {
            res.status(400).json({erros: e.errors});
        });
        if(!validatedData){
            return;
        }

        const ingredientDTO: IngredientDTO = deconstructData(validatedData); //creating the Data Transfer Object for entity creation   
        
        const ingredientEntry = new Ingredient(ingredientDTO);
        await DI.em.persistAndFlush(ingredientEntry);
        res.status(201).send(ingredientEntry);
    }catch(error){
        console.error(error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
})

router.put('/:id', async (req, res)=>{
    try{
        const ingredientDTO: IngredientDTO = deconstructData(req.body);            //sending data to deconstruct

        const ingredientEntry = await DI.ingredientEntryRepo.findOne(req.params.id);    //getting the entity
        if (!ingredientEntry) {
            return res.status(404).send({ message: 'Ingredient not found' });
        }
        
        wrap(ingredientEntry).assign(ingredientDTO);                                    //updating entity
        await DI.em.flush();

        res.status(200).json(ingredientEntry);
    }catch(e: any){
        return res.status(400).send({ errors: [e.message] });
    }
})

router.delete('/:id', async (req, res)=>{
    try{
        const existingEntry = await DI.ingredientEntryRepo.find({           //loading the entity
            id: req.params.id,
        });
        if (!existingEntry) {                                               //handleing not found
            return res.status(404).json({ errors: [`ID not found`] });      
        }
        await DI.em.remove(existingEntry).flush();
        return res.status(204).send('Ingredient deleted');
    }catch(error){
        console.error(error);
        res.status(500).send({ error: 'Internal Server Error' });
    }  
})

export const IngredientController = router;