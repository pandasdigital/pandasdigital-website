import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";
import bcrypt from "bcryptjs";

async function createAdmin() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  });

  const prisma = new PrismaClient({ adapter });

  try {
    // Delete existing user first if any
    await prisma.user.deleteMany({
      where: { email: "admin@pandasdigital.lk" },
    });
    console.log("🗑️ Cleared old user");

    // Create fresh
    const password = await bcrypt.hash("pandas2024", 10);
    const user = await prisma.user.create({
      data: {
        name: "Randiv Costa",
        email: "admin@pandasdigital.lk",
        password: password,
        role: "admin",
      },
    });

    console.log("✅ User created successfully!");
    console.log("📧 Email:", user.email);
    console.log("🔑 Password: pandas2024");
    console.log("🔒 Hash stored:", user.password.substring(0, 20) + "...");

    // Verify it works
    const found = await prisma.user.findUnique({
      where: { email: "admin@pandasdigital.lk" },
    });
    const isValid = await bcrypt.compare("pandas2024", found!.password);
    console.log(
      "✅ Password verification test:",
      isValid ? "PASSED" : "FAILED",
    );
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();

// ✅ User created successfully!
// 📧 Email: admin@pandasdigital.lk
// 🔑 Password: pandas2024
// ✅ Password verification test: PASSED
