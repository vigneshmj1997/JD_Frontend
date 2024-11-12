import React, { useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import Face6Icon from '@mui/icons-material/Face6';

const ChatWindow = ({ messages, style }) => {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const renderMessageText = (text) => {
        return text.replace(/\\u([\dA-Fa-f]{4})\\u([\dA-Fa-f]{4})|\\u([\dA-Fa-f]{4})/g, (match, high, low, single) => {
            if (high && low) {
                // This is a surrogate pair
                const highSurrogate = parseInt(high, 16);
                const lowSurrogate = parseInt(low, 16);
                const codePoint = ((highSurrogate - 0xD800) * 0x400) + (lowSurrogate - 0xDC00) + 0x10000;
                return String.fromCodePoint(codePoint);
            } else if (single) {
                // This is a single Unicode character
                return String.fromCodePoint(parseInt(single, 16));
            }
        });
    };
    

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) {
            return "Invalid Date"; // Fallback text
        }
        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;
        return `${formattedHours}:${minutes} ${ampm}`;
    };

    return (
        <Box sx={style} style={{ overflowY: 'auto', height: '100%', padding: '16px' }}>
            {messages.map((message, index) => (
                <Box 
                    key={index} 
                    mb={2} 
                    display="flex" 
                    alignItems="flex-start"
                    flexDirection={message.sender === 'user' ? 'row-reverse' : 'row'}
                >
                    {message.sender === 'user' ? (
                        <PersonIcon sx={{ fontSize: 40, color: '#1976d2', ml: 1 }} />
                    ) : (
                        <Face6Icon sx={{ fontSize: 40, color: '#757575', mr: 1 }} />
                    )}

                    <Box display="flex" flexDirection="column" maxWidth="80%">
                        <Typography 
                            variant="caption" 
                            color="textSecondary" 
                            sx={{ mb: 0.5, fontSize: '0.75rem' }}
                        >
                            {formatTime(message.timestamp)}
                        </Typography>
                        
                        <Typography 
                            variant="body1" 
                            align={message.sender === 'user' ? 'right' : 'left'}
                            style={{
                                fontSize: '1rem',
                                lineHeight: 1.5,
                                backgroundColor: message.sender === 'user' ? '#daf4ff' : '#f0f0f0',
                                borderRadius: '18px',
                                padding: '10px 16px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                wordBreak: 'break-word',
                            }}
                        >
                            {renderMessageText(message.text)}
                        </Typography>
                    </Box>
                </Box>
            ))}
            <div ref={messagesEndRef} />
        </Box>
    );
};

export default ChatWindow;
