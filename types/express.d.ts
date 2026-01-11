declare global {
    namespace Express {
        interface User {
            userId: number;
            username: string;
            name: string;
            password: string;
        }
    }
}

export {};