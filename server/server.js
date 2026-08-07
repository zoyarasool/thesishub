console.log('Starting server...');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const path = require('path');

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/milestones', require('./routes/milestoneRoutes'));
app.use('/api/documents', require('./routes/documentRoutes'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/meetings', require('./routes/meetingRoutes'));

app.get('/', (req, res) => {
  res.send('ThesisHub API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});