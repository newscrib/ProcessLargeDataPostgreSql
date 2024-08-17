import { MigrationInterface, QueryRunner } from "typeorm";
import { v4 as uuidv4 } from 'uuid'

export class PopulateUsersTable1723908646490 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const recordCount = 1000000
        const batchSize = 1000;
        const users = [];

        for (let i = 0; i < recordCount; i++) {
            users.push({
                id: uuidv4(),
                first_name: `FirstName${i}`,
                last_name: `LastName${i}`,
                age: Math.floor(Math.random() * 100) + 1
            });

            if (users.length === batchSize || i === (recordCount - 1)) {
                const values = users
                    .map(user => `('${user.id}', '${user.first_name}', '${user.last_name}', ${user.age})`)
                    .join(", ");

                await queryRunner.query(`
                    INSERT INTO users (id, first_name, last_name, age)
                    VALUES ${values}
                `);

                users.length = 0;
            }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM users`);
    }

}
