import express from "express";
import { getMedia, writeMedia } from "../../lib/fs-tools.js";
import { getMediaAndUpdate, selectMedia } from "../../lib/media-tools.js";
import uniqid from "uniqid";
import multer from "multer";
import { dirname, extname, join } from "path";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import { createMediaPdf } from "../../lib/pdf-tools.js";
import { pipeline } from "stream";

const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "",
      public_id: (req, file) => req.params.mediaId,
    },
  }),
}).single("poster");

const mediaRouter = express.Router();

// Get all media

mediaRouter.get("/", async (req, res, next) => {
  try {
    const mediaArray = await getMedia();
    res.status(200).send(mediaArray);
  } catch (error) {
    next(error);
  }
});

// Get single media

mediaRouter.get("/:mediaId", async (req, res, next) => {
  try {
    const selectedMedia = await selectMedia(req.params.mediaId, next);
    res.status(200).send(selectedMedia);
  } catch (error) {
    next(error);
  }
});

// Post media entry

mediaRouter.post("/", async (req, res, next) => {
  try {
    const mediaArray = await getMedia();

    const newMedia = {
      ...req.body,
      createdAt: new Date(),
      imdbID: uniqid(),
    };
    mediaArray.push(newMedia);

    console.log(mediaArray)

    await writeMedia(mediaArray);

    res.status(201).send({
      message: "Media created",
      addedMedia: {
        ...newMedia,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Add poster to media entry

mediaRouter.post(
  "/:mediaId/poster",
  cloudinaryUploader,
  async (req, res, next) => {
    try {
      const fileName = req.params.mediaId + extname(req.file.originalname);
      cloudinary.url

      const cloudinaryURL =
        "" +
        fileName;

      const updatedArray = await getMediaAndUpdate(
        { poster: cloudinaryURL },
        req.params.mediaId,
        next
      );

      writeMedia(updatedArray);

      res.send({
        message: "Poster image added successfully",
        newPosterURL: cloudinaryURL,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Edit media entry

mediaRouter.put("/:mediaId", async (req, res, next) => {
  try {
    const editedArray = await getMediaAndUpdate(req.body, req.params.mediaId, next);

    writeMedia(editedArray);

    res.send({
      message: `Media entry ${req.params.mediaId} edited successfully`,
    });
  } catch (error) {
    next(error);
  }
});

// Delete media entry

mediaRouter.delete("/:mediaId", async (req, res, next) => {
  try {
    const mediaArray = await getMedia();

    const selectedMedia = await selectMedia(req.params.mediaId, next);

    const editedArray = mediaArray.filter(
      (media) => media.imdbID !== req.params.mediaId
    );

    await writeMedia(editedArray);

    res.status(204).send({
      message: `Media entry ${req.params.mediaId} deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
});

// Download media entry pdf

mediaRouter.get("/:mediaId/pdf", async (req, res, next) => {
  try {
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=media${req.params.mediaId}.pdf`
    );

    const source = await createMediaPdf(req.params.mediaId);
    const destination = res;

    pipeline(source, destination, (error) => {
      if (error) console.log(error);
    });
  } catch (error) {
    next(error);
  }
});

export default mediaRouter;