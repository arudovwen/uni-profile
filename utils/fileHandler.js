export default function fileHandler(e, expertAnswer) {
  const file = e.target.files[0];
  // Encode the file using the FileReader API
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = () => {
    // Use a regex to remove data url part
    const base64String = reader.result;

    uploadfile({
      base64: base64String.replace("data:", "").replace(/^.+,/, ""),
    }).then((res) => {
      expertAnswer.photo = res.data.message;
    });
  };
}