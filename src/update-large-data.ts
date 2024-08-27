import { AppDataSource } from "./data-source";
import { User } from "./entity/User";
import { QueryRunner } from "typeorm";
import { v4 as uuidv4 } from 'uuid'

const updateLargeDataByCursor = async (): Promise<void> => {
    const start = performance.now();
    const queryRunner: QueryRunner = AppDataSource.createQueryRunner();

    try {
        await queryRunner.startTransaction();

        const usersCursor: string = 'users_cursor';
        await queryRunner.query(`DECLARE ${usersCursor} CURSOR FOR SELECT * FROM ${User.tableName};`);

        let hasMore: boolean = true;
        let counter: number = 0;

        while (hasMore) {
            const results = await queryRunner.query(`FETCH 1000 FROM ${usersCursor};`);

            if (results.length === 0) {
                hasMore = false;
            } else {
                for (const row of results) {
                    await queryRunner.manager.update(User, {id: row.id}, {age: 100});

                    ++counter;
                }
            }
        }

        await queryRunner.query(`CLOSE ${usersCursor};`);
        await queryRunner.commitTransaction();

        const end = performance.now();
        console.log(`Время выполнения updateLargeDataByCursor: ${end - start} миллисекунд. Counter: ${counter}`);
    } catch (error) {
        console.error('Ошибка при обработке данных:', error);
        await queryRunner.rollbackTransaction()
    }
};

const updateLargeDataByQuery = async (): Promise<void> => {
    const start = performance.now();
    const queryRunner: QueryRunner = AppDataSource.createQueryRunner();

    try {
        await queryRunner.startTransaction();

        const [, count] = await queryRunner.query(
            `
            UPDATE users
            SET age = 500
            `);
        await queryRunner.commitTransaction();

        const end = performance.now();
        console.log(`Время выполнения updateLargeDataByQuery: ${end - start} миллисекунд. Counter: ${count}`);
    } catch (error) {
        console.error('Ошибка при обработке данных:', error);
        await queryRunner.rollbackTransaction()
    }
};

const updateLargeData = async (): Promise<void> => {
    const start: number = performance.now();

    try {
        const userRepository = AppDataSource.getRepository(User)

        const result = await userRepository.update({}, {age: 100});

        const end: number = performance.now();
        console.log(`Время выполнения updateLargeData: ${end - start} миллисекунд. Counter: ${result.affected}`);
    } catch (error) {
        console.error('Ошибка при обработке данных:', error);
    }
}

const createUsers = (count: number): void => {
    const start = performance.now();
    const users: User[] = [];

    for (let i = 0; i < count; i++) {
        const user = new User();

        user.id = uuidv4()
        user.firstName = `FirstName${i}`
        user.lastName = `LastName${i}`
        user.age = Math.floor(Math.random() * 100)

        users.push(user)
    }

    const end = performance.now();
    console.log(`Время выполнения createUsers: ${end - start} миллисекунд. Counter: ${count}`)
}
const main = async (): Promise<void> => {
    await AppDataSource.initialize();

    await updateLargeDataByCursor();
    await updateLargeData();
    await updateLargeDataByQuery();
    createUsers(1000000)
};

main().finally(async () => {
    await AppDataSource.destroy();
    console.log("Функция завершена.");
});