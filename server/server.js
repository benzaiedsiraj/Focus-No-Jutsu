require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ----------------------------------------------------------------------------------
// SECURITY & ANTI-HACKING MIDDLEWARE
// ----------------------------------------------------------------------------------
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const User = require('./models/User');
const Session = require('./models/Session');
const auth = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Activate HTTP Header protections (XSS, Clickjacking, MIME Sniffing, etc.)
app.use(helmet());

// Cross-Origin configuration
app.use(cors());

// Limit raw JSON body payload size to stop memory-bloating attacks
app.use(express.json({ limit: '10kb' }));

// Global Rate Limiting blocking Brute-Force & basic DDoS attempts
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 100, // strictly limit each IP to 100 requests per window
  message: { success: false, message: "Too many chakra requests from this IP, please rest and try again later." }
});
app.use('/api/', limiter);


if (process.env.MONGO_URI && !process.env.MONGO_URI.includes('<username>')) {
  mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000, 
    socketTimeoutMS: 45000
  })
  .then(() => console.log('✅ Successfully connected to MongoDB Atlas!'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err.message));
}

// ----------------------------------------------------------------------------------
// OFFLINE DB FALLBACKS (Memory Storage)
// ----------------------------------------------------------------------------------
let mockOfflineSessions = [];
let mockOfflineUsers = []; 

// ----------------------------------------------------------------------------------
// LOCAL AUTHENTICATION
// ----------------------------------------------------------------------------------
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (mongoose.connection.readyState !== 1) {
      console.warn("⚠️ Atlas Offline: Running mock registry logic.");
      const existingUser = mockOfflineUsers.find(u => u.username === username || u.email === email);
      if (existingUser) return res.status(400).json({ success: false, message: 'Alias or Email is already registered.' });
      
      const mockUser = { id: `mock_user_${Date.now()}`, username, email, password }; 
      mockOfflineUsers.push(mockUser);

      const mockToken = jwt.sign({ user: { id: mockUser.id, username, email } }, process.env.JWT_SECRET || 'hidden', { expiresIn: '7d' });
      return res.status(201).json({ success: true, token: mockToken, user: { id: mockUser.id, username, email } });
    }

    let user = await User.findOne({ $or: [{ username }, { email }] });
    if (user) return res.status(400).json({ success: false, message: 'Alias or Email is already registered.' });
    
    user = new User({ username, email, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    
    const payload = { user: { id: user.id, username: user.username, email: user.email } };
    jwt.sign(payload, process.env.JWT_SECRET || 'hidden', { expiresIn: '7d' }, (err, token) => {
        if (err) throw err;
        res.status(201).json({ success: true, token, user: payload.user });
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error parsing atlas database.' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (mongoose.connection.readyState !== 1) {
      console.warn("⚠️ Atlas Offline: Validating array login mock.");
      const user = mockOfflineUsers.find(u => u.username === username || u.email === username);
      
      if (!user) return res.status(404).json({ success: false, message: 'Ninja not found in the academy. Please sign up first.' });
      
      if (user.password !== password) return res.status(401).json({ success: false, message: 'Invalid ninja credentials' });

      const mockToken = jwt.sign({ user: { id: user.id, username: user.username } }, process.env.JWT_SECRET || 'hidden', { expiresIn: '7d' });
      return res.status(200).json({ success: true, token: mockToken, user: { id: user.id, username: user.username } });
    }
    
    let user = await User.findOne({ $or: [{ username: username }, { email: username }] });
    
    if (!user) return res.status(404).json({ success: false, message: 'Ninja not found in the academy. Please sign up first.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid ninja credentials' });
    
    const payload = { user: { id: user.id, username: user.username } };
    jwt.sign(payload, process.env.JWT_SECRET || 'hidden', { expiresIn: '7d' }, (err, token) => {
        if (err) throw err;
        res.status(200).json({ success: true, token, user: payload.user });
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error verifying credentials' });
  }
});

// ----------------------------------------------------------------------------------
// SECURED SESSION ROUTES
// ----------------------------------------------------------------------------------
app.post('/api/sessions', auth, async (req, res) => {
  try {
    const { plantType, missionName, missionRank } = req.body;
    
    if (mongoose.connection.readyState !== 1) {
       console.log(`⚠️ Atlas Offline: Simulated scroll save for ${req.user.username}`);
       const mockDoc = { _id: Date.now().toString(), plantType, missionName, missionRank, userId: req.user.id, createdAt: new Date() };
       mockOfflineSessions.push(mockDoc);
       return res.status(201).json({ success: true, data: mockDoc });
    }
    
    const newSession = new Session({ plantType, missionName, missionRank, userId: req.user.id });
    const savedSession = await newSession.save();
    res.status(201).json({ success: true, data: savedSession });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error saving mission scroll' });
  }
});

app.get('/api/sessions', auth, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
       const userSessions = mockOfflineSessions.filter(s => String(s.userId) === String(req.user.id)).sort((a,b) => b.createdAt - a.createdAt);
       return res.status(200).json({ success: true, data: userSessions });
    }
    
    const sessions = await Session.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error retrieving Jutsu Library' });
  }
});

app.listen(PORT, () => {
  console.log(`\n⏱️  Focus-Flow Secured Backend running on port ${PORT}\n`);
});
