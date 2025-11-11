'use client';

import React, { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Fade from '@mui/material/Fade';
import Slide from '@mui/material/Slide';
import Grow from '@mui/material/Grow';
import AttachmentIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';

interface FeedbackFormData {
  name: string;
  email: string;
  message: string;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'admin';
  message: string;
  timestamp: string;
  sender?: string;
  imageUrl?: string; // локальний прев'ю-URL прикріпленого зображення
}

const FeedbackChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [formData, setFormData] = useState<FeedbackFormData>({
    name: '',
    email: '',
    message: ''
  });
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [chatId, setChatId] = useState<string>('');
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentPreviewUrl, setAttachmentPreviewUrl] = useState<string | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Генеруємо унікальний Chat ID при першому відкритті
  useEffect(() => {
    if (isOpen && !chatId) {
      const newChatId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setChatId(newChatId);
    }
  }, [isOpen, chatId]);

  // Підключаємося до WebSocket
  useEffect(() => {
    if (chatId && isOpen) {
      if (process.env.NODE_ENV !== 'production') console.log(`🔌 Connecting to WebSocket with Chat ID: ${chatId}`);
      const ws = new WebSocket(`ws://localhost:3001/ws?chatId=${chatId}`);
      wsRef.current = ws;

      ws.onopen = () => {
        if (process.env.NODE_ENV !== 'production') {
          console.log('✅ WebSocket connected successfully');
          console.log(`📋 Chat ID: ${chatId}`);
        }
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        if (process.env.NODE_ENV !== 'production') console.log('📨 Message via WebSocket:', event.data);
        const data = JSON.parse(event.data);
        
        if (data.type === 'admin_message') {
          if (process.env.NODE_ENV !== 'production') console.log('🎉 Admin message received:', data.message);
          const newMessage: ChatMessage = {
            id: `msg_${Date.now()}`,
            type: 'admin',
            message: data.message,
            timestamp: data.timestamp,
            sender: 'Адміністратор'
          };
          setMessages(prev => [...prev, newMessage]);
          setIsWaitingForResponse(false);
        } else {
          if (process.env.NODE_ENV !== 'production') console.log('📝 Other message:', data);
        }
      };

      ws.onclose = () => {
        if (process.env.NODE_ENV !== 'production') console.log('❌ WebSocket disconnected');
        setIsConnected(false);
      };

      ws.onerror = (error) => {
        if (process.env.NODE_ENV !== 'production') console.error('❌ WebSocket error:', error);
        setIsConnected(false);
      };

      return () => {
        if (process.env.NODE_ENV !== 'production') console.log('🔌 Closing WebSocket connection');
        ws.close();
      };
    }
  }, [chatId, isOpen]);

  // Автоскрол до останнього повідомлення
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setIsMinimized(false);
    }
  };

  // const minimizeChat = () => {
  //   setIsMinimized(true);
  // };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill out all fields');
      return;
    }

    try {
      // Send message to Telegram
      let response: Response;
      if (attachment) {
        const fd = new FormData();
        fd.append('name', formData.name);
        fd.append('email', formData.email);
        fd.append('message', formData.message);
        fd.append('chatId', chatId);
        fd.append('image', attachment);
        response = await fetch('/api/telegram', {
          method: 'POST',
          body: fd,
        });
      } else {
        response = await fetch('/api/telegram', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            chatId: chatId
          }),
        });
      }

      if (response.ok) {
        // Add user's message into chat
        const userMessage: ChatMessage = {
          id: `msg_${Date.now()}`,
          type: 'user',
          message: formData.message,
          timestamp: new Date().toISOString(),
          sender: formData.name,
          imageUrl: attachmentPreviewUrl || undefined,
        };
        setMessages(prev => [...prev, userMessage]);
        
        // Clear form
        setFormData({ name: '', email: '', message: '' });
        if (attachmentPreviewUrl) {
          URL.revokeObjectURL(attachmentPreviewUrl);
        }
        setAttachment(null);
        setAttachmentPreviewUrl(null);
        setIsWaitingForResponse(true);
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send. Please try again.');
    }
  };

  const sendMessage = async () => {
    if (!currentMessage.trim() && !attachment) return;

    try {
      let response: Response;
      if (attachment) {
        const fd = new FormData();
        fd.append('name', formData.name || 'User');
        fd.append('email', formData.email || 'no-email@example.com');
        fd.append('message', currentMessage || '(photo without text)');
        fd.append('chatId', chatId);
        fd.append('image', attachment);
        response = await fetch('/api/telegram', { method: 'POST', body: fd });
      } else {
        response = await fetch('/api/telegram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name || 'User',
            email: formData.email || 'no-email@example.com',
            message: currentMessage,
            chatId: chatId
          }),
        });
      }

      if (response.ok) {
        const userMessage: ChatMessage = {
          id: `msg_${Date.now()}`,
          type: 'user',
          message: currentMessage || '',
          timestamp: new Date().toISOString(),
          sender: formData.name || 'You',
          imageUrl: attachmentPreviewUrl || undefined,
        };
        setMessages(prev => [...prev, userMessage]);
        setCurrentMessage('');
        setIsWaitingForResponse(true);
        if (attachmentPreviewUrl) {
          URL.revokeObjectURL(attachmentPreviewUrl);
        }
        setAttachment(null);
        setAttachmentPreviewUrl(null);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (attachmentPreviewUrl) {
      URL.revokeObjectURL(attachmentPreviewUrl);
    }
    setAttachment(file);
    setAttachmentPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  const removeAttachment = () => {
    if (attachmentPreviewUrl) {
      URL.revokeObjectURL(attachmentPreviewUrl);
    }
    setAttachment(null);
    setAttachmentPreviewUrl(null);
  };

  return (
    <Box className="feedback-root">
      {/* Chat Window */}
      {isOpen && (
        <Fade in={isOpen} timeout={300}>
          <Grow in={isOpen} timeout={400}>
            <Box>
              <Paper elevation={6} className="feedback-paper">
            {/* Header */}
            <Box className="feedback-header">
              <Box style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Box className={`feedback-status ${isConnected ? 'feedback-status--ok' : 'feedback-status--idle'}`} />
                <Typography 
                  variant="h6" 
                  className="hipster-heading feedback-title"
                >
                  feedback
                </Typography>
                {isWaitingForResponse && (
                  <Typography 
                    variant="body2" 
                    className="hipster-heading feedback-sub"
                  >
                    (waiting for reply)
                  </Typography>
                )}
              </Box>
              <IconButton size="medium" onClick={toggleChat} className="feedback-close">
                <CloseIcon fontSize="medium" />
              </IconButton>
            </Box>

            {/* Chat Content */}
            {!isMinimized && (
              <Box className="feedback-body">
                {/* Messages Area */}
                {messages.length > 0 && (
                  <Box className="feedback-messages">
                    {messages.map((msg) => (
                      <Box key={msg.id} className={`feedback-row ${msg.type === 'user' ? 'feedback-row--right' : ''}`}>
                        <Box className={`feedback-bubble ${msg.type === 'user' ? 'feedback-bubble--user' : 'feedback-bubble--admin'}`}>
                          <Typography 
                            variant="caption" 
                            className="hipster-heading feedback-sender"
                          >
                            {msg.sender}
                          </Typography>
                          {msg.imageUrl && (
                            <Box style={{ marginBottom: 8 }}>
                              <img src={msg.imageUrl} alt="attached" className="feedback-attach-img" />
                            </Box>
                          )}
                          {msg.message && (
                            <Box className="hipster-heading feedback-text">
                              {msg.message}
                            </Box>
                          )}
                          <Typography 
                            variant="caption" 
                            className="hipster-heading feedback-time"
                          >
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                    <div ref={messagesEndRef} />
                  </Box>
                )}

                {/* Input Area */}
                <Divider />
                <Box className="feedback-input-wrap">
                  {messages.length === 0 ? (
                    // Initial Form
                    <Box 
                      component="form" 
                      onSubmit={handleSubmit}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.125rem',
                        '& .MuiTextField-root': {
                          margin: 0,
                          width: '100%'
                        },
                        '& .MuiFormControl-root': {
                          margin: 0,
                          width: '100%'
                        }
                      }}
                    >
                      <Typography 
                        variant="body2" 
                        className="hipster-heading feedback-initial-title"
                        sx={{ marginBottom: 0, paddingBottom: '0.5rem' }}
                      >
                        questions? we happy to help! 😊
                      </Typography>
                      <TextField 
                        name="name" 
                        value={formData.name} 
                        onChange={handleInputChange} 
                        size="small" 
                        placeholder={'your name'} 
                        required 
                        fullWidth 
                        className="input input--light"
                        sx={{ margin: 0 }}
                      />
                      <TextField 
                        name="email" 
                        type="email" 
                        value={formData.email} 
                        onChange={handleInputChange} 
                        size="small" 
                        placeholder="your@email.com" 
                        required 
                        fullWidth
                        className="input input--light"
                        sx={{ margin: 0 }}
                      />
                      <TextField 
                        name="message" 
                        value={formData.message} 
                        onChange={handleInputChange} 
                        size="small" 
                        placeholder="describe your question or suggestion..." 
                        multiline 
                        minRows={3} 
                        required 
                        fullWidth
                        className="input input--light"
                        sx={{ margin: 0 }}
                      />
                      <Button 
                        type="submit" 
                        className="btn btn--dark btn--block feedback-send"
                        fullWidth
                        sx={{ margin: 0 }}
                      >
                        start chat
                      </Button>
                    </Box>
                  ) : (
                    // Chat Input
                    <>
                      <Box style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <TextField
                          value={currentMessage}
                          onChange={(e) => setCurrentMessage(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); sendMessage(); } }}
                          placeholder="type a message..."
                          size="small"
                          fullWidth
                          className="input input--light"
                        />
                        <IconButton component="label" size="small" title="Attach photo" aria-label="Attach photo" className="feedback-attach">
                          <input type="file" accept="image/*" onChange={handleFileChange} hidden />
                          <Box component="svg" width={16} height={16} viewBox="0 0 24 24" fill="none" sx={{ color: 'inherit' }}>
                            <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66L9.64 16.2a2 2 0 01-2.83-2.83l8.49-8.49" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                          </Box>
                        </IconButton>
                        <Button 
                          onClick={sendMessage}
                          disabled={!currentMessage.trim() && !attachment}
                          className="btn btn--dark"
                          size="medium"
                          endIcon={
                            <Box component="svg" width={16} height={16} viewBox="0 0 24 24" fill="none" sx={{ color: 'inherit' }}>
                              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                            </Box>
                          }
                        >
                          send
                        </Button>
                      </Box>
                      {attachment && (
                        <Box className="feedback-attach-box">
                          <Box style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
                            {attachmentPreviewUrl && (
                              <img src={attachmentPreviewUrl} alt="preview" style={{ width: '2.5rem', height: '2.5rem', objectFit: 'cover', border: '2px solid #2c2c2c' }} />
                            )}
                            <Typography 
                              variant="caption" 
                              className="hipster-heading feedback-attach-caption"
                              noWrap
                            >
                              photo attached: {attachment.name}
                            </Typography>
                          </Box>
                          <Button 
                            size="small" 
                            variant="text" 
                            onClick={removeAttachment} 
                            className="hipster-heading feedback-remove-btn"
                          >
                            remove
                          </Button>
                        </Box>
                      )}
                    </>
                  )}
                </Box>
              </Box>
            )}
              </Paper>
            </Box>
          </Grow>
        </Fade>
      )}

      {/* Floating Button - hidden when chat is open */}
      {!isOpen && (
        <Grow in={!isOpen} timeout={500}>
          <Box onClick={toggleChat} className="feedback-fab">
            <Box component="svg" width={32} height={32} viewBox="0 0 24 24" fill="none" sx={{ color: 'inherit' }}>
              <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
            </Box>
          </Box>
        </Grow>
      )}
    </Box>
  );
};

export default FeedbackChat;
