import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(body: any): Promise<any>;
    login(body: any): Promise<{
        access_token: string;
        user: any;
    }>;
    forgotPassword(body: any): Promise<{
        message: string;
    }>;
    resetPassword(body: any): Promise<{
        message: string;
    }>;
}
