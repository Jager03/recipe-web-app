import {Router} from 'express';
import { DI } from '../';
import { wrap } from '@mikro-orm/core';
import {CategoryDTO, categoryCreateIngredientSchema, Category} from '../entities/Category';

const router = Router({mergeParams:true});

router.get('/', async (req, res)=>{
    try{
        const categoryEntrys = await DI.categoryEntryRepo.findAll();    //finding all 
        res.status(200).send(categoryEntrys);
    }catch(error){
        console.error(error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
})

router.post('/', async (req, res)=>{
    try{
        //Validating the data and sending code 400: client didnt send correct data
        const validatedData = await categoryCreateIngredientSchema.validate(req.body).catch((e) => {
            res.status(400).json({erros: e.errors});
        });
        if(!validatedData){
            return;
        }
            
        const categoryEntry = new Category(validatedData.name);
        await DI.em.persistAndFlush(categoryEntry);
        res.status(201).send(categoryEntry);
    }catch(error){
        console.error(error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
})

router.put('/:id', async (req, res)=>{
    try{
        const categoryEntry = await DI.categoryEntryRepo.findOne(req.params.id);    //getting the entity
        wrap(categoryEntry).assign(req.body);                                      //updating entity
        await DI.em.flush();

        res.status(200).json(categoryEntry);
    }catch(e: any){
        return res.status(400).send({ errors: [e.message] });
    }
})

router.delete('/:id', async (req, res)=>{
    try{
        const existingEntry = await DI.categoryEntryRepo.find({           //loading the entity
            id: req.params.id,
        });
        if (!existingEntry) {                                               //handle not found
            return res.status(404).json({ errors: [`ID not found`] });
        }
        await DI.em.remove(existingEntry).flush();
        return res.status(204).send('Ingredient deleted');
    }catch(error){
        console.error(error);
        res.status(500).send({ error: 'Internal Server Error' });
    }  
})

export const CategoryController = router;