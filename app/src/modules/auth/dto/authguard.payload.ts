import { Permission } from "@prisma/client";

export interface AuthGuardPayload {
    userId: number;
    permission: Permission;
}
