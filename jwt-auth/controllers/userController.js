// Mock database (in a real app, this would be a database model)
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

// Get all users (admin only)
exports.getAllUsers = (req, res) => {
  try {
    // Return all users without passwords
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);
    res.json({
      success: true,
      count: usersWithoutPasswords.length,
      data: usersWithoutPasswords
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching users' 
    });
  }
};

// Get single user by ID
exports.getUserById = (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Check if the request is from the same user or an admin
    if (req.user.role !== 'admin' && req.user.id !== user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to access this user' 
      });
    }

    // Return user without password
    const { password, ...userData } = user;
    res.json({ success: true, data: userData });
    
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching user' 
    });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { name, email } = req.body;
    
    // Find user
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Check if the request is from the same user or an admin
    if (req.user.role !== 'admin' && req.user.id !== userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to update this user' 
      });
    }

    // Update user (in a real app, this would be a database update)
    const updatedUser = {
      ...users[userIndex],
      name: name || users[userIndex].name,
      email: email || users[userIndex].email,
      updatedAt: new Date()
    };

    // Update in mock database
    users[userIndex] = updatedUser;

    // Return updated user without password
    const { password, ...userData } = updatedUser;
    res.json({ 
      success: true, 
      message: 'User updated successfully',
      data: userData
    });
    
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while updating user' 
    });
  }
};

// Delete user
exports.deleteUser = (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    // Find user
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Only allow admin to delete users
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to delete users' 
      });
    }

    // Delete user (in a real app, this would be a database operation)
    users.splice(userIndex, 1);

    res.json({ 
      success: true, 
      message: 'User deleted successfully' 
    });
    
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while deleting user' 
    });
  }
};

// Admin dashboard
exports.adminDashboard = (req, res) => {
  try {
    // This is a protected admin-only route
    res.json({
      success: true,
      message: 'Welcome to the Admin Dashboard',
      data: {
        totalUsers: users.length,
        activeUsers: users.length, // In a real app, you'd filter for active users
        recentActivity: [
          { id: 1, action: 'User logged in', timestamp: new Date() },
          { id: 2, action: 'Settings updated', timestamp: new Date() }
        ]
      }
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error in admin dashboard' 
    });
  }
};
