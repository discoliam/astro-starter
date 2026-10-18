export const slugify = (text) => {
  return text
    .toString()
    .normalize("NFD") // Split accented characters into their base letters
    .replace(/[\u0300-\u036f]/g, "") // Remove the accents
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars (except -)
    .replace(/--+/g, "-"); // Replace multiple - with single -
};

export const cleanName = (text) => {
  return text
    .replace(/\.[^/.]+$/, "")
    .replace(/^[a-zA-Z0-9]+[\s\.\-_]+/, "")
    .replace(/[\-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

export const formatBytes = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};