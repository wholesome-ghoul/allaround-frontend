let SERVER = process.env.SERVER;

// set by webpack
if (process.env.NODE_ENV === "development") {
  SERVER = "http://localhost:4000";
}

export default {
  SERVER,
};
