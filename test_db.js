const pool = require('./backend/config/db');

async function test() {
    try {
        const [users] = await pool.query('SHOW TABLES');
        console.log('Tables:', users);
        process.exit(0);
    } catch (e) {
        console.error('Test Failed:', e);
        process.exit(1);
    }
}

test();
