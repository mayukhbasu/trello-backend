import { CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class JwtAuthGuard implements CanActivate {
    private readonly configService;
    private readonly logger;
    private googleClient;
    constructor(configService: ConfigService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
