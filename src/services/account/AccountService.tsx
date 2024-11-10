import { IAccount } from '../../interfaces/account/Account';
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
    
    async validateToken(token: string) {
        try {            
            const response = await fetch(`${this.baseAPI}/${controller}/validateToken`, {
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

    async getAllRoles() {
        try {            
            const response = await fetch(`${this.baseAPI}/${controller}/getAllRoles`);
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