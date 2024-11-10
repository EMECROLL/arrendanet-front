import { IBaseEntity } from "../core/BaseInterface";

export interface IPersona extends IBaseEntity{
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    idUsuario: number;
}
