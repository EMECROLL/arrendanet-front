import { IAccount } from '../../interfaces/account/account';
import { BaseService } from '../core/BaseService';

const controller = "Account";

export class AccountService extends BaseService {
    constructor() {
        super(controller);
    }

    async login(data: IAccount) {
        try {
            const response = await fetch(`${this.baseAPI}/${controller}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
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
    
    async validateToken(data: IAccount) {
        try {
            const response = await fetch(`${this.baseAPI}/${controller}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
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