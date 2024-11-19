import "dotenv/config";
import connectDB from "./db/connect-database.js";
connectDB();

import express from "express";
const app = express();
