# 🍔 FoodExpress — Food Delivery App

A lightweight **Node.js + Express** web application for ordering food online.
Built as a **Docker practice project** — no database, no external services, everything lives in memory and resets on restart.

---

## 📖 About the App

FoodExpress lets users:

- Browse a menu of dishes with prices, categories, and ratings
- Filter items by category (Pizza, Burgers, Japanese, Salads, Sides, Desserts)
- Add items to a cart with quantity controls
- See a live cart summary with subtotal, delivery fee, tax, and total
- Place an order with name, phone, and delivery address
- Receive an order confirmation with a unique reference ID
- View all past orders in a "My Orders" section

All data (menu, cart, orders) is stored **in memory**. There is no database — everything resets when the app restarts. This makes it perfect for Docker practice and demos.

---

## 📁 Project Structure

```
food-delivery/
├── server.js              # Express server + JSON API + in-memory data
├── package.json           # Node dependencies and scripts
├── Dockerfile             # Container definition
├── README.md              # This file
└── public/
    └── index.html         # Single-file frontend (HTML + CSS + JS)
```

---

## 🚀 Running Locally (Without Docker)

### 1. Install dependencies

```bash
npm install
```

### 2. Run the app

```bash
npm start
```

The app runs on port **5000** by default.

Open your browser at 👉 **http://localhost:5000**

To use a different port:

```bash
PORT=8080 npm start
```

### 3. Development mode (auto-reload)

```bash
npm run dev
```

---

## 🐳 Running with Docker

### 1. Build the image

```bash
docker build -t foodexpress .
```

### 2. Run the container

```bash
docker run -p 8080:5000 foodexpress
```

Open your browser at 👉 **http://localhost:8080**

### 3. Run in detached mode (background)

```bash
docker run -d --name foodexpress-app -p 8080:5000 foodexpress
```

### 4. Useful Docker commands

```bash
# View running containers
docker ps

# View logs
docker logs foodexpress-app

# Follow logs in real time
docker logs -f foodexpress-app

# Stop the container
docker stop foodexpress-app

# Remove the container
docker rm foodexpress-app

# Remove the image
docker rmi foodexpress
```

### 5. Quick health check

```bash
curl http://localhost:8080/health
```

Expected response:

```json
{"hostname":"<container-id>","status":"ok"}
```

---

## 🧪 Test Flow

1. Open the app in your browser
2. Browse the menu and click **+ Add** on items you want
3. Adjust quantities in the cart panel on the right
4. Click **Checkout**
5. Fill in your name, phone number, and delivery address
6. Click **Place Order**
7. Your order confirmation with a reference ID appears
8. Click **My Orders** in the header to see all past orders

---

## ⚙️ Configuration

| Variable   | Default       | Description                                |
|------------|---------------|--------------------------------------------|
| `PORT`     | `5000`        | Port the Node server listens on            |
| `APP_ENV`  | `development` | Environment label (shown in `/api/info`)   |

---

## 🌐 API Endpoints

| Method | Endpoint        | Description                  |
|--------|-----------------|------------------------------|
| `GET`  | `/`             | Serves the single-page app   |
| `GET`  | `/api/menu`     | List all menu items          |
| `POST` | `/api/order`    | Place a new order            |
| `GET`  | `/api/orders`   | List all orders              |
| `GET`  | `/health`       | Healthcheck                  |
| `GET`  | `/api/info`     | App + container info         |

---

## 🛠️ Tech Stack

| Layer     | Tech                              |
|-----------|-----------------------------------|
| Backend   | Node.js 24, Express 4             |
| Frontend  | Vanilla HTML / CSS / JavaScript   |
| Fonts     | Inter + Playfair Display          |
| Storage   | In-memory JavaScript objects      |
| Container | Docker (node:24-alpine)           |
