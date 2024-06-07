import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { PlanCharts } from 'src/entities/PlanCharts';
import { Users } from 'src/entities/Users';
import { Plans } from 'src/entities/Plans';
import { SubPlans } from 'src/entities/SubPlans';
import { Schedules } from 'src/entities/Schedules';
import { Notices } from 'src/entities/Notices';
import { PushNotifications } from 'src/entities/PushNotifications';
import { Inquiries } from 'src/entities/Inquiries';
import { WithdrwalReasons } from './entities/WithdrwalReasons';
import { Holidays } from './entities/Holidays';
import { SubPlanHistories } from './entities/SubPlanHistories';
import { Goals } from './entities/Goals';
import { AllPlansAchievedHistories } from './entities/AllPlansAchievedHistories';

dotenv.config();

// typeorm-extension
const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [
    Users,
    PlanCharts,
    Plans,
    SubPlans,
    Schedules,
    Notices,
    PushNotifications,
    Inquiries,
    WithdrwalReasons,
    Holidays,
    SubPlanHistories,
    Goals,
    AllPlansAchievedHistories,
  ],
  migrations: [__dirname + '/migrations/*.ts'],
  synchronize: false,
  logging: true,
});

export default dataSource;
