import { toast } from "vue3-toastify";

export function copyItem(value) {
  // Use navigator.clipboard.writeText to copy the text
  navigator.clipboard
    .writeText(value)
    .then(() => {
      // Show a toast notification when the copy is successful
      toast.info("Copied!");
    })
    .catch((err) => {
      // Handle any errors that occur during the copy process
      toast.error("Failed to copy!");
      console.error("Copy failed", err);
    });
}
