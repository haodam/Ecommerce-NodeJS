const mysql = require('mysql2');

// Tạo kết nối với cơ sở dữ liệu MySQL
const pool = mysql.createPool({
    host: '127.0.0.1',    // Đảm bảo dùng địa chỉ IPv4
    user: 'abc123',
    password: 'secret123',
    database: 'MYSQL_10',
    port: 8833,            // Cổng trùng khớp với cổng của MySQL container
    connectTimeout: 10000  // Thêm thời gian chờ (10 giây) để tránh lỗi timeout
});


const batchSize = 10; // Kích thước mỗi lô chèn dữ liệu
const totalSize = 1000; // Tổng số bản ghi cần chèn

let currentId = 1;

console.time('::::::::::TIMER:::::::::::');

// Hàm chèn dữ liệu theo từng lô
const insertBatch = async () => {
    const values = [];

    // Chuẩn bị dữ liệu cho mỗi lô
    for (let i = 0; i < batchSize && currentId <= totalSize; i++) {
        const name = `name ${currentId}`;
        const age = currentId;
        const address = `address ${currentId}`;
        values.push([currentId, name, age, address]);
        currentId++;
    }

    // Nếu không còn giá trị nào để chèn, kết thúc quá trình
    if (!values.length) {
        console.timeEnd('::::::::::TIMER:::::::::::');
        pool.end(err => {
            if (err) {
                console.log(`Error occurred while closing connection pool: ${err.message}`);
            } else {
                console.log(`Connection pool closed successfully`);
            }
        });
        return;
    }

    const sql = `INSERT INTO test_table (id, name, age, address) VALUES ?`;

    // Thực hiện câu lệnh chèn
    pool.query(sql, [values], async function (err, results) {
        if (err) {
            console.error('Error executing query:', err.message);
            return;
        }
        console.log(`Inserted ${results.affectedRows} records`);

        // Tiếp tục chèn batch tiếp theo
        await insertBatch();
    });
};

// Gọi hàm để bắt đầu chèn dữ liệu
insertBatch().catch(console.error);
