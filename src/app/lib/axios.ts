import axios from "axios";

export const api = axios.create({
  baseURL: "https://672f062d229a881691f19ad9.mockapi.io/api",
  timeout: 10000,
});
