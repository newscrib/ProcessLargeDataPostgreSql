import { AppDataSource } from "./data-source";
import { User } from "./entity/User";
import { QueryRunner } from "typeorm";

const processLargeDataByCursor = async (): Promise<void> => {
    const start = performance.now();

    try {
        const queryRunner: QueryRunner = AppDataSource.createQueryRunner();

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
                // Обрабатываем результаты здесь
                for (const row of results) {
                    ++counter;
                }
            }
        }

        await queryRunner.query(`CLOSE ${usersCursor};`);
        await queryRunner.commitTransaction();

        const end = performance.now();
        console.log(`Время выполнения processLargeDataByCursor: ${end - start} миллисекунд. Counter: ${counter}`);
    } catch (error) {
        console.error('Ошибка при обработке данных:', error);
    }
};

const processLargeDataByOrderById = async (): Promise<void> => {
    const start: number = performance.now();

    try {
        const queryRunner: QueryRunner = AppDataSource.createQueryRunner();

        let lastId: string | undefined = undefined;
        const chunk: number = 1000;
        let hasMore: boolean = true;
        let counter: number = 0;

        while (hasMore) {
            const query = lastId
                ? `SELECT * FROM ${User.tableName} WHERE id > $1 ORDER BY id ASC LIMIT $2`
                : `SELECT * FROM ${User.tableName} ORDER BY id ASC LIMIT $1`;

            const parameters = lastId ? [lastId, chunk] : [chunk];

            const results: Array<{ id: string }> = await queryRunner.query(query, parameters);

            if (results.length === 0) {
                hasMore = false;
            } else {
                counter += results.length;
                lastId = results[results.length - 1]['id'];
            }
        }

        const end: number = performance.now();
        console.log(`Время выполнения processLargeDataByOrderById: ${end - start} миллисекунд. Counter: ${counter}`);
    } catch (error) {
        console.error('Ошибка при обработке данных:', error);
    }
}

const main = async (): Promise<void> => {
    await AppDataSource.initialize();

    await processLargeDataByCursor();
    await processLargeDataByOrderById();
};

main().finally(async () => {
    await AppDataSource.destroy();
    console.log("Функция завершена.");
});