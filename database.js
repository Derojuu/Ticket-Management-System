const sql = require('mssql');

const config = {
    user: 'awodumbo',
    password: 'Aderoju2005@',
    server: 'RYOMEN', 
    database: 'SchProject',
    options: {
        encrypt: true,
        trustServerCertificate: true,
    },
};

// Function to insert a closed ticket
async function insertClosedTickets(ticket) {
    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('Name', sql.NVarChar, ticket.name)
            .input('Office', sql.NVarChar, ticket.office)
            .input('PhoneNumber', sql.NVarChar, ticket.phoneNumber)
            .input('TicketDescription', sql.NVarChar, ticket.ticketDescription)
            .input('AssignedTo', sql.NVarChar, ticket.assignedTo)
            .query(`
                INSERT INTO ClosedTickets (Name, Office, PhoneNumber, TicketDescription, AssignedTo)
                VALUES (@Name, @Office, @PhoneNumber, @TicketDescription, @AssignedTo)
            `);
        console.log('Ticket inserted successfully');
    } catch (err) {
        console.error('Error inserting ticket:', err);
    } finally {
        sql.close();
    }
}

module.exports = { insertClosedTickets };


