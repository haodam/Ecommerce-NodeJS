const mysql = require('mysql2');

// create connection to pool server
// docker run -d --name mysql-10m -e MYSQL_ROOT_PASSWORD=secret123 -e MYSQL_USER=abc123 -e MYSQL_PASSWORD=secret123 -e MYSQL_DATABASE=shop123 -p 8833:3306 mysql:8.0
const pool = mysql.createPool({
    host: 'localhost',
    user: 'abc123',
    password: 'secret123',
    database: 'shop123'
})

const batchSize = 100000; // adjust batch size
const totalSize = 1_000_000; // adjust total size

let currentId = 1;
const insertBatch = () => {
    const values = [];
    for(let i = 0; i< batchSize && currentId <= totalSize; i++){

    }
}