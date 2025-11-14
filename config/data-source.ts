import "reflect-metadata";
import { DataSource } from "typeorm";
import { User, UserAccount, UserVisit, Board, BoardComment, BoardImage } from "../database/entities";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3308"),
  username: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "123456789",
  database: process.env.DB_DATABASE || "app",
  synchronize: false,
  logging: process.env.NODE_ENV !== "production",
  entities: [User, UserAccount, UserVisit, Board, BoardComment, BoardImage],
  migrations: [],
  subscribers: [],
});

let isInitialized = false;

export const initializeDatabase = async () => {
  if (!isInitialized) {
    try {
      await AppDataSource.initialize();
      isInitialized = true;
    } catch (error) {
      throw error;
    }
  }
  return AppDataSource;
};

export const getDataSource = async () => {
  if (!isInitialized) {
    await initializeDatabase();
  }
  return AppDataSource;
};
