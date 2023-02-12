import { PrismaService } from 'src/modules/prisma/prisma.service';
import { Injectable, Module } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { RepositoryBase, GlobalRejectSettings } from './base.repository';

class _UserRepository extends RepositoryBase { }
interface _UserRepository extends Prisma.UserDelegate<GlobalRejectSettings> { }

@Injectable()
export class UserRepository extends _UserRepository {
    constructor(prisma: PrismaService) {
        super(prisma.client.user);
    }
}
