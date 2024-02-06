import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import dotenv from 'dotenv';

dotenv.config();

const ormconfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  autoLoadEntities: true,
  migrations: [__dirname + '/src/migrations/*.ts'],
  charset: 'utf8mb4',
  logging: process.env.NODE_ENV !== 'production',
  keepConnectionAlive: true,
  // synchronize: true,
};

export default ormconfig;
