import Database from "sql.js"

const SQL = await Database.default()
const db = new SQL.Database()
db.run("CREATE TABLE t (id INTEGER PRIMARY KEY, name TEXT)")
db.run("INSERT INTO t (name) VALUES (?)", ["hello"])

// Try exec with callback
db.exec("SELECT * FROM t", (results) => {
  console.log("exec callback results:", JSON.stringify(results))
})

// Try db.run with SELECT and check return
const result = db.run("SELECT * FROM t", [])
console.log("db.run SELECT result type:", typeof result)
console.log("db.run SELECT result keys:", Object.keys(result))
// Try to access lastInsertRowid or changes
console.log("changes:", result.changes)
console.log("lastInsertRowid:", result.lastInsertRowid)
