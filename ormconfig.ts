import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import dotenv from 'dotenv';
import { Plan } from 'src/entities/Plan';
import { PlanChart } from 'src/entities/PlanChart';
import { SubPlan } from 'src/entities/SubPlan';
import { User } from 'src/entities/User';

dotenv.config();

const ormconfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User, PlanChart, Plan, SubPlan],
  migrations: [__dirname + '/src/migrations/*.ts'],
  // cli: { migrationsDir: 'src/migrations' },
  charset: 'utf8mb4',
  logging: process.env.NODE_ENV !== 'production',
  keepConnectionAlive: true,
};

export = ormconfig;
