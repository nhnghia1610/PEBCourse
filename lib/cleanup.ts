import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanUpInconsistentCartItems() {
  await prisma.$executeRaw`
    DELETE FROM "CartItem" WHERE "courseId" NOT IN (SELECT "id" FROM "Course");
  `;
  console.log("Cleanup complete: Removed inconsistent cart items.");
}

cleanUpInconsistentCartItems()
  .catch((error) => {
    console.error("Error during cleanup:", error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
