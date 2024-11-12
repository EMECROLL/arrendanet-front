import { EstatusContrato, TipoContrato } from "../../common/enums/enums";
import { IBaseEntity } from "../core/BaseInterface";

export interface IContrato extends IBaseEntity{
    fechaInicio: Date;
    fechaFin: Date;
    estatusContrato: EstatusContrato; 
    tipoContrato: TipoContrato;
    duracion: number;
    monto: number;
    idInquilino: number;
    idHabitacion: number;
    contratoPDF: File;
}