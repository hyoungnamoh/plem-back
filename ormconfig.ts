import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import dotenv from 'dotenv';
import { Plans } from 'src/entities/Plans';
import { PlanCharts } from 'src/entities/PlanCharts';
import { SubPlans } from 'src/entities/SubPlans';
import { Users } from 'src/entities/Users';

dotenv.config();

const ormconfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [Users, PlanCharts, Plans, SubPlans],
  migrations: [__dirname + '/src/migrations/*.ts'],
  // cli: { migrationsDir: 'src/migrations' },
  charset: 'utf8mb4',
  logging: process.env.NODE_ENV !== 'production',
  keepConnectionAlive: true,
};

export = ormconfig;
