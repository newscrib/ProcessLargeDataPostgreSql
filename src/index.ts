import { AppDataSource } from "./data-source";
import { User } from "./entity/User";
import { QueryRunner } from "typeorm";

const processLargeDataByCursor = async (): Promise<void> => {
    const start = performance.now();

    try {
        await AppDataSource.initialize();
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
        console.log(`Время выполнения: ${end - start} миллисекунд. Counter: ${counter}`);
    } catch (error) {
        console.error('Ошибка при обработке данных:', error);
    } finally {
        await AppDataSource.destroy();
    }
};

const main = async (): Promise<void> => {
    await processLargeDataByCursor();
};

main().finally(() => {
    console.log("Функция завершена.");
});