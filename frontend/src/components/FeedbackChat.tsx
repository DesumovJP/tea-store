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
    <Box sx={{ position: 'fixed', bottom: '5%', right: '1rem', zIndex: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, maxWidth: 'calc(100vw - 2rem)', overflow: 'hidden' }}>
      {/* Chat Window */}
      {isOpen && (
        <Fade in={isOpen} timeout={300}>
          <Grow in={isOpen} timeout={400}>
            <Box>
              <Paper elevation={6} sx={{ 
                width: { xs: 'calc(100vw - 2rem)', sm: '420px', md: '450px' }, 
                maxWidth: { xs: 'calc(100vw - 2rem)', sm: '420px', md: '450px' },
                overflow: 'hidden',
                borderRadius: 0, 
                border: '3px solid', 
                borderColor: '#2c2c2c', 
                boxShadow: '4px 4px 0px #66bb6a, 0 8px 32px rgba(0, 0, 0, 0.2)',
                maxHeight: '90vh',
                minHeight: '400px',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: '#ffffff'
              }}>
            {/* Header */}
            <Box sx={{ 
              bgcolor: '#f8f9fa', 
              px: '6%', 
              py: '4%', 
              borderBottom: '3px solid', 
              borderColor: '#2c2c2c', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between' 
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ 
                  width: 12, 
                  height: 12, 
                  borderRadius: '50%', 
                  bgcolor: isConnected ? '#66bb6a' : '#9e9e9e',
                  border: '2px solid #2c2c2c'
                }} />
                <Typography 
                  variant="h6" 
                  className="hipster-heading"
                  sx={{ 
                    fontWeight: 300, 
                    lineHeight: 0.9, 
                    color: '#1a1a1a', 
                    fontSize: '1.125rem',
                    fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                    letterSpacing: '-0.02em',
                    textTransform: 'lowercase'
                  }}
                >
                  feedback
                </Typography>
                {isWaitingForResponse && (
                  <Typography 
                    variant="body2" 
                    className="hipster-heading"
                    sx={{ 
                      color: '#666666', 
                      fontSize: '0.875rem',
                      fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                      letterSpacing: '-0.02em',
                      textTransform: 'lowercase',
                      fontWeight: 300
                    }}
                  >
                    (waiting for reply)
                  </Typography>
                )}
              </Box>
              <IconButton 
                size="medium" 
                onClick={toggleChat} 
                sx={{ 
                  color: '#1a1a1a',
                  border: '2px solid #2c2c2c',
                  borderRadius: 0,
                  '&:hover': {
                    bgcolor: '#66bb6a',
                    color: '#ffffff',
                    borderColor: '#66bb6a'
                  }
                }}
              >
                <CloseIcon fontSize="medium" />
              </IconButton>
            </Box>

            {/* Chat Content */}
            {!isMinimized && (
              <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
                {/* Messages Area */}
                {messages.length > 0 && (
                  <Box sx={{ flex: 1, p: '4%', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 1.5, minHeight: 0, maxHeight: '300px' }}>
                    {messages.map((msg) => (
                      <Box key={msg.id} sx={{ display: 'flex', justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start' }}>
                        <Box sx={{ 
                          maxWidth: 320, 
                          px: 1.5, 
                          py: 1.25, 
                          borderRadius: 0, 
                          fontSize: '0.875rem', 
                          background: msg.type === 'user' 
                            ? '#1a1a1a' 
                            : '#f8f9fa', 
                          color: msg.type === 'user' ? '#ffffff' : '#1a1a1a', 
                          border: '2px solid #2c2c2c',
                          boxShadow: '3px 3px 0px #66bb6a',
                          '& *': { color: 'inherit !important' }
                        }}>
                          <Typography 
                            variant="caption" 
                            className="hipster-heading"
                            sx={{ 
                              fontWeight: 300, 
                              display: 'block', 
                              mb: 0.5, 
                              lineHeight: 0.9, 
                              color: 'inherit !important',
                              fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                              letterSpacing: '-0.02em',
                              textTransform: 'lowercase'
                            }}
                          >
                            {msg.sender}
                          </Typography>
                          {msg.imageUrl && (
                            <Box sx={{ mb: 1 }}>
                              <img 
                                src={msg.imageUrl} 
                                alt="attached" 
                                style={{ 
                                  maxHeight: 160, 
                                  borderRadius: 0,
                                  border: '2px solid #2c2c2c'
                                }} 
                              />
                            </Box>
                          )}
                          {msg.message && (
                            <Box 
                              className="hipster-heading"
                              sx={{ 
                                color: 'inherit !important',
                                fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                letterSpacing: '-0.02em',
                                textTransform: 'lowercase',
                                fontWeight: 300
                              }}
                            >
                              {msg.message}
                            </Box>
                          )}
                          <Typography 
                            variant="caption" 
                            className="hipster-heading"
                            sx={{ 
                              opacity: 0.7, 
                              display: 'block', 
                              mt: 0.5, 
                              lineHeight: 0.9, 
                              color: 'inherit !important',
                              fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                              letterSpacing: '-0.02em',
                              textTransform: 'lowercase',
                              fontWeight: 300
                            }}
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
                <Box sx={{ p: '4%', flexShrink: 0 }}>
                  {messages.length === 0 ? (
                    // Initial Form
                    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 1.25 }}>
                  <Typography 
                    variant="body2" 
                    className="hipster-heading"
                    sx={{ 
                      textAlign: 'center', 
                      color: '#1a1a1a', 
                      pt: '1em', 
                      pb: '1em', 
                      fontSize: '1rem', 
                      fontWeight: 300,
                      fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                      letterSpacing: '-0.02em',
                      textTransform: 'lowercase'
                    }}
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
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            fontSize: '0.875rem',
                            fontFamily: '"Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                            borderRadius: 0,
                            border: '2px solid #2c2c2c',
                            '& .MuiOutlinedInput-notchedOutline': { border: 'none', borderColor: 'transparent' },
                            '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none', borderColor: 'transparent' },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none', borderColor: 'transparent' },
                            '&.Mui-focused': {
                              border: '2px solid #66bb6a',
                              boxShadow: '2px 2px 0px #2c2c2c'
                            }
                          },
                          '& .MuiInputBase-input': {
                            fontFamily: '"Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                            letterSpacing: '-0.02em',
                            textTransform: 'lowercase',
                            fontWeight: 300
                          },
                          '& .MuiInputBase-input::placeholder': {
                            fontFamily: '"Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                            letterSpacing: '-0.02em',
                            textTransform: 'lowercase',
                            fontWeight: 300,
                            opacity: 0.7
                          }
                        }}
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
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            fontSize: '0.875rem',
                            fontFamily: '"Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                            borderRadius: 0,
                            border: '2px solid #2c2c2c',
                            '& .MuiOutlinedInput-notchedOutline': { border: 'none', borderColor: 'transparent' },
                            '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none', borderColor: 'transparent' },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none', borderColor: 'transparent' },
                            '&.Mui-focused': {
                              border: '2px solid #66bb6a',
                              boxShadow: '2px 2px 0px #2c2c2c'
                            }
                          },
                          '& .MuiInputBase-input': {
                            fontFamily: '"Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                            letterSpacing: '-0.02em',
                            textTransform: 'lowercase',
                            fontWeight: 300
                          },
                          '& .MuiInputBase-input::placeholder': {
                            fontFamily: '"Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                            letterSpacing: '-0.02em',
                            textTransform: 'lowercase',
                            fontWeight: 300,
                            opacity: 0.7
                          }
                        }}
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
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            fontSize: '0.875rem',
                            fontFamily: '"Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                            borderRadius: 0,
                            border: '2px solid #2c2c2c',
                            '& .MuiOutlinedInput-notchedOutline': { border: 'none', borderColor: 'transparent' },
                            '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none', borderColor: 'transparent' },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none', borderColor: 'transparent' },
                            '&.Mui-focused': {
                              border: '2px solid #66bb6a',
                              boxShadow: '2px 2px 0px #2c2c2c'
                            }
                          },
                          '& .MuiInputBase-input': {
                            fontFamily: '"Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                            letterSpacing: '-0.02em',
                            textTransform: 'lowercase',
                            fontWeight: 300
                          },
                          '& .MuiInputBase-input::placeholder': {
                            fontFamily: '"Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                            letterSpacing: '-0.02em',
                            textTransform: 'lowercase',
                            fontWeight: 300,
                            opacity: 0.7
                          }
                        }}
                      />
                      <Button 
                        type="submit" 
                        variant="contained" 
                        className="hipster-heading"
                        sx={{ 
                          mt: '0.5em', 
                          bgcolor: '#1a1a1a', 
                          color: '#ffffff !important',
                          border: '2px solid #2c2c2c',
                          boxShadow: '3px 3px 0px #66bb6a',
                          '&:hover': { 
                            bgcolor: '#66bb6a',
                            color: '#ffffff !important',
                            transform: 'translateY(-1px) translateX(-1px)',
                            boxShadow: '4px 4px 0px #1a1a1a',
                            borderColor: '#66bb6a'
                          }, 
                          py: 1.25, 
                          fontSize: '1rem', 
                          fontWeight: 800,
                          fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                          letterSpacing: '0.05em',
                          textTransform: 'uppercase',
                          borderRadius: 0,
                          '& *': { color: '#ffffff !important' }
                        }} 
                        fullWidth
                      >
                        start chat
                      </Button>
                    </Box>
                  ) : (
                    // Chat Input
                    <>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <TextField
                          value={currentMessage}
                          onChange={(e) => setCurrentMessage(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); sendMessage(); } }}
                          placeholder="type a message..."
                          size="small"
                          fullWidth
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              fontSize: '0.875rem',
                              fontFamily: '"Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                              borderRadius: 0,
                              border: '2px solid #2c2c2c',
                              '& .MuiOutlinedInput-notchedOutline': { 
                                border: 'none',
                                borderColor: 'transparent'
                              },
                              '&:hover .MuiOutlinedInput-notchedOutline': { 
                                border: 'none',
                                borderColor: 'transparent'
                              },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { 
                                border: 'none',
                                borderColor: 'transparent'
                              },
                              '&.Mui-focused': {
                                border: '2px solid #66bb6a',
                                boxShadow: '2px 2px 0px #2c2c2c'
                              }
                            },
                            '& .MuiInputBase-input': {
                              fontFamily: '"Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                              letterSpacing: '-0.02em',
                              textTransform: 'lowercase',
                              fontWeight: 300
                            },
                            '& .MuiInputBase-input::placeholder': {
                              fontFamily: '"Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                              letterSpacing: '-0.02em',
                              textTransform: 'lowercase',
                              fontWeight: 300,
                              opacity: 0.7
                            }
                          }}
                        />
                        <IconButton 
                          component="label" 
                          size="small" 
                          title="Attach photo" 
                          aria-label="Attach photo" 
                          sx={{ 
                            border: '2px solid #2c2c2c', 
                            borderRadius: 0,
                            color: '#1a1a1a',
                            '&:hover': {
                              bgcolor: '#66bb6a',
                              color: '#ffffff',
                              borderColor: '#66bb6a'
                            }
                          }}
                        >
                          <input type="file" accept="image/*" onChange={handleFileChange} hidden />
                          <Box component="svg" width={16} height={16} viewBox="0 0 24 24" fill="none" sx={{ color: 'inherit' }}>
                            <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66L9.64 16.2a2 2 0 01-2.83-2.83l8.49-8.49" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                          </Box>
                        </IconButton>
                        <Button 
                          onClick={sendMessage}
                          disabled={!currentMessage.trim() && !attachment}
                          variant="contained"
                          size="medium"
                          endIcon={
                            <Box component="svg" width={16} height={16} viewBox="0 0 24 24" fill="none" sx={{ color: 'inherit' }}>
                              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                            </Box>
                          }
                          sx={{ 
                            bgcolor: '#1a1a1a', 
                            color: '#ffffff',
                            border: '2px solid #2c2c2c',
                            boxShadow: '3px 3px 0px #66bb6a',
                            '&:hover': { 
                              bgcolor: '#66bb6a',
                              transform: 'translateY(-1px) translateX(-1px)',
                              boxShadow: '4px 4px 0px #1a1a1a',
                              borderColor: '#66bb6a'
                            },
                            textTransform: 'uppercase',
                            minWidth: 'auto',
                            px: 2,
                            py: 1,
                            borderRadius: 0,
                            fontSize: '0.875rem',
                            fontWeight: 800,
                            fontFamily: '"Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                            letterSpacing: '0.05em',
                            '&.Mui-disabled': { 
                              bgcolor: '#f5f5f5', 
                              color: '#999999',
                              borderColor: '#e0e0e0',
                              boxShadow: '2px 2px 0px #e0e0e0'
                            }
                          }}
                        >
                          send
                        </Button>
                      </Box>
                      {attachment && (
                        <Box sx={{ 
                          mt: 1.25, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between', 
                          gap: 1.25, 
                          border: '2px solid', 
                          borderColor: '#2c2c2c', 
                          borderRadius: 0, 
                          p: 1, 
                          bgcolor: '#f8f9fa',
                          boxShadow: '2px 2px 0px #66bb6a'
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                            {attachmentPreviewUrl && (
                              <img 
                                src={attachmentPreviewUrl} 
                                alt="preview" 
                                style={{ 
                                  width: 40, 
                                  height: 40, 
                                  objectFit: 'cover', 
                                  borderRadius: 0,
                                  border: '2px solid #2c2c2c'
                                }} 
                              />
                            )}
                            <Typography 
                              variant="caption" 
                              className="hipster-heading"
                              sx={{ 
                                color: '#1a1a1a',
                                fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                letterSpacing: '-0.02em',
                                textTransform: 'lowercase',
                                fontWeight: 300
                              }} 
                              noWrap
                            >
                              photo attached: {attachment.name}
                            </Typography>
                          </Box>
                          <Button 
                            size="small" 
                            variant="text" 
                            onClick={removeAttachment} 
                            className="hipster-heading"
                            sx={{
                              color: '#1a1a1a',
                              border: '2px solid #2c2c2c',
                              borderRadius: 0,
                              fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                              letterSpacing: '-0.02em',
                              textTransform: 'lowercase',
                              fontWeight: 300,
                              fontSize: '0.75rem',
                              px: 1,
                              py: 0.5,
                              '&:hover': {
                                bgcolor: '#66bb6a',
                                color: '#ffffff',
                                borderColor: '#66bb6a'
                              }
                            }}
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
          <Box
            onClick={toggleChat}
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: '#1a1a1a',
              color: '#ffffff',
              border: '2px solid #2c2c2c',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: '#66bb6a',
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
                borderColor: '#66bb6a',
              },
              '&:active': {
                transform: 'translateY(0)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              }
            }}
          >
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
