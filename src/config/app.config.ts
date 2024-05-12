//readme
export const appConfig = {
  default_schema_identifier: 'public',
  default_migrations_folder: __dirname + '/../database/migrations',
  default_seeders_folder: __dirname + '/../database/seeders',
  tenant_migrations_folder: __dirname + '/../database/tenant_migrations',
  tenant_seeders_folder: __dirname + '/../database/tenant_seeders',
  recommended_bycrypt_rounds: 12,
  email_from: 'mailer@schmserver.com',
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
};
