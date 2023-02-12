import { Prisma } from "@prisma/client";
export class RepositoryBase {
    constructor(protected readonly client: {
        aggregate: Function;
        count: Function;
        create: Function;
        createMany: Function;
        delete: Function;
        deleteMany: Function;
        findFirst: Function;
        findMany: Function;
        findUnique: Function;
        update: Function;
        updateMany: Function;
        upsert: Function;
    }) {
        const self = (this as any);
        self.aggregate = client.aggregate;
        self.count = client.count;
        self.create = client.create;
        self.createMany = client.createMany;
        self.delete = client.delete;
        self.deleteMany = client.deleteMany;
        self.findFirst = client.findFirst;
        self.findMany = client.findMany;
        self.findUnique = client.findUnique;
        self.update = client.update;
        self.updateMany = client.updateMany;
        self.upsert = client.upsert;
    }
}

export type GlobalRejectSettings = Prisma.PrismaClientOptions['rejectOnNotFound'];
