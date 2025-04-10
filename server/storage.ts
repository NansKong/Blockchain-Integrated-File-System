import { 
  users, type User, type InsertUser,
  files, type File, type InsertFile,
  transactions, type Transaction, type InsertTransaction
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // File operations
  getFilesByUserId(userId: string): Promise<File[]>;
  getFileByHash(hash: string): Promise<File | undefined>;
  createFile(file: InsertFile): Promise<File>;
  updateFileStatus(hash: string, status: string): Promise<File | undefined>;
  updateFileTxHash(hash: string, txHash: string): Promise<File | undefined>;

  // Transaction operations
  getTransactionsByUserId(userId: string): Promise<Transaction[]>;
  getTransactionByTxHash(txHash: string): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // File operations
  async getFilesByUserId(userId: string): Promise<File[]> {
    return await db
      .select()
      .from(files)
      .where(eq(files.user_id, userId))
      .orderBy(desc(files.upload_date));
  }

  async getFileByHash(hash: string): Promise<File | undefined> {
    const [file] = await db.select().from(files).where(eq(files.hash, hash));
    return file;
  }

  async createFile(file: InsertFile): Promise<File> {
    const [newFile] = await db
      .insert(files)
      .values(file)
      .returning();
    return newFile;
  }

  async updateFileStatus(hash: string, status: string): Promise<File | undefined> {
    const [file] = await db
      .update(files)
      .set({ status })
      .where(eq(files.hash, hash))
      .returning();
    return file;
  }

  async updateFileTxHash(hash: string, txHash: string): Promise<File | undefined> {
    const [file] = await db
      .update(files)
      .set({ tx_hash: txHash, status: "verified" })
      .where(eq(files.hash, hash))
      .returning();
    return file;
  }

  // Transaction operations
  async getTransactionsByUserId(userId: string): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(eq(transactions.user_id, userId))
      .orderBy(desc(transactions.timestamp));
  }

  async getTransactionByTxHash(txHash: string): Promise<Transaction | undefined> {
    const [transaction] = await db
      .select()
      .from(transactions)
      .where(eq(transactions.tx_hash, txHash));
    return transaction;
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const [newTransaction] = await db
      .insert(transactions)
      .values(transaction)
      .returning();
    return newTransaction;
  }
}

export const storage = new DatabaseStorage();
