declare namespace NodeJS {
  interface Global {
    mongoose: {
      conn: import("mongoose").Mongoose | null;
      promise: Promise<import("mongoose").Mongoose> | null;
    };
  }
}
