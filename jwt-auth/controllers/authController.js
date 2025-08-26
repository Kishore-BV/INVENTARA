const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock database (replace with real DB in production)
const users = [
  { 
    id: 1, 
    username: 'admin', 
    password: '$2a$10$N6BpKl5wYjLO0zX.x/Fd5eRPvPb2T9p2xBPpfwuxQal3l6erOVi3O', // admin123
    email: 'admin@iventara.com',
    role: 'admin',
    name: 'Administrator',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  { 
    id: 2, 
    username: 'user', 
    password: '$2a$10$JOMmGZ0Oul.wcLj.Ihz3eOoFHYezy0O3JjltVOrHwUnZGizDglRBa', // user123
    email: 'user@iventara.com',
    role: 'user',
    name: 'Normal User',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      username: user.username, 
      role: user.role,
      email: user.email,
      name: user.name
    }, 
    process.env.JWT_SECRET, 
    { expiresIn: '24h' }
  );
};

// User registration
exports.register = async (req, res) => {
  try {
    const { username, email, password, name } = req.body;
    
    // Check if user already exists
    const existingUser = users.find(u => u.username === username || u.email === email);
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'Username or email already exists' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user (in a real app, save to database)
    const newUser = {
      id: users.length + 1,
      username,
      email,
      password: hashedPassword,
      name,
      role: 'user', // Default role
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add to mock database
    users.push(newUser);

    // Generate token
    const token = generateToken(newUser);

    // Return user data (without password) and token
    const { password: _, ...userData } = newUser;
    
    res.status(201).json({
      success: true,
      user: userData,
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during registration' 
    });
  }
};

// User login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Generate token
    const token = generateToken(user);

    // Return user data (without password) and token
    const { password: _, ...userData } = user;
    
    res.json({
      success: true,
      user: userData,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login' 
    });
  }
};

// Get current user
exports.getMe = (req, res) => {
  try {
    // The user data is already attached to req.user by the auth middleware
    const user = users.find(u => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Return user data without password
    const { password, ...userData } = user;
    res.json({ success: true, user: userData });
    
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};
