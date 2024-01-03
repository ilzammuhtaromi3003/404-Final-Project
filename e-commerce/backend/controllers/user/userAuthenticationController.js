const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require("../../prisma/generated/client");
const prisma = new PrismaClient();

function generateAffiliateCode(length) {
  const characters = '0123456789';
  let code = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }

  return code;
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

const registerUser = async (req, res) => {
  console.log('Request Body:', req.body);
  const { full_name, password, email, affiliateCodeInput = "" } = req.body;

  try {
    // Validate password length
    if (password.length < 6) {
      console.log('Password validation failed');
      return res.status(422).json({ message: "Password must be at least 6 characters long" });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      console.log('Email validation failed');
      return res.status(422).json({ message: "Invalid email format" });
    }

    // Check if a user with the provided email already exists
    const existingUser = await prisma.user.findFirst({
      where: { email },
    });

    if (existingUser) {
      console.log('User with email already exists');
      return res.status(400).json({ message: "Email is already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let affiliateCode;
    let affiliateUsage = false;

    if (affiliateCodeInput.trim() !== '') {
      // Check if the provided affiliate code exists in the database
      const referredUser = await prisma.user.findFirst({
        where: { affiliate_code: affiliateCodeInput },
      });

      if (referredUser) {
        affiliateCode = generateAffiliateCode(6);
        affiliateUsage = true;
      } else {
        console.log('Invalid affiliate code');
        return res.status(400).json({ message: "Invalid affiliate code" });
      }
    }

    // If the affiliate code is not provided or is invalid, generate a new one
    if (!affiliateCode) {
      affiliateCode = generateAffiliateCode(6);
    }

    console.log('Creating user with the following data:', { full_name, email, affiliateCode, affiliateUsage });

    const user = await prisma.user.create({
      data: {
        full_name,
        password: hashedPassword,
        email,
        affiliate_code: affiliateCode,
        affiliate_usage: affiliateUsage,
      },
    });

    console.log('User created successfully:', user);

    res.json({ user });
  } catch (error) {
    console.error('Error in registerUser:', error);

    // Check for specific Prisma validation errors
    if (error.code === 'P2025') {
      console.error('Validation errors:', error.meta?.cause);

      console.error('Full error:', error);

      return res.status(422).json({ message: "Validation failed. Please check your input data." });
    }

    res.status(500).json({ message: "Internal Server Error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { password, email } = req.body;
    const user = await prisma.user.findFirst({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET || 'your-default-secret');
    res.json({ token, user }); // Include user data in the response
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

  
const logoutUser = async (req, res) => {
  try {
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

  
const viewProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userId = req.user.userId;

    const userProfile = await prisma.user.findUnique({
      where: { user_id: userId },
      include: {
        user_addresses: true,
      },
    });

    if (!userProfile) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user_profile: userProfile });
  } catch (error) {
    console.error('View profile error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

  
const updateAddress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { province_id, province_name, city_id, city_name, postal_code } = req.body;

    const existingAddress = await prisma.userAddress.findFirst({
      where: {
        user_id: userId,
      },
    });

    const updatedAddress = existingAddress
      ? await prisma.userAddress.update({
          where: {
            user_address_id: existingAddress.user_address_id,
          },
          data: {
            province_id,
            province_name,
            city_id,
            city_name,
            postal_code,
            updated_at: new Date(),
          },
        })
      : await prisma.userAddress.create({
          data: {
            user_id: userId,
            province_id,
            province_name,
            city_id,
            city_name,
            postal_code,
          },
        });

    res.json({ user_address: updatedAddress, message: 'Address updated successfully' });
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  updateAddress,
  viewProfile,
};

