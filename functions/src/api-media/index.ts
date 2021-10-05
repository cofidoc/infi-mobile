import * as functions from "firebase-functions";
import express from "express";
import cors from "cors";
import { getConfig } from "../config";
import { Storage } from "@google-cloud/storage";

type Query = {
  crop: string;
  width: string;
};

const gm = require("gm").subClass({ imageMagick: true });

const quality = 90;
const app = express();

app.use(cors());

app.get("*", async (request: express.Request, response: express.Response) => {
  try {
    const path = request.params?.[0];
    const { width, cropwidth, cropheight, cx, cy } = getCrop(request.query as Query);

    console.log({ path, width, cropwidth, cropheight, cx, cy });

    const storage = new Storage();
    const bucket = storage.bucket(getConfig()?.project?.storagebucket);
    const file = bucket.file(path);
    const stream = file.createReadStream();

    stream.on("error", function (err) {
      response.sendStatus(500).end(err);
    });

    response.set("Cache-Control", "public, max-age=31536000000, s-maxage=31536000000");

    gm(stream).crop(cropwidth, cropheight, cx, cy).resize(width).quality(quality).stream().pipe(response);
  } catch (e) {
    console.error("error", e);
    response.sendStatus(500).end(e);
  }
});

function getCrop(query: Query) {
  if (!query.crop && !query?.width) {
    console.log("no query");
    return { width: 395, cropwidth: 0, cropheight: 0, cx: 0, cy: 0 };
  }

  // ?crop=750,750,x50,y50&width=300
  const crop = query?.crop as string;
  const width = query?.width;
  const [cropwidth = 0, cropheight = 0, x, y] = crop?.split(",");
  const cx = x.split("x")?.[1] || 0;
  const cy = y.split("y")?.[1] || 0;

  return { width, cropwidth, cropheight, cx, cy };
}

const runtimeOpts: any = {
  timeoutSeconds: 500,
  memory: "2GB",
  nodejs: 10,
};

export const apiMedia = functions.runWith(runtimeOpts).region("us-central1").https.onRequest(app);
