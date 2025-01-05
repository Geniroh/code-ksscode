// import express, { Request, Response } from "express";
// import multer from "multer";
// import { google } from "googleapis";
// import fs from "fs";

// // Initialize Express app
// const app = express();
// const upload = multer({ dest: "uploads/" }); // Temporary storage for files

// // Google OAuth2 Client setup
// const auth = new google.auth.GoogleAuth({
//   keyFile: "path-to-your-credentials.json", // Replace with your credentials file
//   scopes: ["https://www.googleapis.com/auth/drive.file"],
// });

// const drive = google.drive({ version: "v3", auth });

// // Upload file to Google Drive
// const uploadToGoogleDrive = async (filePath: string, fileName: string) => {
//   const fileMetadata = {
//     name: fileName, // Name of the file in Google Drive
//   };

//   const media = {
//     mimeType: "application/octet-stream",
//     body: fs.createReadStream(filePath),
//   };

//   const response = await drive.files.create({
//     requestBody: fileMetadata,
//     media: media,
//     fields: "id",
//   });

//   return response.data;
// };

// // API Route
// app.post(
//   "/upload",
//   upload.single("file"),
//   async (req: Request, res: Response) => {
//     try {
//       if (!req.file) {
//         return res.status(400).json({ error: "No file uploaded" });
//       }

//       const filePath = req.file.path; // Path to the uploaded file
//       const fileName = req.file.originalname; // Original file name

//       const driveResponse = await uploadToGoogleDrive(filePath, fileName);

//       // Cleanup: Delete the file from the server after upload
//       fs.unlinkSync(filePath);

//       res.status(200).json({
//         message: "File uploaded successfully",
//         fileId: driveResponse.id,
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: "Failed to upload file to Google Drive" });
//     }
//   }
// );

// // Start server
// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });
