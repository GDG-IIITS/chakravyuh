import { configDotenv } from 'dotenv';
import lodash from 'lodash';
import fromEnv from './utils/env';

configDotenv();

export const defaults = {
  superUser: {
    name: 'Super User',
    email: 'super@super.dev',
    pass: 'superuser',
  },
};

export const appConfig = {
  corsAllowedOrigins: Array.from(
    fromEnv('CORS_ALLOWED_ORIGINS').split(','),
    (x) => lodash.trim(x, '/'),
  ),

  defaultCorsAllowedOrigins: [/\.chakravyuh\.live$/],

  mongoConStr: fromEnv('MONGO_CON_STR'),

  mailer: {
    senderEmail: fromEnv('MAILER_SENDER_EMAIL'),
    passwd: fromEnv('MAILER_SENDER_PASS'),
    host: fromEnv('MAILER_HOST'),
  },

  redis: {
    host: fromEnv('REDIS_HOST'),
    port: parseInt(fromEnv('REDIS_PORT')),
  },

  debug: fromEnv('DEBUG', 'false').toLowerCase() === 'true',

  nodeEnv: fromEnv('NODE_ENV', 'development'),

  saltRounds: parseInt(fromEnv('SALT_ROUNDS', '10')),

  superUser: {
    name: fromEnv('SUPERUSER_NAME', defaults.superUser.name),
    email: fromEnv('SUPERUSER_EMAIL', defaults.superUser.email),
    pass: fromEnv('SUPERUSER_PASS', defaults.superUser.pass),
  },

  maxTeamSize: 3,
};
