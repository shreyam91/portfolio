require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    let admin = await User.findOne({ email: 'admin@codestreak.com' });
    
    if (!admin) {
      admin = await User.create({
        name: 'Super Admin',
        email: 'admin@codestreak.com',
        password: 'password123',
        role: 'admin',
        username: 'super_admin'
      });
      console.log('Created new admin user:', admin.email);
    } else {
      console.log('Admin user already exists:', admin.email);
      // Ensure the role is admin
      if (admin.role !== 'admin') {
        admin.role = 'admin';
        await admin.save();
        console.log('Updated role to admin');
      }
    }
    
    console.log('Login credentials:');
    console.log('Email: admin@codestreak.com');
    console.log('Password: password123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
