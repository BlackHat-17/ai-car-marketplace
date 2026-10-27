import { PrismaClient } from "@prisma/client";
import { v5 as uuidv5 } from "uuid";

const prisma = new PrismaClient();
const idNamespace = "15a2b822-943f-4bb3-9766-2a013b7e189d";
const imageDirectory = "/cars/demo-kaggle";
const colors = ["White", "Black", "Silver", "Blue", "Red"];
const demoClasses = [
  {
    slug: "audi",
    label: "Audi",
    make: "Audi",
    modelPrefix: "Demo Sample",
    count: 5,
    bodyType: "Sedan",
    seats: 5,
    basePrice: 38000,
  },
  {
    slug: "hyundai-creta",
    label: "Hyundai Creta",
    make: "Hyundai",
    modelPrefix: "Creta Demo",
    count: 5,
    bodyType: "SUV",
    seats: 5,
    basePrice: 26000,
  },
  {
    slug: "mahindra-scorpio",
    label: "Mahindra Scorpio",
    make: "Mahindra",
    modelPrefix: "Scorpio Demo",
    count: 4,
    bodyType: "SUV",
    seats: 7,
    basePrice: 29000,
  },
  {
    slug: "rolls-royce",
    label: "Rolls Royce",
    make: "Rolls Royce",
    modelPrefix: "Demo Sample",
    count: 4,
    bodyType: "Sedan",
    seats: 5,
    basePrice: 185000,
  },
  {
    slug: "swift",
    label: "Swift",
    make: "Maruti Suzuki",
    modelPrefix: "Swift Demo",
    count: 4,
    bodyType: "Hatchback",
    seats: 5,
    basePrice: 18000,
  },
  {
    slug: "tata-safari",
    label: "Tata Safari",
    make: "Tata",
    modelPrefix: "Safari Demo",
    count: 4,
    bodyType: "SUV",
    seats: 7,
    basePrice: 32000,
  },
  {
    slug: "toyota-innova",
    label: "Toyota Innova",
    make: "Toyota",
    modelPrefix: "Innova Demo",
    count: 4,
    bodyType: "SUV",
    seats: 7,
    basePrice: 34000,
  },
];

const cars = demoClasses.flatMap((carClass, classIndex) =>
  Array.from({ length: carClass.count }, (_, index) => {
    const number = index + 1;
    const suffix = String(number).padStart(2, "0");

    return {
      id: uuidv5(`kaggle-demo:${carClass.slug}:${number}`, idNamespace),
      make: carClass.make,
      model: `${carClass.modelPrefix} ${suffix}`,
      year: 2017 + ((classIndex + index) % 8),
      price: carClass.basePrice + index * 875,
      mileage: 12000 + ((index * 1875 + classIndex * 950) % 85000),
      color: colors[(classIndex + index) % colors.length],
      fuelType: (classIndex + index) % 2 === 0 ? "Petrol" : "Diesel",
      transmission:
        (classIndex + index) % 2 === 0 ? "Automatic" : "Manual",
      bodyType: carClass.bodyType,
      seats: carClass.seats,
      description:
        `DEMO DATA ONLY. Year, price, mileage, specifications, and availability are illustrative and unverified; this is not an actual vehicle offer. Image class: ${carClass.label}. Image source and license: see public/cars/demo-kaggle/ATTRIBUTION.txt.`,
      status: "AVAILABLE",
      featured: classIndex === 0 && index < 2,
      images: [`${imageDirectory}/${carClass.slug}-${suffix}.jpg`],
    };
  })
);

try {
  const before = await prisma.car.count();

  await prisma.$transaction(
    cars.map((car) =>
      prisma.car.upsert({
        where: { id: car.id },
        create: car,
        update: car,
      })
    )
  );

  const after = await prisma.car.count();
  console.log(
    `Upserted ${cars.length} demo listings. Car count: ${before} -> ${after}.`
  );
} catch (error) {
  console.error("Failed to import Kaggle demo car listings:", error);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
