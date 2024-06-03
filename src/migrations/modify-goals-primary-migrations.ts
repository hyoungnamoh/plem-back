import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1717413569400 implements MigrationInterface {
  name = 'Migrations1717413569400';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`goals\` CHANGE \`id\` \`id\` int NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`goals\` DROP PRIMARY KEY`);
    await queryRunner.query(`DROP INDEX \`id\` ON \`goals\``);
    await queryRunner.query(`ALTER TABLE \`goals\` DROP COLUMN \`id\``);
    await queryRunner.query(`ALTER TABLE \`goals\` ADD \`id\` int NOT NULL PRIMARY KEY`);
    await queryRunner.query(`CREATE INDEX \`id\` ON \`goals\` (\`id\`)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX \`id\` ON \`goals\``);
    await queryRunner.query(`ALTER TABLE \`goals\` DROP COLUMN \`id\``);
    await queryRunner.query(`ALTER TABLE \`goals\` ADD \`id\` int NOT NULL AUTO_INCREMENT`);
    await queryRunner.query(`CREATE INDEX \`id\` ON \`goals\` (\`id\`)`);
    await queryRunner.query(`ALTER TABLE \`goals\` ADD PRIMARY KEY (\`id\`)`);
    await queryRunner.query(`ALTER TABLE \`goals\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT`);
  }
}
