import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.project.upsert({
    where: { slug: "e2e-test-project" },
    update: {},
    create: {
      slug: "e2e-test-project",
      title: "E2E Test Project",
      brief: "A seeded project used by the Playwright test suite.",
      // Intentionally broken image URLs: these exercise the onError
      // fallback path in ProjectCard / the project carousel.
      thumbnail: "https://res.cloudinary.com/dsc2xiudm/image/upload/e2e-missing-thumb.jpg",
      images: [
        "https://res.cloudinary.com/dsc2xiudm/image/upload/e2e-missing-1.jpg",
        "https://res.cloudinary.com/dsc2xiudm/image/upload/e2e-missing-2.jpg",
      ],
      stack: ["TypeScript", "Next.js"],
      category: ["Web"],
      overview: "Seeded for end-to-end tests.",
      features: ["Feature A", "Feature B"],
      status: "Completed",
      startDate: new Date("2024-01-01"),
      featured: true,
      isEnabled: true,
    },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
