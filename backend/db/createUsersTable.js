import sqlite3 from "sqlite3";
import { open } from "sqlite";
import express from "express";
import { getDBConnection } from "./getBDConnection.js";

export async function createUsersTable() {
  const db = await getDBConnection();

  try {
    await db.exec(`CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT ,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL ,
    currency TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ); `);
    console.log("Table created successfully🎉");
  } catch (err) {
    console.error("Error ocurred while creating Db Table : ", err.message);
  } finally {
    await db.close();
    console.log("DB connection closed");
  }
}
createUsersTable();
