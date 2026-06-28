import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const password = await bcrypt.hash("pandas2024", 10);

  const user = await prisma.user.upsert({
    where: { email: "admin@pandasdigital.lk" },
    update: { password },
    create: {
      name: "Randiv Costa",
      email: "admin@pandasdigital.lk",
      password,
      role: "admin",
    },
  });

  console.log("✅ Admin user created:", user.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

//   $2b$10$SzOA2qICa9LpBHGXvg5YPuxRbhtAumAE9tPGne3jCpNUOo5IxTUDq
