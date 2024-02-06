import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1707226942982 implements MigrationInterface {
  name = 'Migrations1707226942982';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`plan_notifiaction\` \`plan_notifiaction2\` tinyint(1) NOT NULL DEFAULT '0'`
    );
    await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`refresh_token\` \`refresh_token\` varchar(400) NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`refresh_token\` \`refresh_token\` varchar(400) NULL`);
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`plan_notifiaction2\` \`plan_notifiaction\` tinyint(1) NOT NULL DEFAULT '0'`
    );
  }
}
