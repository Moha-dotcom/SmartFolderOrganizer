
##Work in Progress

- Add Apis for  Processing payment

`export async function sendDir(value) {
    console.log(value)
  try {
    const response = await fetch("/api/organize", {  // <-- matches backend
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dirPath: value })  // proper JSON
    });


  



    if (!response.ok) throw new Error("Network response was not ok");

    const result = await response.json();
  
  //   console.log(data)
    let {OrginalStateFolder, OrganizedStateFolder} = result.folder
  //   const joinedOrginalStateData = OrginalStateFolder.data.join(", ") 
  //  const joinedOrganizedData = OrganizedStateFolder.data.join(", ") 

    const beforeFolderContentDiv = document.querySelector('#beforeFolderContent');
    const afterFolderContentDiv = document.querySelector('#afterFolderContent');
    
    beforeFolderContentDiv.innerHTML = OrginalStateFolder.data.map(item => `<p class="file-list-item">${item}</p>`).join('');
  afterFolderContentDiv.innerHTML = OrganizedStateFolder.data.map(item => `<p class="file-list-item">${item}</p>`).join('');
    // Optional: show before/after content in the DOM
    const beforeDiv = document.getElementById('beforeFolderContent');
    const afterDiv = document.getElementById('afterFolderContent');

    // beforeDiv.textContent = `Before: ${joinedOrginalStateData}`;
    // afterDiv.textContent = `After : ${joinedOrganizedData}`;


     document.getElementById('beforeItemsCount').textContent = OrginalStateFolder.length;
     document.getElementById('statBeforeItems').textContent = OrginalStateFolder.length;


     document.getElementById('afterItemsCount').textContent = OrganizedStateFolder.length;
       document.getElementById('statAfterItems').textContent =  OrganizedStateFolder.length;;
  } catch (error) {
    console.error("❌ Fetch error:", error);
  }
}


`