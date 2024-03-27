import { Server } from "http";
import app from "./app";

const PORT = 3000;

async function main() {
  const server: Server = app.listen(PORT, () => {
    console.log(`SERVER is running on ${PORT}`);
  });
}

main();
