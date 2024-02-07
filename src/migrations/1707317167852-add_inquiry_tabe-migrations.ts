import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1707317167852 implements MigrationInterface {
  name = 'Migrations1707317167852';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`inquiries\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user_id\` int NOT NULL, \`email\` varchar(100) NOT NULL, \`title\` varchar(100) NOT NULL, \`content\` varchar(500) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`removed_at\` datetime(6) NULL, INDEX \`id\` (\`id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`refresh_token\` \`refresh_token\` varchar(400) NULL`);
    await queryRunner.query(
      `ALTER TABLE \`inquiries\` ADD CONSTRAINT \`FK_a896a1864d60d5707403e0a0810\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`inquiries\` DROP FOREIGN KEY \`FK_a896a1864d60d5707403e0a0810\``);
    await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`refresh_token\` \`refresh_token\` varchar(400) NULL`);
    await queryRunner.query(`DROP INDEX \`id\` ON \`inquiries\``);
    await queryRunner.query(`DROP TABLE \`inquiries\``);
  }
}
