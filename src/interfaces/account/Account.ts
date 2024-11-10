import { IEdificio } from '../edificio/Edificio';
import { IPersona } from '../persona/Persona';
import { IAccount } from './Account';
export interface IAccount{
    email: string,
    password: string,
    rememberMe: boolean
}

export interface IAccountPersonEdificio extends IPersona{
    IdPersona: number;
}
