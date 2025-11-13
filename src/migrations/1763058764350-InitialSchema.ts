import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class InitialSchema1763058764350 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "users",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: "uuid_generate_v4()",
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "255",
                    },
                    {
                        name: "lastname",
                        type: "varchar",
                        length: "255",
                    },
                    {
                        name: "phone",
                        type: "varchar",
                        length: "20",
                    },
                    {
                        name: "email",
                        type: "varchar",
                        length: "255",
                        isUnique: true,
                    },
                    {
                        name: "password",
                        type: "varchar",
                        length: "255",
                    },
                    {
                        name: "active",
                        type: "boolean",
                        default: true,
                    },
                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "now()",
                    },
                    {
                        name: "updatedAt",
                        type: "timestamp",
                        default: "now()",
                    },
                ],
            }),
            true,
        );

        await queryRunner.createIndex(
            "users",
            new TableIndex({
                name: "IDX_USER_EMAIL",
                columnNames: ["email"],
            }),
        );

        await queryRunner.createTable(
            new Table({
                name: "tasks",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: "uuid_generate_v4()",
                    },
                    {
                        name: "title",
                        type: "varchar",
                        length: "255",
                    },
                    {
                        name: "completed",
                        type: "boolean",
                        default: false,
                    },
                    {
                        name: "userId",
                        type: "uuid",
                    },
                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "now()",
                    },
                    {
                        name: "updatedAt",
                        type: "timestamp",
                        default: "now()",
                    },
                ],
            }),
            true,
        );

        await queryRunner.createIndex(
            "tasks",
            new TableIndex({
                name: "IDX_TASK_USER",
                columnNames: ["userId"],
            }),
        );

        await queryRunner.query(`
            ALTER TABLE "tasks" 
            ADD CONSTRAINT "FK_TASK_USER" 
            FOREIGN KEY ("userId") 
            REFERENCES "users"("id") 
            ON DELETE CASCADE
        `);

        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_TASK_USER"`);
        await queryRunner.dropIndex("tasks", "IDX_TASK_USER");
        await queryRunner.dropTable("tasks");
        await queryRunner.dropIndex("users", "IDX_USER_EMAIL");
        await queryRunner.dropTable("users");
    }

}
