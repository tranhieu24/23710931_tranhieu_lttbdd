const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, "db.json");

function getPhones() {
  try {
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function savePhones(phones) {
  fs.writeFileSync(DB_FILE, JSON.stringify(phones, null, 2), "utf-8");
}

const server = http.createServer((req, res) => {
  // Bật CORS cho mọi client (web, mobile, expo)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.replace(/\/+$/, ""); // loại bỏ dấu / ở cuối

  // Endpoint: /phones hoặc /api/v1/phones
  const isPhonesRoot = pathname === "/phones" || pathname === "/api/v1/phones";
  const matchId = pathname.match(/^(?:\/api\/v1)?\/phones\/([^/]+)$/);

  // 1. GET /phones
  if (req.method === "GET" && isPhonesRoot) {
    const phones = getPhones();
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify(phones));
    return;
  }

  // 2. GET /phones/:id
  if (req.method === "GET" && matchId) {
    const id = matchId[1];
    const phones = getPhones();
    const phone = phones.find((p) => String(p.id) === String(id));
    if (!phone) {
      res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({ error: `Không tìm thấy sản phẩm có id=${id}` }));
      return;
    }
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify(phone));
    return;
  }

  // 3. POST /phones
  if (req.method === "POST" && isPhonesRoot) {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const newPhone = JSON.parse(body);
        const phones = getPhones();
        if (!newPhone.id) newPhone.id = String(Date.now());
        phones.push(newPhone);
        savePhones(phones);
        res.writeHead(201, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify(newPhone));
      } catch (err) {
        res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ error: "Dữ liệu JSON không hợp lệ" }));
      }
    });
    return;
  }

  // 4. PUT /phones/:id
  if (req.method === "PUT" && matchId) {
    const id = matchId[1];
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const updateData = JSON.parse(body);
        const phones = getPhones();
        const index = phones.findIndex((p) => String(p.id) === String(id));
        if (index === -1) {
          res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
          res.end(JSON.stringify({ error: `Không tìm thấy sản phẩm id=${id}` }));
          return;
        }
        phones[index] = { ...phones[index], ...updateData, id };
        savePhones(phones);
        res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify(phones[index]));
      } catch (err) {
        res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ error: "Dữ liệu JSON không hợp lệ" }));
      }
    });
    return;
  }

  // Route khác: 404
  res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify({ error: "Not Found", path: pathname }));
});

server.listen(PORT, () => {
  console.log(`> Mock API Server đang chạy tại: http://localhost:${PORT}/phones`);
});
