import connectDB from "./config/database";

const app = express();
connectDB();

app.set("port", process.env.PORT || 4200);

const port = app.get("port");

const server = app.listen(port, () =>
  console.log(`Server started on port ${port}`)
);

export default server;
