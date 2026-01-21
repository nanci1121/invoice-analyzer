const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');

let db = null;
let SQL = null;
const dbPath = path.join(process.env.APPDATA || process.env.HOME, '.invoice-analyzer', 'invoices.db');

async function initDatabase() {
  if (SQL) return;
  
  SQL = await initSqlJs();
  
  // Crear directorio si no existe
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // Cargar DB existente o crear nueva
  if (fs.existsSync(dbPath)) {
    const data = fs.readFileSync(dbPath);
    db = new SQL.Database(data);
  } else {
    db = new SQL.Database();
    createSchema();
  }
}

function createSchema() {
  db.run(`
    CREATE TABLE IF NOT EXISTS invoices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      provider TEXT NOT NULL,
      amount REAL NOT NULL,
      tax REAL NOT NULL,
      concept TEXT,
      total REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  saveDatabase();
}

function saveDatabase() {
  if (!db) return;
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbPath, buffer);
}

function getInvoices() {
  if (!db) return [];
  try {
    const stmt = db.prepare('SELECT * FROM invoices ORDER BY date DESC');
    const result = [];
    while (stmt.step()) {
      const row = stmt.getAsObject();
      result.push(row);
    }
    stmt.free();
    return result;
  } catch (err) {
    console.error('Error getting invoices:', err);
    return [];
  }
}

function addInvoice(invoice) {
  if (!db) return null;
  try {
    const stmt = db.prepare(`
      INSERT INTO invoices (date, provider, amount, tax, concept, total)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.bind([
      invoice.date,
      invoice.provider,
      invoice.amount,
      invoice.tax,
      invoice.concept,
      invoice.total
    ]);
    stmt.step();
    stmt.free();
    saveDatabase();
    
    // Retornar el último ID insertado
    const idStmt = db.prepare('SELECT last_insert_rowid() as id');
    idStmt.step();
    const { id } = idStmt.getAsObject();
    idStmt.free();
    
    return { id, ...invoice };
  } catch (err) {
    console.error('Error adding invoice:', err);
    return null;
  }
}

function deleteInvoice(id) {
  if (!db) return false;
  try {
    const stmt = db.prepare('DELETE FROM invoices WHERE id = ?');
    stmt.bind([id]);
    stmt.step();
    stmt.free();
    saveDatabase();
    return true;
  } catch (err) {
    console.error('Error deleting invoice:', err);
    return false;
  }
}

module.exports = {
  initDatabase,
  getInvoices,
  addInvoice,
  deleteInvoice
};
