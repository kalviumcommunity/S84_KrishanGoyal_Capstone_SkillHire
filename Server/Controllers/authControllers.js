const bcrypt = require('bcrypt');
const User = require('../Models/userModel');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const signup = async (req, res) => {
    try {
        const { fullName, email, password, phone } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists with the given email address'
            });
        }

        const missingFields = [];
        if (!fullName) missingFields.push('fullName');
        if (!email) missingFields.push('email');
        if (!password) missingFields.push('password');

        if (missingFields.length > 0) {
            return res.status(400).json({ error: `Missing required field(s): ${missingFields.join(', ')}` });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
            phone,
            authProvider: 'local'
        });

        const token = jwt.sign(
            {
                id: newUser._id,
                email: newUser.email,
                role: newUser.role || 'client'
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None',
            maxAge: 60 * 60 * 1000,
        });

        const { password: _, ...userData } = newUser.toObject();

        res.status(201).json({
            message: 'User created successfully',
            user: userData,
            token
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        res.status(400).json({ error: error.message });
    }
};

const completeProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const {
            role,
            goSkills,
            hourlyRate,
            location,
            proSkills,
            portfolioUrl,
            minProjectRate
        } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        user.role = role;

        if (role === 'go-worker') {
            user.goSkills = goSkills;
            user.hourlyRate = hourlyRate;
            user.location = location;
            user.isAvailable = true;
        } else if (role === 'pro-worker') {
            user.proSkills = proSkills;
            user.portfolioUrl = portfolioUrl;
            user.minProjectRate = minProjectRate;
        }

        user.isProfileComplete = true;
        await user.save();

        const { password, ...userData } = user.toObject();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        });

        res.status(200).json({
            message: 'Profile completed successfully',
            token,
            user: userData
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None',
            maxAge: 60 * 60 * 1000,
        });

        const { password: _, ...userData } = user.toObject();

        return res.status(200).json({
            message: 'Login successful',
            user: userData,
            token,
            role: user.role
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};

const googleAuth = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ error: 'Google token is required' });
        }

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        if (!payload.email || !payload.name) {
            return res.status(400).json({ error: 'Invalid Google token payload' });
        }

        const { email, name, picture } = payload;

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                fullName: name,
                email,
                avatar: picture,
                isVerified: true,
                authProvider: 'google',
                role: 'client'
            });
        } else if (user.authProvider !== 'google') {
            return res.status(400).json({
                error: 'Account exists with email/password. Please login normally.'
            });
        }

        const authToken = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None',
            maxAge: 60 * 60 * 1000,
        });

        const userData = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
            isVerified: user.isVerified
        };

        res.status(200).json({
            message: 'Google authentication successful',
            user: userData,
            token: authToken
        });

    } catch (error) {
        let errorMessage = 'Google authentication failed';
        if (error.message.includes('Token used too late')) {
            errorMessage = 'Session expired. Please try again.';
        } else if (error.message.includes('Invalid token signature')) {
            errorMessage = 'Invalid authentication token.';
        }

        res.status(401).json({
            error: errorMessage,
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = {
    signup,
    completeProfile,
    login,
    getMe,
    googleAuth
};