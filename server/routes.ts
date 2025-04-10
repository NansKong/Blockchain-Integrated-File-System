import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import fs from "fs";
import path from "path";
import os from "os";
import { InsertFile, InsertTransaction } from "@shared/schema";
import { log } from "./vite";
import multer from "multer";
import { uploadFileToBlockchain, downloadFileFromBlockchain } from "./blockchain";

// Set up multer for file uploads
const upload = multer({ dest: os.tmpdir() });

export async function registerRoutes(app: Express): Promise<Server> {
  // API route to get all files
  app.get("/api/files", async (req, res) => {
    try {
      // Extract user_id from query parameters
      const userId = req.query.user_id as string;
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      // Fetch files from database
      const files = await storage.getFilesByUserId(userId);
      res.json(files);
    } catch (error) {
      console.error("Error fetching files:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to fetch files" 
      });
    }
  });

  // API route to get all transactions
  app.get("/api/transactions", async (req, res) => {
    try {
      // Extract user_id from query parameters
      const userId = req.query.user_id as string;
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      // Fetch transactions from database
      const transactions = await storage.getTransactionsByUserId(userId);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to fetch transactions" 
      });
    }
  });

  // Middleware to handle file uploads
  app.post("/upload", upload.single("file"), async (req, res) => {
    try {
      // Check if we have the required fields
      if (!req.file) {
        return res.status(400).json({ error: "No file provided" });
      }

      if (!req.body.user_id || !req.body.private_key) {
        return res.status(400).json({ error: "Missing user_id or private_key" });
      }

      // Read file content
      const fileBuffer = fs.readFileSync(req.file.path);
      
      // Upload to blockchain (our simulated implementation)
      const response = await uploadFileToBlockchain(
        fileBuffer,
        req.file.originalname,
        req.body.user_id,
        req.body.private_key
      );
      
      // Clean up temp file
      fs.unlinkSync(req.file.path);
      
      // Store file data in database
      const fileData: InsertFile = {
        hash: response.ipfs_hash,
        filename: req.file.originalname,
        size: req.file.size,
        type: req.file.mimetype || path.extname(req.file.originalname).slice(1) || 'unknown',
        version: 1,
        user_id: req.body.user_id,
        status: "verified",
        tx_hash: response.tx_hash
      };
      
      // Store transaction data in database
      const transactionData: InsertTransaction = {
        tx_hash: response.tx_hash,
        filename: req.file.originalname,
        size: req.file.size,
        version: 1,
        hash: response.ipfs_hash,
        user_id: req.body.user_id
      };
      
      // Save to database
      await storage.createFile(fileData);
      await storage.createTransaction(transactionData);
      
      // Return response to client
      res.json(response);
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Upload failed" 
      });
    }
  });

  // Proxy route for file download
  app.post("/download", async (req, res) => {
    try {
      // Extract file hash from request body
      const fileHash = req.body.file_hash;
      if (!fileHash) {
        return res.status(400).json({ error: "File hash is required" });
      }

      // Get file from database
      const file = await storage.getFileByHash(fileHash);
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }

      // Download file from blockchain (our simulated implementation)
      const result = await downloadFileFromBlockchain(
        fileHash,
        file.version,
        req.body.private_key
      );
      
      // Set response headers
      res.setHeader("Content-Type", result.mimetype);
      res.setHeader("Content-Disposition", `attachment; filename="${result.filename}"`);
      
      res.send(result.data);
    } catch (error) {
      console.error("Download error:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Download failed" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
