import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "your_username",
    password: "your_password",
    database: "your_database",
    synchronize: false,
    logging: false,
    entities: [User],
    migrations: ["src/migration/**/*.ts"],
    subscribers: [],
});