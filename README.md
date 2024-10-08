# E-Commerce System

## Overview

This is a basic e-commerce backend API built with NestJS. The system allows users to manage products, and admins to manage both users and products. Unauthenticated users can view approved products.

## Features

- User Registration and Authentication
- Role-Based Access Control (Admin/User)
- Product Management (CRUD)
- Product Approval System
- API Documentation with Swagger

## Installation

1. **Clone the repository**:

    ```bash
    git clone <repository-url>
    cd ecommerce-system
    ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

3. **Set up environment variables**:
    - Create a `.env` file in the root directory.
    - Refer to `.env.example` for the required environment variables.

4. **Run the application**:

    - For development

    ```bash
    npm run start:dev 
    ```

    - For staging  

    ```bash
    npm run start
    ```

    - For  production environment

    ```bash
    npm run start:prod
    ```

5. **Access API Documentation**:
    - Visit `http://localhost:3000/api` for Swagger API documentation.

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string.
- `JWT_SECRET`: Secret key for JWT.
- `PORT`: App port
- `BCRYPT_SALT_ROUNDS`: salt round algorithm
- `ADMIN_EMAIL`: admin's email
- `ADMIN_NAME`:  admin's name
- `ADMIN_PASSWORD`: secure password

## License

MIT
