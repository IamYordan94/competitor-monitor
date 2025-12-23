import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

console.log("1. Checking Environment Variables...");
if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL is undefined!");
    process.exit(1);
} else {
    console.log("✅ DATABASE_URL found:", process.env.DATABASE_URL.substring(0, 25) + "...");
}

// DEBUG: Check DNS
import dns from "node:dns";
console.log("\n2. Debugging DNS...");
const hostname = new URL(process.env.DATABASE_URL!).hostname;
dns.lookup(hostname, { all: true }, (err, addresses) => {
    if (err) {
        console.error("❌ DNS Lookup Failed:", err);
        process.exit(1);
    } else {
        console.log("✅ DNS Resolution:", addresses);

        console.log("\n3. Attempting Connection...");
        const pool = new Pool({
            connectionString: process.env.DATABASE_URL,
        });

        pool.connect()
            .then(client => {
                console.log("✅ Successfully connected to Database!");
                return client.query('SELECT NOW()')
                    .then(res => {
                        console.log("✅ Query Result:", res.rows[0]);
                        client.release();
                        pool.end();
                    });
            })
            .catch(err => {
                console.error("❌ Connection Failed:", err);
                process.exit(1);
            });
    }
});
