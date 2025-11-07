import React, { useState, useRef } from "react";
import { useChatStore } from "./Store/useChatStore";
import { Send, Image, FileText, X } from "lucide-react";

export default function MessageInput() {
  const [text, setText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const { sendMessage } = useChatStore();

  const handleFileSelect = (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    // Create preview for images
    if (type === "image" && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!text.trim() && !selectedFile) return;

    try {
      const messageData = {
        text: text.trim(),
      };

      // If there's a file, convert to base64 or handle upload
      if (selectedFile) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          if (selectedFile.type.startsWith("image/")) {
            messageData.image = reader.result;
          } else {
            messageData.file = reader.result;
            messageData.fileName = selectedFile.name;
            messageData.fileType = selectedFile.type;
          }
          
          await sendMessage(messageData);
          setText("");
          handleRemoveFile();
        };
        reader.readAsDataURL(selectedFile);
      } else {
        await sendMessage(messageData);
        setText("");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="p-4 w-full bg-base-100 border-t border-base-300 shadow-lg">
      {/* File Preview */}
      {selectedFile && (
        <div className="mb-3 p-3 bg-base-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-12 h-12 object-cover rounded-lg"
              />
            ) : (
              <div className="w-12 h-12 bg-base-300 rounded-lg flex items-center justify-center">
                <FileText size={24} className="text-base-content/60" />
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-sm font-medium text-base-content truncate max-w-[200px]">
                {selectedFile.name}
              </span>
              <span className="text-xs text-base-content/60">
                {(selectedFile.size / 1024).toFixed(2)} KB
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemoveFile}
            className="btn btn-ghost btn-sm btn-circle hover:bg-error/20 hover:text-error"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        {/* Image Upload Button */}
        <button
          type="button"
          onClick={() => imageInputRef.current?.click()}
          className="btn btn-ghost btn-circle btn-sm hover:bg-primary/10 hover:text-primary transition-all duration-200"
          title="Add image"
        >
          <Image size={20} />
        </button>
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleFileSelect(e, "image")}
          className="hidden"
        />

        {/* File Upload Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="btn btn-ghost btn-circle btn-sm hover:bg-primary/10 hover:text-primary transition-all duration-200"
          title="Add file"
        >
          <FileText size={20} />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt,.xls,.xlsx"
          onChange={(e) => handleFileSelect(e, "file")}
          className="hidden"
        />

        {/* Text Input */}
        <input
          type="text"
          className="flex-1 input input-bordered rounded-full input-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {/* Send Button */}
        <button
          type="submit"
          className="btn btn-circle btn-primary shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!text.trim() && !selectedFile}
          title="Send message"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}