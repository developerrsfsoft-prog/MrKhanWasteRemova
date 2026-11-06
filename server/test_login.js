import('./db.js').then(async m => {
  const db = await m.initDb()
  const stmt = db.prepare("SELECT * FROM admin_users WHERE email = ?")
  const row = stmt.get(["admin@mrkhanwasteremovallondon.co.uk"])
  console.log("Row:", JSON.stringify(row))

  // GetOne equivalent
  const rows = stmt.all(["admin@mrkhanwasteremovallondon.co.uk"])
  console.log("All rows:", JSON.stringify(rows))
  const foundRow = rows[0] || null
  console.log("Found row:", JSON.stringify(foundRow))

  if (foundRow) {
    const bcrypt = await import("bcryptjs")
    const b = bcrypt.default || bcrypt
    const valid = await b.compare("admin123", foundRow.password)
    console.log("Password valid:", valid)
  }
})
