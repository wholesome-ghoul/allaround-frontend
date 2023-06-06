let SERVER = "http://localhost:4000";

// set by webpack
if (process.env.NODE_ENV === "production") {
  SERVER = process.env.SERVER || "";
}

export default {
  SERVER,
};
