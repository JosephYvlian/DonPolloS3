export declare class MailerService {
    private transporter;
    private readonly logger;
    constructor();
    private initTransporter;
    sendPasswordResetEmail(to: string, token: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
