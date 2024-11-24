import { IPersona } from '../persona/Persona';
export interface IAccount{
    email: string,
    password: string,
    rememberMe: boolean
}

export interface IAccountPersonEdificio extends IPersona{
    IdPersona: number;
}
