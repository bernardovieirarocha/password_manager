const sqlite3 = require("sqlite3").verbose();

const db_name = "data.db";
const db = new sqlite3.Database(db_name, (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log("Successful connection to the database 'data.db'");
});

function find_user(db,tablename,username,clb) {
  db.all(`SELECT * FROM ${tablename} WHERE username = '${username}'`,[],(err,rows) =>{
    console.log(err,rows);
    if (err) {
      clb('error',rows)
    } else {
      clb(err,rows);
    }
  })
}

find_user(db,'Users')

const sql = "SELECT * FROM Books ORDER BY Title"
db.all(sql, [], (err, rows) => {
  if (err) {
    return console.error(err.message);
  }
  console.log(rows);
//   res.render("books", { model: rows });
});


const sql_create = `CREATE TABLE IF NOT EXISTS Users (
    Users_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    Comments TEXT
  );`;

// db.run(sql_create, (err) => {
//     if (err) {
//         return console.error(err.message);
//     }
//     console.log("Successful creation of the 'Books' table");
// });

// console.log("Successful creation of the 'Books' table");
// // Database seeding
// const sql_insert = `INSERT INTO Books (Book_ID, Title, Author, Comments) VALUES
//   (1, 'Mrs. Bridge', 'Evan S. Connell', 'First in the serie'),
//   (2, 'Mr. Bridge', 'Evan S. Connell', 'Second in the serie'),
//   (3, 'L''ingénue libertine', 'Colette', 'Minne + Les égarements de Minne');`;
// db.run(sql_insert, (err) => {
//     if (err) {
//         return console.error(err.message);
//     }
//     console.log("Successful creation of 3 books");
// });
