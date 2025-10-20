import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'app_scholar',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '1803', // ⚠️ ALTERE AQUI
});

export default pool;