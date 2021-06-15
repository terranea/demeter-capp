import { createClient } from "nhost-js-sdk";

const config = {
  baseURL: "http://localhost:3001",
};

const { auth, storage } = createClient(config);

export { auth, storage };