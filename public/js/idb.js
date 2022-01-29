// Establish IndexedDB variable
let db;
// Connect to IndexedDB database called "budget_tracker" version 1
const request = indexedDb.open('budget_tracker', 1);

// Event emitter for db creation/update
request.onupgradeneeded = function (event) {
    const db = event.target.result;
    // Create new object store w/ autoincrement
    db.createObjectStore('new_expense', { autoIncrement: true });
};

// Upon succesful db connection/request...
request.onsuccess = function (event) {
    // Update global db variable to equal database connection
    db = event.target.result;
    // Check if client is online
    if (navigator.onLine) {
        // Upload stored transactions
        // uploadTransactions();
    }
};

// Catch/error logging
request.onrerror = function (event) {
    console.error(event.target.errorCode);
};
