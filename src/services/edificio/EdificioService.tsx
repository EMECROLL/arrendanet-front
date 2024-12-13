import { BaseService } from '../core/BaseService';

const controller = "Edificio";

export class EdificioService extends BaseService {
    constructor() {
        super(controller);
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