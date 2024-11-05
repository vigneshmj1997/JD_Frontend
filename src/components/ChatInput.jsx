import React, { useState } from 'react';
import { TextField, Box, List, ListItem, ListItemText, Typography, IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import SendIcon from '@mui/icons-material/Send';

const ChatInput = ({ onSendMessage, suggestions = [] }) => {
    const [inputValue, setInputValue] = useState('');
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);

    const handleInputChange = (event) => {
        const value = event.target.value;
        setInputValue(value);

        const words = value.trim().split(/\s+/);
        const lastWord = words[words.length - 1];

        if (lastWord.length >= 2) {
            const filtered = suggestions
                .map(group => ({
                    category: group.category || 'Unknown Category',
                    suggestions: (group.suggestions || []).filter(suggestion =>
                        suggestion.toLowerCase().startsWith(lastWord.toLowerCase())
                    )
                }))
                .filter(group => group.suggestions.length > 0);

            setFilteredSuggestions(filtered);
        } else {
            setFilteredSuggestions([]);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (filteredSuggestions.length > 0) {
            const firstSuggestion = filteredSuggestions[0].suggestions[0];
            if (firstSuggestion) {
                handleSuggestionClick(firstSuggestion);
            }
        } else if (inputValue.trim()) {
            onSendMessage(inputValue);
            setInputValue('');
        }

        setFilteredSuggestions([]);
    };

    const handleSuggestionClick = (suggestion) => {
        const words = inputValue.trim().split(/\s+/);
        words[words.length - 1] = suggestion;
        setInputValue(words.join(' '));
        setFilteredSuggestions([]);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSubmit(event);
        }
    };

    const handleRefreshClick = () => {
        onSendMessage("restart");
        setInputValue('');
    };

    return (
        <form onSubmit={handleSubmit} style={{ width: '100%', position: 'relative', display: 'flex', alignItems: 'center' ,marginTop: "4px" }}>
            {/* Refresh Button on the left */}
            <IconButton
                onClick={handleRefreshClick}
                style={{
                    color: '#1976d2',
                    marginRight: '8px'
                }}
            >
                <RefreshIcon />
            </IconButton>
            
            {/* Input Field */}
            <TextField
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                fullWidth
                placeholder="Type your message..."
                variant="outlined"
                autoComplete="off"
                style={{ borderRadius: '8px', flex: 1 }} 
            />
            
            {/* Send Button on the right */}
            <IconButton
                onClick={handleSubmit}
                type="submit"
                style={{
                    color: '#1976d2',
                    marginLeft: '8px'
                }}
            >
                <SendIcon />
            </IconButton>

            {/* Render filtered suggestions above the input */}
            {filteredSuggestions.length > 0 && (
                <Box
                    position="absolute"
                    zIndex={1}
                    bgcolor="white"
                    borderRadius="4px"
                    boxShadow={2}
                    style={{
                        bottom: '100%',
                        marginBottom: '8px',
                        width: '100%',
                    }}
                >
                    <List>
                        {filteredSuggestions.map((group, groupIndex) => (
                            <Box key={groupIndex}>
                                <Typography
                                    variant="subtitle2"
                                    style={{
                                        padding: '8px',
                                        fontWeight: 'bold',
                                        marginRight: '8px',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {group.category}
                                </Typography>
                                {group.suggestions.map((suggestion, index) => (
                                    <ListItem
                                        button
                                        key={index}
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        style={{
                                            backgroundColor: '#f0f0f0',
                                            borderBottom: '1px solid #e0e0e0',
                                            '&:hover': {
                                                backgroundColor: '#e0e0e0',
                                            },
                                        }}
                                    >
                                        <ListItemText primary={suggestion} />
                                    </ListItem>
                                ))}
                            </Box>
                        ))}
                    </List>
                </Box>
            )}
        </form>
    );
};

export default ChatInput;
 