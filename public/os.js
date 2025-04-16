const openTicketList = document.getElementById('openTicketList');
const closedTicketList = document.getElementById('closedTicketList');



document.addEventListener('DOMContentLoaded', () => {
    loadTickets();
    loadAnalytics(); // Load analytics data on page load
});

// Function to add a new ticket with all required fields
function addTicket() {
    console.log("addTicket function called");
    const name = document.getElementById('ticketName').value.trim();
    const office = document.getElementById('ticketOffice').value.trim();
    const phone = document.getElementById('ticketPhone').value.trim();
    const description = document.getElementById('ticketDescription').value.trim();
    const assignedTo = document.getElementById('ticketAssignedTo').value;

      // Check if all fields are filled
    if (name && office && phone && description && assignedTo) {
        const ticketElement = createTicketElement(name, office, phone, description, assignedTo);
        openTicketList.appendChild(ticketElement);

        //Clear input fields
        document.getElementById('ticketName').value = '';
        document.getElementById('ticketOffice').value = '';
        document.getElementById('ticketPhone').value = '';
        document.getElementById('ticketDescription').value = '';
        document.getElementById('ticketAssignedTo').value = '';

        saveTickets();
        updateAnalytics();
    } else {
        alert("Please fill in all fields to add a ticket.");
    }
}

function createTicketElement(name, office, phone, description, assignedTo) {
    const li = document.createElement('li');
    li.classList.add('ticket-entry');
    li.innerHTML = `
        <span>${name}</span>
        <span>${office}</span>
        <span>${phone}</span>
        <span>${description}</span>
        <span>${assignedTo}</span>
        <span>
            <button class="complete" onclick="completeTicket(this)">Complete</button>
            <button class="delete" onclick="deleteTicket(this)">Delete</button>
        </span>
    `;
    return li;
}

async function completeTicket(button) {
    const ticketElement = button.parentElement.parentElement;
    closedTicketList.appendChild(ticketElement);
    button.remove();
    saveTickets();

    const ticket = {
        name: ticketElement.children[0].innerText,
        office: ticketElement.children[1].innerText,
        phoneNumber: ticketElement.children[2].innerText,
        ticketDescription: ticketElement.children[3].innerText,
        assignedTo: ticketElement.children[4].innerText,
        date: new Date().toISOString()
    };

    try {
        const response = await fetch('/close-ticket', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ticket)
        });

        if (response.ok) {
            console.log('Ticket closed and saved successfully.');
        } else {
            console.error('Failed to save the closed ticket.');
        }
    } catch (error) {
        console.error('Error:', error);
    }

    let totalClosedTickets = parseInt(localStorage.getItem('totalClosedTickets')) || 0;
    totalClosedTickets++;
    localStorage.setItem('totalClosedTickets', totalClosedTickets);
    updateAnalytics();
}


function deleteTicket(button) {
    const ticketElement = button.parentElement.parentElement;
    const ticketId = ticketElement.getAttribute('data-id');

    // Remove the ticket from the DOM
    ticketElement.remove();
    saveTickets();
    updateAnalytics();
}
function saveTickets() {
    const openTickets = [];
    openTicketList.querySelectorAll('.ticket-entry').forEach(ticket => {
        openTickets.push({
            name: ticket.children[0].innerText,
            office: ticket.children[1].innerText,
            phone: ticket.children[2].innerText, // Ensure consistent naming
            description: ticket.children[3].innerText, // Ensure consistent naming
            assignedTo: ticket.children[4].innerText,
            date: new Date().toISOString()
        });
    });
    localStorage.setItem('openTickets', JSON.stringify(openTickets));

    const closedTickets = [];
    closedTicketList.querySelectorAll('.ticket-entry').forEach(ticket => {
        closedTickets.push({
            name: ticket.children[0].innerText,
            office: ticket.children[1].innerText,
            phone: ticket.children[2].innerText, // Ensure consistent naming
            description: ticket.children[3].innerText, // Ensure consistent naming
            assignedTo: ticket.children[4].innerText,
            date: new Date().toISOString()
        });
    });
    localStorage.setItem('closedTickets', JSON.stringify(closedTickets));
}

function loadTickets() {
    const openTickets = JSON.parse(localStorage.getItem('openTickets')) || [];
    openTickets.forEach(ticket => {
        const ticketElement = createTicketElement(ticket.name, ticket.office, ticket.phone, ticket.description, ticket.assignedTo);
        openTicketList.appendChild(ticketElement);
    });

    const closedTickets = JSON.parse(localStorage.getItem('closedTickets')) || [];
    closedTickets.forEach(ticket => {
        const ticketElement = createTicketElement(ticket.name, ticket.office, ticket.phone, ticket.description, ticket.assignedTo);
        closedTicketList.appendChild(ticketElement);
        ticketElement.querySelector('button.complete').remove();
    });
}

function loadAnalytics() {
    let totalClosedTickets = parseInt(localStorage.getItem('totalClosedTickets')) || 0;
    document.getElementById('totalClosedTickets').innerText = totalClosedTickets;
}
// Function to display a specific section based on navigation
function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
}

function updateAnalytics() {
    const totalTickets = openTicketList.children.length + closedTicketList.children.length;
    let totalClosedTickets = parseInt(localStorage.getItem('totalClosedTickets')) || 0;
    const totalOpenedThisWeek = openTicketList.children.length;

    document.getElementById('totalTickets').innerText = totalTickets;
    document.getElementById('totalClosedTickets').innerText = totalClosedTickets;
    document.getElementById('ticketsOpenedThisWeek').innerText = totalOpenedThisWeek;
}

function filterAnalytics(interval) {
    const currentDate = new Date();
    let startDate;

    switch (interval) {
        case 'daily':
            startDate = new Date(currentDate.setDate(currentDate.getDate() - 1));
            break;
        case 'weekly':
            startDate = new Date(currentDate.setDate(currentDate.getDate() - 7));
            break;
        case 'monthly':
            startDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
            break;
        default:
            startDate = new Date(0); // Default to show all data
    }

    const openTickets = JSON.parse(localStorage.getItem('openTickets')) || [];
    const closedTickets = JSON.parse(localStorage.getItem('closedTickets')) || [];

    const filteredOpenTickets = openTickets.filter(ticket => {
        const ticketDate = new Date(ticket.date);
        return ticketDate >= startDate;
    });

    const filteredClosedTickets = closedTickets.filter(ticket => {
        const ticketDate = new Date(ticket.date);
        return ticketDate >= startDate;
    });

    document.getElementById('totalTickets').innerText = filteredOpenTickets.length + filteredClosedTickets.length;
    document.getElementById('totalClosedTickets').innerText = filteredClosedTickets.length;
    document.getElementById('ticketsOpenedThisWeek').innerText = filteredOpenTickets.length;
}

function addNotification(message) {
    const notificationList = document.getElementById('notificationList');
    const notificationItem = document.createElement('p');
    notificationItem.textContent = message;
    notificationList.appendChild(notificationItem);
}

filterAnalytics('daily');
filterAnalytics('weekly');
filterAnalytics('monthly');
