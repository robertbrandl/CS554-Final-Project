import {dbConnection, closeConnection} from './config/mongoConnection.js';
import users from './data/users.js';

async function seedDatabase() {
  const db = await dbConnection();
  await db.dropDatabase();

  try {
    let user1 = await users.registerUser("Robert Brandl", "robert1@email.com", true, "email");
    let user2 = await users.registerUser("Krystal Hong", "krystal@email.com", true, "email");
    let user3 = await users.registerUser("Rivaldo D Silva", "rivaldo@email.com", false, "email");
    let user4 = await users.registerUser("Linette Santana Encarnacion", "linette@email.com", false, "email");
    let user5 = await users.registerUser("Areeb Chaudhry", "areeb@email.com", true, "email");

    console.log('Done seeding database');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await closeConnection();
  }
}

seedDatabase();