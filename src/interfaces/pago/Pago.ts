import { EstatusPago } from "../../common/enums/enums";
import { IBaseEntity } from "../core/BaseInterface";

export interface IPago extends IBaseEntity{
    fecha: Date;
    monto: number;
    estatusPago: EstatusPago;
    idContrato: number;
}
