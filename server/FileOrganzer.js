// import path from "path";
// import fs from "fs/promises";
// import { existsSync } from "node:fs";


// export class FileOrganizer {
//   constructor(dirPath) {
//     this.baseDir = "/Users/user"
//     this.dirPath = path.join(this.baseDir, dirPath);
//     this.OriginalStateFolder = [];
//     this.OrganizedStateFolder = []
    
//   }

//   // return an Annay OrganizedFolder List
//   getOrganizedStateFolder() {
//     return this.OrganizedStateFolder
//   }
//   //Return an array of OriginalState of the Folder
//    getOrginalStateFolder() {
//     return this.OriginalStateFolder
//   }

//   // Read all files in a folder
//   async organizerFolder() {
//     try {
//       // Check if dirPath itself is valid and a directory


//       const rootStats = await fs.stat(this.dirPath);
//       if (rootStats.isFile()) {
//         console.error("❌ Your dirPath points to a file, not a folder.");
//         return;
//       }

//       const Orginalitems = await fs.readdir(this.dirPath);
//       this.OriginalStateFolder.push({data : Orginalitems, length : Orginalitems.length})
        
      
//         await this.#processFiles(Orginalitems)
//     } catch (error) {
//       console.error("❌ Something went wrong:", error.message);
//     }

//     // We get to read the Folder again to get all the Items 
//     const Organizeditems = await fs.readdir(this.dirPath);
//     this.OrganizedStateFolder.push({data : Organizeditems, length : Organizeditems.length})
//     let count = Organizeditems.length
//     console.log(`The Count of the Organized Foler is ${count}`)
//     console.table(this.getOrganizedStateFolder())



//     const response = {
//       folder:  {
//          OrginalStateFolder :{
//          data : this.OriginalStateFolder[0].data,
//          length : this.OriginalStateFolder[0].length,
//       },

//       OrganizedStateFolder : {
//         data : this.OrganizedStateFolder[0].data,
//         length : this.OrganizedStateFolder[0].length,
//       }
        
//       }
//     }
    
//     return response;
//   }

//   // Moves files
//   async #moveFile(src, dest) {
//     try {
//       await fs.rename(src, dest);
//       console.log(`✅ Moved: ${path.basename(src)} → ${path.dirname(dest)}`);
//     } catch (err) {
//       console.error(`❌ Error moving ${src}:`, err.message);
//     }
//   }

//   // Checks if directory exists
//    #checkFolderExist(dir) {
//     let folder = path.join(this.dirPath, dir);
//     return existsSync(folder);
//   }

//   async getDirectoryFiles(){
//           const items = await fs.readdir(this.dirPath);
//           return{
//              items : items,
//              count : items.length
//           }
//   }


//   async #processFiles(files){
//     for (let i = 0; i < files.length; i++) {
//         const itemPath = path.join(this.dirPath, files[i]);
//         const stats = await fs.stat(itemPath);

//         if (stats.isFile()) {
//           // Get extension
//           const extname = path.extname(files[i]).slice(1);
//           if (!extname) continue; // skip files with no extension

//           const filename = path.basename(files[i]);
//           const folderToCreate = path.join(this.dirPath, extname);

//           // Create folder if it doesn’t exist
//           if (!this.#checkFolderExist(extname)) {
//             // console.log(`📂 Creating folder: ${folderToCreate}`);
//             await fs.mkdir(folderToCreate, { recursive: true });
//           }

//           // Move file into folder
//           const src = itemPath;
//           const dest = path.join(folderToCreate, filename);
//           await this.#moveFile(src, dest);
//         } else {
//           // If it's already a directory, skip it
//           console.log(`ℹ️ Skipping directory: ${files[i]}`);
//         }
//       }

//   }

  
// }

import path from "path";
import fs from "fs/promises";
import { existsSync } from "node:fs";

export class FileOrganizer {
  /**
   * @param {string} dirName Name of the folder to organize (relative to base)
   */
  constructor(dirName) {
    // Use a safe project-relative folder (can be overridden by ENV)
    this.baseDir = process.env.BASE_DIR || path.resolve("./uploads");
    this.dirPath = path.join(this.baseDir, dirName);

    // Ensure folder exists
    fs.mkdir(this.dirPath, { recursive: true }).catch(err => console.error(err));

    this.originalState = [];
    this.organizedState = [];
  }

  /** Get the folder before organization */
  getOriginalState() {
    return this.originalState;
  }

  /** Get the folder after organization */
  getOrganizedState() {
    return this.organizedState;
  }

  /** Main function to organize files */
  async organizeFolder() {
    try {
       await fs.mkdir(this.dirPath, { recursive: true });
      const stats = await fs.stat(this.dirPath);
      if (stats.isFile()) throw new Error("The path points to a file, not a folder.");

      // Snapshot before organization
      const originalItems = await fs.readdir(this.dirPath);
      this.originalState = { data: originalItems, length: originalItems.length };

      // Organize files
      await this.#processFiles(originalItems);

      // Snapshot after organization
      const organizedItems = await fs.readdir(this.dirPath);
      this.organizedState = { data: organizedItems, length: organizedItems.length };

      return {
        folder: {
          original: this.originalState,
          organized: this.organizedState,
        },
      };
    } catch (err) {
      console.error("❌ Error organizing folder:", err.message);
      return { error: err.message };
    }
  }

  /** Private method to move files */
  async #moveFile(src, dest) {
    try {
      await fs.rename(src, dest);
      console.log(`📦 Moved: ${path.basename(src)} → ${path.dirname(dest)}`);
    } catch (err) {
      console.error(`❌ Error moving file "${src}":`, err.message);
    }
  }

  /** Private method: process files */
  async #processFiles(files) {
    for (const file of files) {
      const filePath = path.join(this.dirPath, file);
      const stats = await fs.stat(filePath);

      if (stats.isDirectory()) continue; // Skip directories

      const ext = path.extname(file).slice(1);
      if (!ext) continue; // Skip files without extensions

      const targetFolder = path.join(this.dirPath, ext);
      if (!existsSync(targetFolder)) await fs.mkdir(targetFolder, { recursive: true });

      const destination = path.join(targetFolder, file);
      await this.#moveFile(filePath, destination);
    }
  }
}