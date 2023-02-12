import { Injectable, OnModuleInit, OnModuleDestroy, Logger, Post } from '@nestjs/common';
import { ConflictException, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Prisma, PrismaClient, PrismaPromise, UnwrapTuple } from '@prisma/client';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {

    public client: PrismaClient<{
        log: ({
            level: "query";
            emit: "event";
        } | {
            level: "warn";
            emit: "event";
        } | {
            level: "info";
            emit: "event";
        } | {
            level: "error";
            emit: "event";
        })[];
    }, "info" | "query" | "warn" | "error", false>;

    constructor(
        private logger: Logger
    ) {
        this.client = new PrismaClient({
            log: [
                { level: 'query', emit: 'event' },
                { level: 'warn', emit: 'event' },
                { level: 'info', emit: 'event' },
                { level: 'error', emit: 'event' },
            ],
        });

        this.client.$on('query', (e) => {
            // this.logger.debug(`${e.query} ${e.params === "[]" ? "" : e.params} \u001b[33m+${e.duration}ms`, 'Prisma Query');
        });


        this.client.$on('info', (e) => {
            this.logger.log(`${e.message}`, 'Prisma Info');
        });

        this.client.$on('warn', (e) => {
            this.logger.warn(`${e.message}`, 'Prisma Warn');
        });

        this.client.$on('error', (e) => {
            this.logger.error(`${e.message}`, 'Prisma Error');
        });

        /***********************************/
        /* SOFT DELETE MIDDLEWARE */
        /***********************************/

        this.client.$use(async (params, next) => {

            // 論理削除の例外
            if (
                params.model === Prisma.ModelName.UserRefreshToken
            ) {
                return next(params);
            }


            const softDeleteField = 'deletedAt';

            try {
                switch (params.action) {
                    case 'findUnique':
                    case 'findFirst':
                        params.action = 'findFirst';
                        params.args.where[softDeleteField] = null;
                        break;
                    case 'findMany':
                        if (!params.args) params.args = {};
                        if (params.args.where) {
                            if (params.args.where[softDeleteField] == undefined) {
                                params.args.where[softDeleteField] = null;
                            }
                        } else {
                            params.args = {};
                            params.args['where'] = {};
                            params.args['where'][softDeleteField] = null;
                        }
                        break;
                    // 更新処理の時は無視
                    // case 'update':
                    //     // update の戻り値は使えなくなる
                    //     this.logger.warn(`Don't use update.`, 'Prisma Error');
                    //     params.action = 'updateMany';
                    //     params.args.where[softDeleteField] = null;
                    //     break;
                    // case 'updateMany':
                    //     if (params.args.where != undefined) {
                    //         params.args.where[softDeleteField] = null;
                    //     } else {
                    //         params.args['where'] = {};
                    //         params.args['where'][softDeleteField] = null;
                    //     }
                    //     break;
                    case 'delete':
                        params.action = 'update';
                        params.args['data'] = {};
                        params.args['data'][softDeleteField] = new Date();
                        break;
                    case 'deleteMany':
                        params.action = 'updateMany';
                        if (params.args.data != undefined) {
                            params.args.data[softDeleteField] = new Date();
                        } else {
                            params.args['data'] = {};
                            params.args['data'][softDeleteField] = new Date();
                        }
                        break;
                }

            } catch (e) {
                this.logger.error(`${e.message}`, 'Prisma Error');
            }
            return next(params);
        });
    }

    async onModuleInit() {
        await this.client.$connect();
    }

    async onModuleDestroy() {
        await this.client.$disconnect();
    }

    async transaction<P extends PrismaPromise<any>[]>(arg: [...P]): Promise<UnwrapTuple<P>> {
        return this.client.$transaction(arg);
    }

    errorParser(error: any) {
        this.logger.error(error);
        switch (error.code) {
            case 'P2025':
                throw new NotFoundException();
            case 'P2003':
                throw new NotFoundException(`${error.meta.field_name} relation mismatch`);
            case 'P2002':
                throw new ConflictException(`conflict record`);
        }
        throw new InternalServerErrorException();
    }
}
