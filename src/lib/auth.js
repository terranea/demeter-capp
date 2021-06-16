import { createClient } from "nhost-js-sdk";

const config = {
  baseURL: "http://192.168.178.21:3001",
};

const { auth, storage } = createClient(config);

export { auth, storage };