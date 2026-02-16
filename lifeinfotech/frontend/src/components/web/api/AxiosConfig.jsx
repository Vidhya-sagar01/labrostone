import axios from "axios";

const baseURL = "https://lebrostonebackend.lifeinfotechinstitute.com";

const instance = axios.create({
  baseURL,
  withCredentials: true,
});

export default instance;
