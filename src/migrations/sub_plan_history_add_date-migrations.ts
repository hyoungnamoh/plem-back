import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1716899148591 implements MigrationInterface {
  name = 'Migrations1716899148591';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`sub_plan_histories\` ADD \`date\` datetime NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`sub_plan_histories\` DROP COLUMN \`date\``);
  }
}
