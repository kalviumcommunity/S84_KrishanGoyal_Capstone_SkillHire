const Chat = require('../Models/chatModel');
const User = require('../Models/userModel');
const ProProject = require('../Models/proProjectModel');
const GoProject = require('../Models/goProjectModel');

exports.initializeChat = async (req, res) => {
  try {
    const { projectId, projectType, workerId } = req.body;
    const clientId = req.user._id;

    if (!projectId || !projectType || !workerId) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    // Validate project type
    if (projectType !== 'ProProject' && projectType !== 'GoProject') {
      return res.status(400).json({ error: "Invalid project type" });
    }

    // Load the project based on type
    let project;
    if (projectType === 'ProProject') {
      project = await ProProject.findById(projectId);
    } else {
      project = await GoProject.findById(projectId);
    }

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Check if user is authorized (client should be project owner)
    const postedById = project.postedBy?._id ? project.postedBy._id.toString() : 
                     (typeof project.postedBy === 'string' ? project.postedBy : null);
    
    if (!postedById || postedById !== clientId.toString()) {
      return res.status(403).json({ error: "Not authorized to start this chat" });
    }

    // Check if worker exists
    const worker = await User.findById(workerId);
    if (!worker) {
      return res.status(404).json({ error: "Worker not found" });
    }

    // Check if a chat already exists
    const existingChat = await Chat.findOne({
      projectId,
      projectType,
      client: clientId,
      worker: workerId
    });

    if (existingChat) {
      const populatedChat = await Chat.findById(existingChat._id)
        .populate('client', 'fullName email profileImageUrl')
        .populate('worker', 'fullName email profileImageUrl')
        .populate({
          path: 'projectId',
          model: projectType === 'ProProject' ? 'ProProject' : 'GoProject',
          select: 'title'
        });
      
      return res.status(200).json({ chat: populatedChat });
    }

    // Create new chat
    const newChat = new Chat({
      projectId,
      projectType,
      client: clientId,
      worker: workerId,
      initiatedBy: clientId
    });

    await newChat.save();

    // Populate fields for response
    const populatedChat = await Chat.findById(newChat._id)
      .populate('client', 'fullName email profileImageUrl')
      .populate('worker', 'fullName email profileImageUrl')
      .populate({
        path: 'projectId',
        model: projectType === 'ProProject' ? 'ProProject' : 'GoProject',
        select: 'title'
      });

    res.status(201).json({ chat: populatedChat });
    
  } catch (error) {
    console.error('Error initializing chat:', error);
    res.status(500).json({ error: "Server error creating chat" });
  }
};

exports.getUserChats = async (req, res) => {
  try {
    const userId = req.user._id;

    const chats = await Chat.find({
      $or: [
        { client: userId },
        { worker: userId }
      ]
    })
    .populate('client', 'fullName email profileImageUrl')
    .populate('worker', 'fullName email profileImageUrl')
    .populate({
      path: 'projectId',
      refPath: 'projectType',
      select: 'title'
    })
    .sort({ 'lastMessage.timestamp': -1 });

    res.status(200).json({ chats });
  } catch (error) {
    console.error('Error getting user chats:', error);
    res.status(500).json({ error: "Server error fetching chats" });
  }
};

exports.getChatById = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user._id;

    const chat = await Chat.findById(chatId)
      .populate('client', 'fullName email profileImageUrl')
      .populate('worker', 'fullName email profileImageUrl')
      .populate({
        path: 'projectId',
        refPath: 'projectType',
        select: 'title'
      });

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    // Check if user is a participant
    if (chat.client._id.toString() !== userId.toString() && 
        chat.worker._id.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Not authorized to access this chat" });
    }

    res.status(200).json({ chat });
  } catch (error) {
    console.error('Error getting chat:', error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user._id;
    
    const chat = await Chat.findById(chatId);
    
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }
    
    if (chat.client.toString() !== userId.toString() && 
        chat.worker.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Not authorized to view these messages" });
    }
    
    const Message = require('../Models/messageModel');
    const messages = await Message.find({ chatId })
      .populate('sender', 'fullName email profileImageUrl')
      .sort({ createdAt: 1 });
      
    res.status(200).json({ messages });
  } catch (error) {
    console.error('Error getting chat messages:', error);
    res.status(500).json({ error: "Server error" });
  }
};