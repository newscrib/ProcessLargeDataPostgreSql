import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity('users')
export class User {
    /** @description Название таблицы */
    public static tableName = 'users'

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({name: 'first_name'})
    firstName: string

    @Column({name: 'last_name'})
    lastName: string

    @Column()
    age: number

}
