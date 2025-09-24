# Database Setup Guide

This guide will help you set up MongoDB for the Meal Planner application. You have two options:

## Option 1: MongoDB Atlas (Cloud Database) - Recommended

MongoDB Atlas is a cloud-hosted MongoDB service that's easy to set up and doesn't require local installation.

### Steps:

1. **Create a MongoDB Atlas account:**
   - Go to [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account

2. **Create a new cluster:**
   - Click "Create" or "New Project"
   - Choose the free tier (M0 Sandbox)
   - Select a region close to you
   - Name your cluster (e.g., "meal-planner-cluster")

3. **Set up database access:**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create a username and password (save these!)
   - Set privileges to "Read and write to any database"

4. **Set up network access:**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Choose "Allow access from anywhere" (0.0.0.0/0) for development

5. **Get your connection string:**
   - Go to "Database" in the left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (it looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)

6. **Update your environment variables:**
   - Open `.env.local` file
   - Replace the MONGODB_URI with your Atlas connection string:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/meal-planner
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   ```

7. **Run the seeding script:**
   ```bash
   npm run seed
   ```

## Option 2: Local MongoDB Installation

If you prefer to run MongoDB locally on your machine:

### Windows:

1. **Download MongoDB Community Server:**
   - Go to [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
   - Select Windows and download the MSI installer

2. **Install MongoDB:**
   - Run the MSI installer
   - Choose "Complete" installation
   - Install MongoDB as a Windows Service

3. **Start MongoDB:**
   - MongoDB should start automatically as a Windows service
   - You can also start it manually by running `mongod` in Command Prompt

4. **Verify installation:**
   ```bash
   mongod --version
   ```

5. **Run the seeding script:**
   ```bash
   npm run seed
   ```

### macOS:

1. **Install using Homebrew:**
   ```bash
   brew tap mongodb/brew
   brew install mongodb-community
   ```

2. **Start MongoDB:**
   ```bash
   brew services start mongodb/brew/mongodb-community
   ```

3. **Run the seeding script:**
   ```bash
   npm run seed
   ```

### Linux (Ubuntu/Debian):

1. **Import MongoDB public key:**
   ```bash
   wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
   ```

2. **Add MongoDB repository:**
   ```bash
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
   ```

3. **Install MongoDB:**
   ```bash
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   ```

4. **Start MongoDB:**
   ```bash
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

5. **Run the seeding script:**
   ```bash
   npm run seed
   ```

## Available Scripts

- `npm run seed` - Populate database with sample data
- `npm run clear` - Clear all data from database
- `npm run dev` - Start the development server

## Sample Data

The seeding script will create:

### Users (3):
- **john@example.com** / password123
- **jane@example.com** / password123  
- **mike@example.com** / password123

### Recipes (6):
- Classic Pancakes (Breakfast)
- Grilled Chicken Breast (Main Course)
- Caesar Salad (Salad)
- Chocolate Chip Cookies (Dessert)
- Beef Stir Fry (Main Course)
- Greek Yogurt Parfait (Breakfast)

### Meal Plans (3):
- Week 1 Meal Plan (John)
- Week 2 Meal Plan (Jane)
- Healthy Week (Mike)

## Troubleshooting

### Connection Issues:
- Make sure MongoDB is running
- Check your connection string in `.env.local`
- Verify network access settings (for Atlas)
- Ensure firewall allows MongoDB connections

### Permission Issues:
- Make sure your database user has read/write permissions
- Check if the database name is correct in the connection string

### Port Issues:
- Default MongoDB port is 27017
- Make sure no other application is using this port
