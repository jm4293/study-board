import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3308"),
  username: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "123456789",
  database: process.env.DB_DATABASE || "app",
  synchronize: process.env.NODE_ENV !== "production", // 개발 환경에서만 자동 스키마 동기화
  logging: process.env.NODE_ENV !== "production",
  entities: ["src/entities/**/*.ts"],
  migrations: ["src/migrations/**/*.ts"],
  subscribers: ["src/subscribers/**/*.ts"],
});

let isInitialized = false;

export const initializeDatabase = async () => {
  if (!isInitialized) {
    try {
      await AppDataSource.initialize();
      isInitialized = true;
      console.log("Database connection established successfully");
    } catch (error) {
      console.error("Error during Data Source initialization:", error);
      throw error;
    }
  }
  return AppDataSource;
};

export const getDatabase = async () => {
  if (!isInitialized) {
    await initializeDatabase();
  }
  return AppDataSource;
};
