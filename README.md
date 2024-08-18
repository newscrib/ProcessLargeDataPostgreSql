# Process large data from PostgreSql

# Запуск проекта

Для запуска проекта выполните следующие шаги:

1. **Запустите Docker Compose**:
    ```bash
    docker-compose up -d
    ```

2. **Выполните миграции**:
    ```bash
    npm run migration:run
    ```

3. **Запустите проект**:
    ```bash
    ts-node src/index.ts
    ```