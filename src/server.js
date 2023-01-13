import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import {
  badRequestHandler,
  genericServerErrorHandler,
  notFoundHandler,
  unauthorizedHandler,
} from "./errorHandlers.js";
import mediaRouter from "./api/media/index.js";
import infoRouter from "./api/info/index.js";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from 'dotenv'
dotenv.config()
const server = express();
const port = process.env.PORT;
const publicFolderPath = join(process.cwd(), "./public");

const whitelist = [process.env.FE_DEV_URL, process.env.FE_PROD_URL];

const corsOpts = {
  origin: (origin, corsNext) => {
    console.log("Current origin: " + origin);
    if (!origin || whitelist.indexOf(origin) !== -1) {
      corsNext(null, true);
    } else {
      corsNext(createHttpError(400, `Origin ${origin} is not allowed`));
    }
  },
};

server.use(cors(corsOpts));
server.use(express.json());
server.use(express.static(publicFolderPath));
server.use("/medias", mediaRouter);
server.use("/info", infoRouter);
server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(notFoundHandler);
server.use(genericServerErrorHandler);

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log("Server is up and running on port " + port);
});