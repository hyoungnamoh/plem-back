import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1717744705502 implements MigrationInterface {
  name = 'Migrations1717744705502';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`all_plans_achieved_histories\` (\`id\` int NOT NULL AUTO_INCREMENT, \`plan_chart_id\` int NOT NULL, \`user_id\` int NOT NULL, \`date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`removed_at\` datetime(6) NULL, UNIQUE INDEX \`id\` (\`id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX \`id\` ON \`all_plans_achieved_histories\``);
    await queryRunner.query(`DROP TABLE \`all_plans_achieved_histories\``);
  }
}
