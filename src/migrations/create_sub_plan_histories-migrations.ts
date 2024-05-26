import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1716711263912 implements MigrationInterface {
  name = 'Migrations1716711263912';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`sub_plan_histories\` (\`id\` int NOT NULL AUTO_INCREMENT, \`sub_plan_name\` varchar(100) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`sub_plan_name\` (\`sub_plan_name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX \`sub_plan_name\` ON \`sub_plan_histories\``);
    await queryRunner.query(`DROP TABLE \`sub_plan_histories\``);
  }
}
