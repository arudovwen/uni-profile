export default function(fileUrl, fileName) {
 
    fetch(fileUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.blob();
      })
      .then((blob) => {
        // Create a link element
        const link = document.createElement("a");
  
        // Create a Blob URL for the file data
        const blobUrl = window.URL.createObjectURL(blob);
  
        // Set the link's href attribute to the Blob URL
        link.href = blobUrl;
  
        // Set the download attribute with the desired file name
        link.download = fileName || "downloaded_file"; // Change the file name as needed
  
        // Append the link to the document
        document.body.appendChild(link);
  
        // Trigger a click on the link to start the download
        link.click();
  
        // Remove the link from the document
        document.body.removeChild(link);
  
        // Revoke the Blob URL to free up resources
        window.URL.revokeObjectURL(blobUrl);
      })
      .catch((error) => {
        console.error("Error downloading file:", error);
      });
  }