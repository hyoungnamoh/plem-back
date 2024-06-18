import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1716896653665 implements MigrationInterface {
  name = 'Migrations1716896653665';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`sub_plan_histories\` ADD \`user_id\` int NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`sub_plan_histories\` DROP COLUMN \`user_id\``);
  }
}
