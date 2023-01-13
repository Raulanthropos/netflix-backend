import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs-extra";

const { readJSON, writeJSON } = fs;

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data");
const mediaJSONPath = join(dataFolderPath, "medias.json");

export const getMedia = () => readJSON(mediaJSONPath);

export const writeMedia = (mediaArray) => {
  writeJSON(mediaJSONPath, mediaArray);
};