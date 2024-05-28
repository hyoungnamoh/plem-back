import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1716900790850 implements MigrationInterface {
  name = 'Migrations1716900790850';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX \`sub_plan_name\` ON \`sub_plan_histories\``);
    await queryRunner.query(
      `ALTER TABLE \`sub_plan_histories\` ADD UNIQUE INDEX \`IDX_d5b210a41580503d1429c2c29f\` (\`id\`)`
    );
    await queryRunner.query(`CREATE UNIQUE INDEX \`id\` ON \`sub_plan_histories\` (\`id\`)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX \`id\` ON \`sub_plan_histories\``);
    await queryRunner.query(`ALTER TABLE \`sub_plan_histories\` DROP INDEX \`IDX_d5b210a41580503d1429c2c29f\``);
    await queryRunner.query(`CREATE UNIQUE INDEX \`sub_plan_name\` ON \`sub_plan_histories\` (\`sub_plan_name\`)`);
  }
}
