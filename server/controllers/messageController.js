const Conversation = require('../model/Conversation');

const updateMessage = async (req, res) => {
    const { messageID, username, selectedUser, newMessage } = req.body;

    if (!messageID || !username) {
        return res.status(400).json({ message: "Either messageID or username not provided" });
    }

    const foundConversation = await Conversation.findOne({ _id: selectedUser });

    if (!foundConversation) {
        return res.status(400).json({ message: "Conversation not found" });
    }

    const message = foundConversation.messages.find(message => message._id.toString() === messageID);

    if (message) {
        message.message = newMessage;
        await foundConversation.save();
    } else {
        return res.status(400).json({ message: "Message not found" });
    }

    return res.status(200).json({ message: 'Message updated successfully' });
};

const deleteMessage = async (req, res) => {
    const { messageID, selectedUser } = req.body;

    try {
        const updateResult = await Conversation.findByIdAndUpdate(
            selectedUser,
            {
                $pull: { messages: { _id: messageID } },
            },
            { new: true }
        );

        if (!updateResult) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: 'An error occurred' });
    }
};

const getAllMessages = async (req, res) => {
    try {
        const { selectedUser } = req.query;

        if (!selectedUser) {
            return res.status(400).json({ message: 'No conversation selected' });
        }

        const conversation = await Conversation.findOne({ _id: selectedUser });

        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        res.json(conversation.messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { updateMessage, deleteMessage, getAllMessages };
