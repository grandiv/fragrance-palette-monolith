import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.formula.deleteMany({});
  await prisma.fragranceFamily.deleteMany({});

  // Create fragrance families
  const citrus = await prisma.fragranceFamily.create({
    data: {
      name: "Citrus",
      description: "Fresh, zesty scents with bright, uplifting qualities.",
      ingredients: ["Bergamot", "Lemon", "Orange", "Lime", "Grapefruit"],
    },
  });

  const floral = await prisma.fragranceFamily.create({
    data: {
      name: "Floral",
      description: "The aroma of flowers, ranging from delicate to heady.",
      ingredients: ["Rose", "Jasmine", "Lavender", "Ylang-Ylang", "Geranium"],
    },
  });

  const woody = await prisma.fragranceFamily.create({
    data: {
      name: "Woody",
      description: "Warm, rich aromas reminiscent of forests and timber.",
      ingredients: ["Sandalwood", "Cedar", "Patchouli", "Pine", "Vetiver"],
    },
  });

  const oriental = await prisma.fragranceFamily.create({
    data: {
      name: "Oriental",
      description:
        "Rich, sweet, and warm scents, often with vanilla and spices.",
      ingredients: ["Vanilla", "Amber", "Musk", "Cinnamon", "Cardamom"],
    },
  });

  const fresh = await prisma.fragranceFamily.create({
    data: {
      name: "Fresh",
      description:
        "Clean, aquatic, and green scents that evoke nature and air.",
      ingredients: [
        "Ocean Accord",
        "Green Tea",
        "Fresh Cut Grass",
        "Cucumber",
        "Mint",
      ],
    },
  });

  console.log({ citrus, floral, woody, oriental, fresh });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
