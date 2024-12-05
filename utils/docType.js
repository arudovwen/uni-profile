export function docType(value) {
  if (!value) return;
  const temp = value.split(".").pop();
  return temp;
}
