import { EstatusHabitacion } from "../../common/enums/enums";
import { IBaseEntity } from "../core/BaseInterface";

export interface IHabitacion extends IBaseEntity{
    numeroHabitacion: string;
    capacidadInquilinos: number;
    estatusHabitacion: EstatusHabitacion; 
    idEdificio: number;
}
