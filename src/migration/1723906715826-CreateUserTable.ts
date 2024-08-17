import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateUserTable1723906715826 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "users",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "uuid",
                    },
                    {
                        name: "first_name",
                        type: "varchar",
                    },
                    {
                        name: "last_name",
                        type: "varchar",
                    },
                    {
                        name: "age",
                        type: "int",
                    },
                ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("users");
    }

}
