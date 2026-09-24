const express = require("express");
const path = require("path");
const os = require("os");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ---------------------------------------------------------------------------
// In-memory data
// ---------------------------------------------------------------------------
const MENU = [
    { id: "f1", name: "Margherita Pizza",  category: "Pizza",    price: 9.99,  emoji: "🍕", color: "#ef4444", desc: "Classic tomato & mozzarella" },
    { id: "f2", name: "Pepperoni Pizza",   category: "Pizza",    price: 11.99, emoji: "🍕", color: "#f97316", desc: "Loaded with pepperoni" },
    { id: "f3", name: "Cheeseburger",      category: "Burgers",  price: 8.49,  emoji: "🍔", color: "#eab308", desc: "Beef patty, cheddar, lettuce" },
    { id: "f4", name: "Chicken Burger",    category: "Burgers",  price: 8.99,  emoji: "🍔", color: "#f59e0b", desc: "Crispy chicken & mayo" },
    { id: "f5", name: "Sushi Platter",     category: "Japanese", price: 15.99, emoji: "🍣", color: "#ec4899", desc: "Assorted 12-piece set" },
    { id: "f6", name: "Ramen Bowl",        category: "Japanese", price: 12.49, emoji: "🍜", color: "#a855f7", desc: "Tonkotsu broth & noodles" },
    { id: "f7", name: "Caesar Salad",      category: "Salads",   price: 6.99,  emoji: "🥗", color: "#22c55e", desc: "Romaine, croutons, parmesan" },
    { id: "f8", name: "French Fries",      category: "Sides",    price: 3.99,  emoji: "🍟", color: "#facc15", desc: "Crispy golden fries" },
    { id: "f9", name: "Chocolate Cake",    category: "Desserts", price: 5.49,  emoji: "🍰", color: "#a16207", desc: "Rich dark chocolate slice" },
    { id: "f10", name: "Ice Cream Sundae", category: "Desserts", price: 4.99,  emoji: "🍨", color: "#38bdf8", desc: "Vanilla with toppings" },
];

const ORDERS = {};   // order_id -> order

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function findItem(id) {
    return MENU.find((m) => m.id === id);
}

function calcTotal(items) {
    return items.reduce((sum, it) => {
        const m = findItem(it.id);
        return m ? sum + m.price * it.qty : sum;
    }, 0);
}

// ---------------------------------------------------------------------------
// API
// ---------------------------------------------------------------------------
app.get("/api/menu", (req, res) => {
    res.json(MENU);
});

app.post("/api/order", (req, res) => {
    const { items, name, address, phone, notes } = req.body || {};

    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "Cart is empty" });
    }
    if (!name || !name.trim()) {
        return res.status(400).json({ error: "Name is required" });
    }
    if (!address || !address.trim()) {
        return res.status(400).json({ error: "Address is required" });
    }
    if (!phone || phone.trim().length < 5) {
        return res.status(400).json({ error: "Valid phone number is required" });
    }

    // Validate every item exists
    for (const it of items) {
        if (!findItem(it.id) || !Number.isInteger(it.qty) || it.qty < 1) {
            return res.status(400).json({ error: "Invalid item in cart" });
        }
    }

    const subtotal = calcTotal(items);
    const deliveryFee = subtotal > 25 ? 0 : 2.99;
    const tax = +(subtotal * 0.08).toFixed(2);
    const total = +(subtotal + deliveryFee + tax).toFixed(2);

    const orderId = crypto.randomBytes(4).toString("hex").toUpperCase();

    const enrichedItems = items.map((it) => {
        const m = findItem(it.id);
        return {
            id: m.id,
            name: m.name,
            emoji: m.emoji,
            price: m.price,
            qty: it.qty,
            lineTotal: +(m.price * it.qty).toFixed(2),
        };
    });

    const order = {
        id: orderId,
        items: enrichedItems,
        subtotal: +subtotal.toFixed(2),
        deliveryFee,
        tax,
        total,
        name: name.trim(),
        address: address.trim(),
        phone: phone.trim(),
        notes: (notes || "").trim(),
        status: "confirmed",
        created_at: new Date().toISOString().replace("T", " ").slice(0, 19),
    };

    ORDERS[orderId] = order;
    res.status(201).json(order);
});

app.get("/api/orders", (req, res) => {
    const list = Object.values(ORDERS).sort((a, b) =>
        b.created_at.localeCompare(a.created_at)
    );
    res.json(list);
});

app.get("/health", (req, res) => {
    res.json({ status: "ok", hostname: os.hostname() });
});

app.get("/api/info", (req, res) => {
    res.json({
        app: "foodexpress",
        hostname: os.hostname(),
        environment: process.env.APP_ENV || "development",
        menu_items: MENU.length,
        orders: Object.keys(ORDERS).length,
        timestamp: new Date().toISOString(),
    });
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🍔 FoodExpress running on http://0.0.0.0:${PORT}`);
});
