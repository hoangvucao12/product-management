const express = require("express");
const route = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");
const dotenv = require("dotenv");
const database = require("./config/database");
const systemConfig = require("./config/system");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");
// const serverless = require("serverless-http");

dotenv.config();

database.connect();

const app = express();
const port = process.env.PORT;

app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

app.use(bodyParser.urlencoded({ extended: false }));

// Flash
app.use(cookieParser("keyboard cat"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());
// End Flash

app.use(express.static(`${__dirname}/public`));
app.use(methodOverride("_method"));

route(app);
routeAdmin(app);

app.listen(port, () => {
  console.log(`Server chay o ${port}`);
});

// if (process.env.NODE_ENV !== "production") {
//   const port = process.env.PORT || 3000;
//   app.listen(port, () => {
//     console.log(`App chạy ở localhost tại port ${port}`);
//   });
// }

// module.exports = serverless(app);
