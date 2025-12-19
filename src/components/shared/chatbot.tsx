'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  ImageIcon,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSendChatMessage, useGetChatHistory } from '@/queries/chatbot.query';
import { toast } from '@/components/ui/use-toast';
import UploadImage from './upload-image';

interface ChatMessage {
  id: string;
  message: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  imageUrl?: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Queries
  const {
    data: chatHistory,
    isLoading: isLoadingHistory,
    refetch: refetchHistory
  } = useGetChatHistory(1);
  const { mutateAsync: sendMessage, isPending: isSendingMessage } =
    useSendChatMessage();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history when opening chatbot
  useEffect(() => {
    if (isOpen && chatHistory && messages.length === 0) {
      const historyMessages: ChatMessage[] = [];

      if (chatHistory.data && Array.isArray(chatHistory.data)) {
        chatHistory.data.forEach((item: any, index: number) => {
          // Add user message
          historyMessages.push({
            id: `history-user-${index}`,
            message: item.userMessage,
            sender: 'user',
            timestamp: new Date(item.timestamp)
          });

          // Add bot response
          historyMessages.push({
            id: `history-bot-${index}`,
            message: item.botResponse,
            sender: 'bot',
            timestamp: new Date(item.timestamp)
          });
        });
      }

      if (historyMessages.length === 0) {
        // Add welcome message if no history
        historyMessages.push({
          id: 'welcome',
          message:
            'Xin chào! Tôi là trợ lý ảo của cửa hàng hoa. Tôi có thể giúp bạn tìm hiểu về các loại hoa và tư vấn cho bạn. Bạn cần hỗ trợ gì?',
          sender: 'bot',
          timestamp: new Date()
        });
      }

      setMessages(historyMessages);
    } else if (isOpen && !chatHistory && !isLoadingHistory) {
      // Add welcome message if no history data
      setMessages([
        {
          id: 'welcome',
          message:
            'Xin chào! Tôi là trợ lý ảo của cửa hàng hoa. Tôi có thể giúp bạn tìm hiểu về các loại hoa và tư vấn cho bạn. Bạn cần hỗ trợ gì?',
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
    }
  }, [isOpen, chatHistory, messages.length, isLoadingHistory]);

  const handleSendMessage = async () => {
    if ((!inputMessage.trim() && !uploadedImageUrl) || isSendingMessage) return;

    // Create display message
    let displayMessage = inputMessage.trim();

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      message: displayMessage || 'Hãy phân tích hình ảnh này',
      sender: 'user',
      timestamp: new Date(),
      imageUrl: uploadedImageUrl || undefined
    };

    setMessages((prev) => [...prev, userMessage]);

    const messageToSend = inputMessage.trim() || 'Hãy phân tích hình ảnh này';
    const imageToSend = uploadedImageUrl;

    // Clear inputs
    setInputMessage('');
    setUploadedImageUrl('');
    setShowImageUpload(false);

    try {
      const [_, response] = await sendMessage({
        message: messageToSend,
        userId: 1,
        imageUrl: imageToSend || undefined
      });
      console.log(response);

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        message: response.message,
        sender: 'bot',
        timestamp: new Date(response.timestamp)
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        message: 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMessage]);

      toast({
        title: 'Lỗi gửi tin nhắn',
        description: 'Không thể gửi tin nhắn. Vui lòng thử lại.',
        variant: 'destructive'
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleRemoveImage = () => {
    setUploadedImageUrl('');
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            // Refetch history when opening
            refetchHistory();
          }
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-2xl transition-all duration-300 hover:shadow-pink-500/50"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 flex h-[600px] w-[400px] flex-col rounded-2xl bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center gap-3 rounded-t-2xl bg-gradient-to-r from-pink-500 to-rose-500 p-4 text-white">
              <Bot className="h-8 w-8" />
              <div className="flex-1">
                <h3 className="font-semibold">Trợ lý hoa</h3>
                <p className="text-xs text-pink-100">Tư vấn và hỗ trợ 24/7</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              {isLoadingHistory ? (
                <div className="flex h-full flex-col items-center justify-center space-y-3">
                  <div className="flex items-center space-x-1">
                    <div className="h-3 w-3 animate-bounce rounded-full bg-pink-500 [animation-delay:-0.3s]"></div>
                    <div className="h-3 w-3 animate-bounce rounded-full bg-pink-500 [animation-delay:-0.15s]"></div>
                    <div className="h-3 w-3 animate-bounce rounded-full bg-pink-500"></div>
                  </div>
                  <span className="text-sm text-gray-500">
                    Đang tải lịch sử chat...
                  </span>
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-2 ${
                        message.sender === 'user'
                          ? 'justify-end'
                          : 'justify-start'
                      }`}
                    >
                      {message.sender === 'bot' && (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pink-100">
                          <Bot className="h-5 w-5 text-pink-600" />
                        </div>
                      )}

                      <div
                        className={`max-w-[75%] space-y-2 rounded-2xl px-4 py-2 ${
                          message.sender === 'user'
                            ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {/* Display image if exists */}
                        {message.imageUrl && (
                          <div className="mb-2">
                            <img
                              src={message.imageUrl}
                              alt="Uploaded"
                              className="h-auto max-w-full rounded-lg"
                            />
                          </div>
                        )}

                        <p className="whitespace-pre-wrap break-words text-sm">
                          {message.message}
                        </p>
                        <p
                          className={`text-xs ${
                            message.sender === 'user'
                              ? 'text-pink-100'
                              : 'text-gray-500'
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>

                      {message.sender === 'user' && (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pink-500">
                          <User className="h-5 w-5 text-white" />
                        </div>
                      )}
                    </motion.div>
                  ))}

                  {isSendingMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start gap-2"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pink-100">
                        <Bot className="h-5 w-5 text-pink-600" />
                      </div>
                      <div className="rounded-2xl bg-gray-100 px-4 py-3">
                        <div className="flex items-center space-x-1">
                          <div className="h-2 w-2 animate-bounce rounded-full bg-pink-500 [animation-delay:-0.3s]"></div>
                          <div className="h-2 w-2 animate-bounce rounded-full bg-pink-500 [animation-delay:-0.15s]"></div>
                          <div className="h-2 w-2 animate-bounce rounded-full bg-pink-500"></div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Image Preview Section - Show when image is uploaded */}
            {uploadedImageUrl && (
              <div className="border-t border-gray-200 bg-gray-50 p-3">
                <div className="relative inline-block">
                  <img
                    src={uploadedImageUrl}
                    alt="Preview"
                    className="h-20 w-20 rounded-lg border-2 border-pink-300 object-cover"
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white transition-colors hover:bg-red-600"
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-2 text-xs text-gray-600">
                  Ảnh sẽ được gửi kèm tin nhắn
                </p>
              </div>
            )}

            {/* Image Upload Modal */}
            {showImageUpload && !uploadedImageUrl && (
              <div className="border-t border-gray-200 bg-gray-50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-700">
                    Tải ảnh lên
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowImageUpload(false);
                      setUploadedImageUrl('');
                    }}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <UploadImage
                  onChange={(url) => {
                    if (typeof url === 'string') {
                      setUploadedImageUrl(url);
                      toast({
                        title: 'Thành công',
                        description: 'Ảnh đã được tải lên'
                      });
                    }
                  }}
                  accept="image/*"
                  maxFiles={1}
                />
              </div>
            )}

            {/* Input */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowImageUpload(!showImageUpload)}
                  className="shrink-0 rounded-full"
                  disabled={isSendingMessage || !!uploadedImageUrl}
                >
                  <ImageIcon className="h-5 w-5" />
                </Button>

                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    uploadedImageUrl
                      ? 'Mô tả ảnh (tùy chọn)...'
                      : 'Nhập tin nhắn...'
                  }
                  disabled={isSendingMessage}
                  className="flex-1 rounded-full border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                />

                <Button
                  onClick={handleSendMessage}
                  disabled={
                    (!inputMessage.trim() && !uploadedImageUrl) ||
                    isSendingMessage
                  }
                  className="shrink-0 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                  size="icon"
                >
                  {isSendingMessage ? (
                    <div className="flex items-center space-x-0.5">
                      <div className="h-1 w-1 animate-bounce rounded-full bg-white [animation-delay:-0.3s]"></div>
                      <div className="h-1 w-1 animate-bounce rounded-full bg-white [animation-delay:-0.15s]"></div>
                      <div className="h-1 w-1 animate-bounce rounded-full bg-white"></div>
                    </div>
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
