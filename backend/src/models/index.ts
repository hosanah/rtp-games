import { Sequelize } from 'sequelize';
import '../loadEnv';

const databaseUrl = process.env.DATABASE_URL || '';

export const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  logging: false,
});

export default sequelize;
