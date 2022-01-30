// Establish IndexedDB variable
let db;
// Connect to IndexedDB database called "budget_tracker" version 1
const request = indexedDB.open('budget_tracker', 1);

// Event emitter for db creation/update
request.onupgradeneeded = function (event) {
    const db = event.target.result;
    // Create new object store w/ autoincrement
    db.createObjectStore('new_record', { autoIncrement: true });
};

// Upon succesful db connection/request...
request.onsuccess = function (event) {
    // Update global db variable to equal database connection
    db = event.target.result;
    // Check if client is online
    if (navigator.onLine) {
        // Upload locally stored transactions
        // uploadTransactions();
    }
};

// Catch/error logging
request.onrerror = function (event) {
    console.error(event.target.errorCode);
};

// Save transaction if client is offline
function saveRecord(record) {
    // Open read/write transaction with database
    const transaction = db.transaction(['new_record'], 'readwrite');
    // Access the object store
    const recordObjectStore = transaction.objectStore('new_record');
    // Add the record to the object store
    recordObjectStore.add(record);
}
