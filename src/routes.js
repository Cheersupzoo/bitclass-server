const glob = require("glob");
import { CommonRoutes } from "./routes/commonRoutes/commonRoutes";
import AuthRoutes from "./routes/authRoutes/AuthRoutes";

import { JWTService } from "./services/jwt";

module.exports = (app) => {
  var commonRoutes = new CommonRoutes();
  app.use("/", AuthRoutes);

  commonRoutes.route(app);
};
