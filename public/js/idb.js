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
        uploadRecords();
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

// Upload stored records
function uploadRecords() {
    // Open read/write transaction with database
    const transaction = db.transaction(['new_record'], 'readwrite');
    // Access the object store
    const recordObjectStore = transaction.objectStore('new_record');
    // Get all locally stored records, store in variable
    const getAll = recordObjectStore.getAll();
    // If getAll() is successful...
    getAll.onsuccess = function () {
        // If there are stored records, send them through the API routes
        if (getAll.result.length > 0) {
            fetch('/api/transaction', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => response.json())
                .then((serverResponse) => {
                    if (serverResponse.message) {
                        throw new Error(serverResponse);
                    }
                    // Open transaction with database
                    const transaction = db.transaction(
                        ['new_record'],
                        'readwrite'
                    );
                    // Access object store
                    const recordObjectStore =
                        transaction.objectStore('new_record');
                    // Clear all items in store
                    recordObjectStore.clear();
                    alert('All saved transactions have been submitted!');
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    };
}

// Listen for client regaining online access
window.addEventListener('online', uploadRecords);
