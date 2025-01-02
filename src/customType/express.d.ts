import { Member } from '@prisma/client';

declare global {
    namespace Express {
        interface Request {
            user?: Member;
        }
    }
}