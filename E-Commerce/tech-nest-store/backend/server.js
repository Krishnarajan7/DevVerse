const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet'); // Security headers kaga
const morgan = require('morgan'); // Request log panna
require('dotenv').config();

const app = express();

// --- 1. GLOBAL MIDDLEWARES ---
app.use(helmet()); // Basic security vulnerabilities-la irundhu kaapaathum
app.use(morgan('dev')); // Backend request-ai terminal-la azhaga kaatum
app.use(express.json());

// --- 2. CORS ARCHITECTURE ---
const allowedOrigins = [
  'https://techstore-1.netlify.app', 
  'http://localhost:5173'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Unauthorized Access by CORS Architecture'));
    }
  },
  credentials: true
}));

// --- 3. DATABASE INTEGRATION ---
const DB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/terabyte_vault";

mongoose.connect(DB_URI)
  .then(() => console.log("🔥 [SYSTEM] Vault Database Node: ONLINE"))
  .catch(err => console.error("❌ [SYSTEM] Database Critical Failure:", err));

// --- 4. DATA SCHEMAS ---
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  img: { type: String, required: true },
  tag: { type: String, default: "Standard" },
  spec: { type: String, default: "Premium Tech Artifact" }
}, { timestamps: true });

const orderSchema = new mongoose.Schema({
  transactionId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  phone: String,
  address: String,
  items: Array,
  totalAuthorized: Number,
  status: { type: String, default: 'Pending' }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);

// --- 5. CORE API ROUTES ---

// A. Product Catalogue (optimized)
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({}).lean(); // .lean() faster retrieval-kku
    res.status(200).json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: "Inventory Retrieval Failed" });
  }
});

// B. Single Product Telemetry
app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Node ID Format" });
    }
    const product = await Product.findById(id).lean();
    if (!product) return res.status(404).json({ success: false, message: "Node Not Found" });
    res.status(200).json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Side Telemetry Error" });
  }
});

// C. Order Processing
app.post('/api/checkout', async (req, res) => {
  try {
    const orderData = req.body;
    const transactionId = `TRX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newOrder = new Order({ ...orderData, transactionId });
    await newOrder.save();
    res.status(201).json({ success: true, transactionId });
  } catch (err) {
    res.status(500).json({ success: false, message: "Transaction Storage Failed" });
  }
});

// --- 6. SEEDING ENGINE ---
const seedInventory = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log("🛠️ [SEED] Vault Empty. Injecting Artifacts...");
      const bulkProducts = [
        // --- AUDIO ---
        { name: "Sonic-X Gen 3", price: 12999, category: "Audio", tag: "NEW", spec: "Lossless Audio Engine", img: "https://images.pexels.com/photos/3394651/pexels-photo-3394651.jpeg?auto=compress&cs=tinysrgb&w=800" },
        { name: "Acoustic Pods Pro", price: 5999, category: "Audio", tag: "LIMITED", spec: "360 Spatial Audio", img: "https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=800" },
        { name: "Studio Monitor Z", price: 24500, category: "Audio", tag: "ELITE", spec: "Reference Grade Fidelity", img: "https://images.pexels.com/photos/1037992/pexels-photo-1037992.jpeg?auto=compress&cs=tinysrgb&w=800" },

        // --- WEARABLES ---
        { name: "Titan Chronos", price: 8500, category: "Wearables", tag: "TRENDING", spec: "Titanium Chassis", img: "https://images.pexels.com/photos/267394/pexels-photo-267394.jpeg?auto=compress&cs=tinysrgb&w=800" },
        { name: "Pulse Fit Band", price: 3200, category: "Wearables", tag: "STABLE", spec: "Biometric Matrix 2.0", img: "https://images.pexels.com/photos/4370376/pexels-photo-4370376.jpeg?auto=compress&cs=tinysrgb&w=800" },
        { name: "Vision Watch SE", price: 15999, category: "Wearables", tag: "PREMIUM", spec: "Micro-OLED Display", img: "https://images.pexels.com/photos/110471/pexels-photo-110471.jpeg?auto=compress&cs=tinysrgb&w=800" },

        // --- MOBILE ---
        { name: "Nexus 15 Ultra", price: 89999, category: "Mobile", tag: "FLAGSHIP", spec: "Snapdragon 8 Gen 4", img: "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=800" },
        { name: "Fold-X Kinetic", price: 145000, category: "Mobile", tag: "ELITE", spec: "Flexible Carbon Hinge", img: "https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=800" },
        { name: "Core Lite Pro", price: 32000, category: "Mobile", tag: "BEST SELLER", spec: "Performance Node A1", img: "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800" },

        // --- VISION ---
        { name: "Terabyte Vision Pro", price: 250000, category: "Vision", tag: "ARCHITECT", spec: "8K Spatial Computing", img: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800" },
        { name: "Glass-X AR", price: 45000, category: "Vision", tag: "FUTURE", spec: "Retina Projection Tech", img: "https://images.pexels.com/photos/3761118/pexels-photo-3761118.jpeg?auto=compress&cs=tinysrgb&w=800" },

        // --- POWER ---
        { name: "Fusion Hub 100W", price: 4500, category: "Power", tag: "ESSENTIAL", spec: "GaN Fast Charge Node", img: "https://images.pexels.com/photos/400678/pexels-photo-400678.jpeg?auto=compress&cs=tinysrgb&w=800" },
        { name: "MegaVolt 50k", price: 7999, category: "Power", tag: "HEAVY DUTY", spec: "50,000mAh Battery Tank", img: "https://images.pexels.com/photos/459762/pexels-photo-459762.jpeg?auto=compress&cs=tinysrgb&w=800" },
        { name: "Solar Core Pad", price: 12000, category: "Power", tag: "ECO", spec: "Quantum Solar Panels", img: "https://images.pexels.com/photos/159397/solar-panel-array-power-sun-159397.jpeg?auto=compress&cs=tinysrgb&w=800" },
        { name: "Flux Station", price: 3500, category: "Power", tag: "STABLE", spec: "MagSafe 3.0 Compatible", img: "https://images.pexels.com/photos/4195324/pexels-photo-4195324.jpeg?auto=compress&cs=tinysrgb&w=800" }
      ];
      await Product.insertMany(bulkProducts);
      console.log("🔥 [SUCCESS] 15 Premium Stable Artifacts Synchronized!");
    }
  } catch (err) {
    console.error("❌ Seed Error:", err);
  }
};

// --- 7. ERROR HANDLING MIDDLEWARE ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ success: false, message: 'Something broke in the Matrix!' });
});

// --- START ENGINE ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 [PORTAL] Terabyte active on port ${PORT}`);
});