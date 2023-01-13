import createHttpError from "http-errors";
import { getMedia } from "./fs-tools.js";

export const selectMedia = async (id, next) => {
  const mediaArray = await getMedia();

  const requestedMediaIndex = mediaArray.findIndex(media => media.imdbID === id);

  if (requestedMediaIndex === -1) {
    next(createHttpError(404, `Media with id ${id} not found`));
  } else {
    console.log("media found")
    return mediaArray[requestedMediaIndex];
  }
};

export const getMediaAndUpdate = async (newData, id, next) => {
  const mediaArray = await getMedia();

  const requestedMediaIndex = mediaArray.findIndex((media) => media.imdbID === id);

  if (requestedMediaIndex === -1) {
    next(createHttpError(404, `Media with id ${id} not found`));
  } else {

    console.log("media found")
    const oldMedia = mediaArray[requestedMediaIndex];

    const editedMedia = {
      ...oldMedia,
      ...newData,
      updatedAt: new Date(),
    };

    const editedMediaArray = mediaArray;

    editedMediaArray[requestedMediaIndex] = editedMedia;

    return editedMediaArray;
  }
};