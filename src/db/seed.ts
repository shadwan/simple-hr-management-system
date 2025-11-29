import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { users } from "./schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL || "postgresql://hruser:hrpassword@localhost:5432/hrdb";

async function seed() {
  console.log("Starting seed...");
  
  const client = postgres(connectionString);
  const db = drizzle(client);

  // Default admin credentials
  const adminUsername = process.env.ADMIN_USERNAME || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  try {
    // Check if admin user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.username, adminUsername))
      .limit(1);

    if (existingUser.length > 0) {
      console.log(`Admin user "${adminUsername}" already exists. Skipping seed.`);
    } else {
      // Hash the password
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      // Create admin user
      await db.insert(users).values({
        username: adminUsername,
        password: hashedPassword,
      });

      console.log(`Admin user created successfully!`);
      console.log(`Username: ${adminUsername}`);
      console.log(`Password: ${adminPassword}`);
      console.log("\n*** IMPORTANT: Change the default password in production! ***\n");
    }
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }

  await client.end();
  console.log("Seed completed!");
  process.exit(0);
}

seed();
