import User from "../models/user.model.js";
import Message from "../models/message.model.js";

import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error in getUsersForSidebar: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId },
            ],
        });

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        console.log("📨 SendMessage called:");
        console.log("- Text:", text ? text.substring(0, 50) + "..." : "No text");
        console.log("- Image:", image ? "Image data received (length: " + image.length + ")" : "No image");
        console.log("- Receiver ID:", receiverId);
        console.log("- Sender ID:", senderId);

        let imageUrl;
        if (image) {
            console.log("🖼️ Uploading image to Cloudinary...");
            console.log("🖼️ Image data starts with:", image.substring(0, 50));
            try {
                // Upload base64 image to cloudinary
                const uploadResponse = await cloudinary.uploader.upload(image, {
                    resource_type: "auto",
                    folder: "chat-images",
                });
                imageUrl = uploadResponse.secure_url;
                console.log("✅ Image uploaded successfully:", imageUrl);
                console.log("✅ Upload response details:", {
                    public_id: uploadResponse.public_id,
                    format: uploadResponse.format,
                    width: uploadResponse.width,
                    height: uploadResponse.height
                });
            } catch (cloudinaryError) {
                console.error("❌ Cloudinary upload error details:");
                console.error("- Error message:", cloudinaryError.message);
                console.error("- Error code:", cloudinaryError.http_code);
                console.error("- Full error:", cloudinaryError);
                throw new Error("Image upload failed: " + cloudinaryError.message);
            }
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        console.log("💾 Saving message to database...");
        await newMessage.save();
        console.log("✅ Message saved successfully");

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            console.log("📡 Sending message via socket to:", receiverSocketId);
            io.to(receiverSocketId).emit("newMessage", newMessage);
        } else {
            console.log("📡 Receiver not online, skipping socket emission");
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.error("❌ Error in sendMessage controller:", error.message);
        console.error("❌ Full error:", error);
        res.status(500).json({ error: "Internal server error: " + error.message });
    }
};