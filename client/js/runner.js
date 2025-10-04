//    document.getElementById('arrangeButton').addEventListener('click', () => {
//             const folderPath = document.getElementById('folderPath').value;
//             const beforeFolderContentDiv = document.querySelector('#beforeFolderContent');
//             const afterFolderContentDiv = document.querySelector('#afterFolderContent');

       

           


//             if (!folderPath) {
//                 alert('Please enter a folder path!');
//                 return;
//             }else{
//                 sendDir(folderPath)
//             }

   

//                  sendDir(folderPath)

//         });




// async function sendDir(value) {
//   try {
//     const response = await fetch("/app/organize", { // make sure this matches your backend route
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ dirPath: value }) // <-- proper JSON object
//     });

//     if (!response.ok) throw new Error("Network response was not ok");

//     const data = await response.json();
//     console.log("Response from server:", data);
//   } catch (error) {
//     console.error("❌ Fetch error:", error);
//   }
// }


// /* */

import {sendDir} from "./app.js"

console.log("-----------------")


document.getElementById('arrangeButton').addEventListener('click', () => {
    const folderPath = document.getElementById('folderPath').value;

    if (!folderPath) {
        alert('Please enter a folder path!');
        return;
    }

    sendDir(folderPath)


});

