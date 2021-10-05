import * as functions from "firebase-functions";

export type Config = {
  project: {
    id: string;
    apikey: string;
    storagebucket: string;
  };
};

export let getConfig = () => functions.config() as Config;
