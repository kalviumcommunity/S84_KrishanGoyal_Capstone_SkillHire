const User = require('../Models/userModel');

const getUsers = async (req, res) => {
  try {
    const users = await User.find();

    if(users.length === 0){
      return res.json({
        message: "No data to return"
      })
    }

    res.status(200).json({
      success: true,
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong while fetching users'
    });
  }
};

module.exports = {getUsers}