import {v4} from 'uuid';
import { PrimaryKey, Property } from '@mikro-orm/core';

export abstract class BaseEntity{
    @PrimaryKey()
    id: string = v4();

    @Property()
    createdAt: Date = new Date();

    @Property({onUpdate:()=> new Date()})       //Giving in options onUpdate event so it is always updated
    updatedAt: Date = new Date();
}