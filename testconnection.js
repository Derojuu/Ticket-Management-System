const sql = require('mssql');

const config = {
    user: 'awodumbo',
    password: 'Aderoju2005@',
    server: 'RYOMEN', // Try '127.0.0.1' or your server name
    database: 'SchProject',
    options: {
        encrypt: true,
        trustServerCertificate: true,
    },
};

async function testConnection() {
    try {
        const pool = await sql.connect(config);
        console.log('Connected to SQL Server successfully');
        pool.close();
    } catch (err) {
        console.error('Connection error:', err);
    }
}

testConnection();
