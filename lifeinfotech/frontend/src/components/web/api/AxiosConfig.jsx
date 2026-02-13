import axios from "axios";

const instance = axios.create({
  baseURL: "https://lebrostonebackend.lifeinfotechinstitute.com",
  withCredentials: true,
});

export default instance;
