export const SwaggerAuthDocs = {
  register: {
    summary: 'Register a new user',
    example: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'StrongPass123!',
      roles: ['user-view', 'admin-view'],
    },
  },

  login: {
    summary: 'Login user and get token',
    example: {
      username: 'john.doe@example.com',
      password: 'StrongPass123!',
    },
    responseExample: {
      access_token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6Ikp...',
      expires_in: 300,
      refresh_token: '...',
      token_type: 'Bearer',
    },
  },

  assignRole: {
    summary: 'Assign roles to a user',
    example: {
      userId: '1234-uuid-5678',
      roles: ['admin-update', 'employee-view'],
    },
  },

  unassignRole: {
    summary: 'Unassign roles from a user',
    example: {
      userId: '1234-uuid-5678',
      roles: ['admin-update', 'admin-create'],
    },
  },

  getUser: {
    summary: 'Fetch user details by ID',
    responseExample: {
      id: '1234-uuid-5678',
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      enabled: true,
    },
  },

  getRoles: {
    summary: 'Fetch roles assigned to a user',
    responseExample: ['admin-update', 'user-view'],
  },
};


export const SwaggerResponses = {
  success201: {
    status: 201,
    description: 'User registered successfully',
  },
  badRequest400: {
    status: 400,
    description: 'Validation error or bad request',
  },
  conflict409: {
    status: 409,
    description: 'User already exists with same email',
  },
  internal500: {
    status: 500,
    description: 'Internal server error',
  },
  success200: {
    status: 200,
    description: 'Request successful',
  },
  unauthorized401: {
    status: 401,
    description: 'Unauthorized or invalid credentials',
  },
  notFound404: {
    status: 404,
    description: 'Resource not found',
  },
};
