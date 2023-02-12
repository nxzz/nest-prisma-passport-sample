import { PrismaService } from 'src/modules/prisma/prisma.service';
import { Injectable, Module } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { RepositoryBase, GlobalRejectSettings } from './base.repository';

class _UserRefreshTokenRepository extends RepositoryBase { }
interface _UserRefreshTokenRepository extends Prisma.UserRefreshTokenDelegate<GlobalRejectSettings> { }

@Injectable()
export class UserRefreshTokenRepository extends _UserRefreshTokenRepository {
    constructor(prisma: PrismaService) {
        super(prisma.client.userRefreshToken);
    }
}
