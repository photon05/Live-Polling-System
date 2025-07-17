const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const pollManager = require('./pollManager');
const Teacher = require('./models/Teacher'); 
const polls = require('./models/Poll'); // Assuming you have a Poll model defined

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

// MongoDB connection
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/live-polling', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

app.use(cors());
app.use(express.json());

// server/index.js
app.get('/api/polls', async (req, res) => {
  const getPolls = await polls.find().sort({ createdAt: -1 }).limit(10);
  res.json(getPolls);
});

// Teacher Sign Up and Login Api
// Signup API
app.post('/api/teacher/signup', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({ error: 'Teacher already exists' });
    }

    const newTeacher = new Teacher({ name, email, password });
    await newTeacher.save();

    res.status(201).json({ message: 'Teacher registered successfully' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login API
app.post('/api/teacher/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const teacher = await Teacher.findOne({ email });

    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    if (teacher.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful', teacher });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


io.on('connection', socket => {
  console.log('User connected:', socket.id);

  // 🧑‍🎓 Student joins
  socket.on('student:join', async ({ name }) => {
    await pollManager.addStudent(socket.id, name);
  });

  // 👨‍🏫 Teacher creates a new poll
  socket.on('teacher:createPoll', async (poll) => {
  try {
    // Optional: Validate poll structure
    if (!poll.question || !Array.isArray(poll.options) || poll.options.length < 2) {
      return; // silently ignore or emit error if needed
    }

    // Optional: Sanitize/normalize each option
    const sanitizedOptions = poll.options.map(opt => ({
      text: opt.text?.trim() || '',
      isCorrect: !!opt.isCorrect,
      votes: 0,
    }));

    const pollToSave = {
      question: poll.question.trim(),
      options: sanitizedOptions,
      // Optional: Add timeLimit, teacherId, etc.
    };

    await pollManager.createPoll(pollToSave);

    const latest = await pollManager.getLatestPoll();
    io.emit('poll:new', latest); // Broadcast poll to all students
  } catch (err) {
    console.error('Error creating poll:', err.message);
  }
});


  // 🧑‍🎓 Student submits answer
  socket.on('student:submitAnswer', async ({ answer }) => {
    await pollManager.submitAnswer(socket.id, answer);
    const stats = await pollManager.getPollStats();
    io.emit('poll:update', stats); // Send updated results to everyone
  });

  // 💬 Chat (optional)
  socket.on('chat:message', msg => {
    io.emit('chat:message', msg); // Broadcast chat to all
  });

  // ❌ Disconnected
  socket.on('disconnect', async () => {
    await pollManager.removeStudent(socket.id);
  });
});


server.listen(5000, () => console.log('Server listening on port 5000'));
