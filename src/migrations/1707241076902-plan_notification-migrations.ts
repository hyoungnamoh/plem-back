import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1707241076902 implements MigrationInterface {
    name = 'Migrations1707241076902'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`plan_notifiaction\` \`plan_notification\` tinyint(1) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`refresh_token\` \`refresh_token\` varchar(400) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`refresh_token\` \`refresh_token\` varchar(400) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`plan_notification\` \`plan_notifiaction\` tinyint(1) NOT NULL DEFAULT '0'`);
    }

}
