// n8n Webhook API Configuration
const N8N_WEBHOOK_URL = 'https://n8n-pgct.onrender.com/webhook/login';

const API_BASE_URL = typeof window !== 'undefined' 
  ? `${window.location.protocol}//${window.location.host}/api`
  : 'http://localhost:3000/api';

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    role: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    department?: string;
    employeeId?: string;
  };
}

export const login = async (username: string, password: string): Promise<LoginResponse> => {
  try {
    console.log('🔐 Attempting authentication with n8n webhook...');
    
    // Use n8n webhook for authentication
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ 
        email: username, // Using email as username for n8n lookup
        password: password,
        timestamp: new Date().toISOString(),
        source: 'inventara_frontend'
      }),
    });

    console.log('📡 n8n Response Status:', response.status);

    if (!response.ok) {
      throw new Error(`Authentication request failed (${response.status})`);
    }

    const data = await response.json();
    console.log('📋 n8n Response Data:', data);
    
    // Handle the specific JSON array format from n8n: [{ row_number, Email, Password, Role }]
    if (!data || !Array.isArray(data) || data.length === 0) {
      throw new Error('No user found with these credentials');
    }

    // Get the first (and should be only) user record
    const userRecord = data[0];
    
    // Validate that we have the required fields
    if (!userRecord.Email || !userRecord.Role) {
      throw new Error('Invalid user data received from server');
    }

    // Validate password match (case-sensitive)
    if (userRecord.Password !== password) {
      throw new Error('Invalid credentials');
    }

    // Validate email match (case-insensitive)
    if (userRecord.Email.toLowerCase() !== username.toLowerCase()) {
      throw new Error('Invalid credentials');
    }

    // Map the role to our system (only admin and manager allowed)
    let mappedRole: string;
    if (userRecord.Role.toLowerCase() === 'admin') {
      mappedRole = 'admin';
    } else {
      mappedRole = 'manager'; // All non-admin users are mapped to manager
    }

    console.log('✅ Authentication successful for:', userRecord.Email, 'Role:', mappedRole);

    // Generate user data from the n8n response
    const userData = {
      id: userRecord.row_number || Math.floor(Math.random() * 1000),
      username: userRecord.Email,
      role: mappedRole,
      email: userRecord.Email,
      firstName: mappedRole === 'admin' ? 'System' : 'User',
      lastName: mappedRole === 'admin' ? 'Administrator' : 'Manager',
              department: mappedRole === 'admin' ? 'IT Administration' : 'IT Support',
      employeeId: `EMP${String(userRecord.row_number || 1).padStart(3, '0')}`
    };

    // Return the expected format for the frontend
    return {
      token: `inventara_token_${Date.now()}_${userData.id}`,
      user: userData
    };
    
  } catch (error) {
    console.error('❌ n8n Authentication Error:', error);
    
    // If n8n is down or fails, provide fallback for development/testing
    if (process.env.NODE_ENV === 'development' || !navigator.onLine) {
      console.warn('⚠️ n8n webhook failed or offline, using development fallback');
      
      // Development fallback with the exact credentials format
      const devUsers = [
        {
          row_number: 1,
          Email: 'admin@inventara.local',
          Password: 'Admin@123!',
          Role: 'admin'
        },
        {
          row_number: 2,
          Email: 'manager@inventara.local', 
          Password: 'Manager@123!',
          Role: 'manager'
        }
      ];
      
      const foundUser = devUsers.find(u => 
        u.Email.toLowerCase() === username.toLowerCase() && u.Password === password
      );
      
      if (foundUser) {
        console.log('🔧 Development login successful for:', foundUser.Email);
        
        return {
          token: `dev_token_${Date.now()}`,
          user: {
            id: foundUser.row_number,
            username: foundUser.Email,
            role: foundUser.Role,
            email: foundUser.Email,
            firstName: foundUser.Role === 'admin' ? 'System' : 'User',
            lastName: foundUser.Role === 'admin' ? 'Administrator' : 'Manager', 
            department: foundUser.Role === 'admin' ? 'IT Administration' : 'IT Support',
            employeeId: `EMP${String(foundUser.row_number).padStart(3, '0')}`
          }
        };
      }
    }
    
    // Re-throw the error with a user-friendly message
    const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
    throw new Error(errorMessage);
  }
};

export const register = async (username: string, password: string, role: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password, role }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Registration failed');
  }
};

export const getProfile = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/profile`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch profile');
  }

  return response.json();
};
