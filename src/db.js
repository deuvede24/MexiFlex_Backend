/*import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();
console.log("JWT_SECRET:", process.env.JWT_SECRET);

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.USER_NAME,
  process.env.PASSWORD,
  {
    host: process.env.HOST_NAME,
    dialect: "mysql",
  }
);

const syncroModel = async () => {
  try {
    // Sincronizar el modelo con la base de datos (crear la tabla si no existe)
    // Con "alter: true" se sincronizan las columnas y se crean/eliminan si fuera necesario

    console.log(sequelize.models);
    console.log("Modelos registrados:", Object.keys(sequelize.models));
    
    await sequelize.sync({ alter: true }).then(() => {
      console.log("Modelos sincronizado con la base de datos");
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

const testConnection = async () => {
  try {
    await
    sequelize.authenticate();
    console.log("Connection has been established successfully.");
    await syncroModel();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export { sequelize, testConnection };*/

/*import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.NODE_ENV === 'production' ? process.env.MYSQL_DATABASE : 'mexi_flex',
  process.env.NODE_ENV === 'production' ? process.env.MYSQL_USER : 'root',
  process.env.NODE_ENV === 'production' ? process.env.MYSQL_PASSWORD : '',
  {
    host: process.env.NODE_ENV === 'production' ? process.env.MYSQL_HOST : 'localhost',
    dialect: "mysql",
    port: process.env.NODE_ENV === 'production' ? process.env.MYSQL_PORT : 3306,
    logging: process.env.NODE_ENV === 'development'
  }
);
console.log("Conectando a la base de datos con:");
console.log("Host:", process.env.MYSQL_HOST);
console.log("Base de datos:", process.env.MYSQL_DATABASE);
console.log("Usuario:", process.env.MYSQL_USER);
console.log("Puerto:", process.env.MYSQL_PORT);


const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');
    await sequelize.sync();
    console.log("Database synchronized");
  } catch (error) {
    console.error("Connection error:", error);
    throw error;
  }
};

export { sequelize, testConnection };*/

import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = process.env.NODE_ENV === 'production' 
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: "mysql",
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      },
      logging: false
    })
  : new Sequelize(
      'mexi_flex',
      'root',
      '',
      {
        host: 'localhost',
        dialect: "mysql",
        port: 3306,
        logging: true
      }
    );

console.log("Conectando a la base de datos con:");
console.log("Entorno:", process.env.NODE_ENV);
if (process.env.NODE_ENV === 'production') {
  console.log("URL de conexión: (usando DATABASE_URL)");
} else {
  console.log("Host: localhost");
  console.log("Base de datos: mexi_flex");
  console.log("Usuario: root");
  console.log("Puerto: 3306");
}

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');
    await sequelize.sync();
    console.log("Database synchronized");
  } catch (error) {
    console.error("Connection error:", error);
    throw error;
  }
};

export { sequelize, testConnection };