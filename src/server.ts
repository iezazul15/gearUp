import app from "./app";
import config from "./config";
import { prisma } from "./lib/prisma";

async function main() {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");
    app.listen(config.port, () => {
      console.log(`Server listening on PORT ${config.port}`);
    });
  } catch (error) {
    console.error("Error starting the server", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
