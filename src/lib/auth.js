import { createClient } from "nhost-js-sdk";

const config = {
  baseURL: "https://cappb.terranea.de",
};

const { auth, storage } = createClient(config);

export { auth, storage };