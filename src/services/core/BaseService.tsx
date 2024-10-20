export class BaseService {
    private controller: string;

    constructor(controller: string) {
        this.controller = controller;
    }

    private get baseAPI() {
        return import.meta.env.VITE_API_URL;
    }

    async getAll() {
        try {
            const response = await fetch(`${this.baseAPI}/${this.controller}/`);
            if (!response.ok) {
                throw new Error('Error fetching data');
            }
            return await response.json();
        } catch (error) {
            console.error('Error in BaseService.getAll:', error);
            throw error;
        }
    }

    async getById(id: number) {
        try {
            const response = await fetch(`${this.baseAPI}/${this.controller}/${id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    }
    
    async create(data: any) {
        try {
            const response = await fetch(`${this.baseAPI}/${this.controller}`, {
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

    async edit(id: number, data: any) {
        try {
            const response = await fetch(`${this.baseAPI}/${this.controller}/${id}`, {
                method: 'PUT',
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
            console.error('Error editing data:', error);
            throw error;
        }
    }

    async delete(id: number) {
        try {
            const response = await fetch(`${this.baseAPI}/${this.controller}/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            if (response.status === 204) {
                return null;
            }

            return await response.json();
        } catch (error) {
            console.error('Error deleting data:', error);
            throw error;
        }
    }
}