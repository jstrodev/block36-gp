const prisma = require("../prisma");
const { faker } = require("@faker-js/faker");

const seed = async (numRestaurants = 3, numReservations = 5) => {
  try {
    // Create restaurants with nested reservations
    for (let i = 0; i < numRestaurants; i++) {
      // Generate reservations array using faker
      const reservations = Array.from({ length: numReservations }, (_, j) => {
        const name = faker.internet.displayName();
        return {
          name,
          email: `${name}@foo.bar`,
          partySize: faker.number.int({ min: 1, max: 10 }),
          time: new Date(),
        };
      });

      // Create restaurant with nested reservations
      await prisma.restaurant.create({
        data: {
          name: faker.company.buzzAdjective() + " " + faker.company.buzzNoun(),
          address: faker.location.streetAddress(),
          reservations: {
            create: reservations,
          },
        },
      });
    }

    await prisma.$disconnect();
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }
};

seed();
