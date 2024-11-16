import { IContrato } from '../../interfaces/contrato/Contrato';
import { BaseService } from '../core/BaseService';

const controller = "Contrato";

export class ContratoService extends BaseService {
    constructor() {
        super(controller);
    }

    async createContrato(data:IContrato) {
        console.log(data);
        
        try {
            const formData = new FormData();
            const fechaInicio = new Date(data.fechaInicio);
            const fechaFin = new Date(data.fechaFin);

            formData.append("FechaInicio", fechaInicio.toISOString());
            formData.append("FechaFin", fechaFin.toISOString());
            formData.append("EstatusContrato", data.estatusContrato);
            formData.append("TipoContrato", data.tipoContrato);
            formData.append("Duracion", data.duracion.toString());
            formData.append("Monto", data.monto.toString());
            formData.append("IdInquilino", data.idInquilino.toString());
            formData.append("IdHabitacion", data.idHabitacion.toString());
            formData.append("ContratoPDF", data.contratoPDF);
    
            const response = await fetch(`${this.baseAPI}/${controller}/create-contrato`, {
                method: 'POST',
                body: formData,
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Error creating data:', error);
            throw error;
        }
    }

    async updateContrato(id:number, data:IContrato) {
        console.log(data);
        
        try {
            const formData = new FormData();
            const fechaInicio = new Date(data.fechaInicio);
            const fechaFin = new Date(data.fechaFin);

            formData.append("FechaInicio", fechaInicio.toISOString());
            formData.append("FechaFin", fechaFin.toISOString());
            formData.append("EstatusContrato", data.estatusContrato);
            formData.append("TipoContrato", data.tipoContrato);
            formData.append("Duracion", data.duracion.toString());
            formData.append("Monto", data.monto.toString());
            formData.append("IdInquilino", data.idInquilino.toString());
            formData.append("IdHabitacion", data.idHabitacion.toString());
            formData.append("ContratoPDF", data.contratoPDF);
    
            const response = await fetch(`${this.baseAPI}/${controller}/update-contrato/${id}`, {
                method: 'PUT',
                body: formData,
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Error creating data:', error);
            throw error;
        }
    }

    async getAllByRol(token: string) {
        try {            
            const response = await fetch(`${this.baseAPI}/${controller}/GetAllByRol`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(token),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Error creating data:', error);
            throw error;
        }
    }
    
}