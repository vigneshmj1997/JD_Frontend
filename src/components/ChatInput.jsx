import React, { useState } from 'react';
import { TextField, Box, List, ListItem, ListItemText, Typography, IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh'; // Import the refresh icon

const ChatInput = ({ onSendMessage, suggestions = [] }) => {
    const [inputValue, setInputValue] = useState('');
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);

    const handleInputChange = (event) => {
        const value = event.target.value;
        setInputValue(value);

        // Split the input by spaces to get the last word
        const words = value.trim().split(/\s+/);
        const lastWord = words[words.length - 1];

        // Trigger suggestions for the last word if it has at least 2 characters
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
            setFilteredSuggestions([]); // Clear suggestions when the last word is less than 2 characters
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // If there are suggestions, auto-complete the first one
        if (filteredSuggestions.length > 0) {
            const firstSuggestion = filteredSuggestions[0].suggestions[0];
            if (firstSuggestion) {
                handleSuggestionClick(firstSuggestion);
            }
        } else if (inputValue.trim()) {
            // No suggestions: send the message
            onSendMessage(inputValue);
            setInputValue(''); // Clear input after sending
        }

        setFilteredSuggestions([]); // Clear suggestions after sending or selection
    };

    const handleSuggestionClick = (suggestion) => {
        // Split the input value by spaces and replace the last word with the selected suggestion
        const words = inputValue.trim().split(/\s+/);
        words[words.length - 1] = suggestion;
        const newValue = words.join(' ');

        setInputValue(newValue); // Update the input with the replaced word
        setFilteredSuggestions([]); // Clear suggestions after selection
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent form submission on Enter
            handleSubmit(event); // Call handleSubmit for both sending and auto-completing
        }
    };

    const handleRefreshClick = () => {
        onSendMessage("refresh"); // Call onSendMessage with "refresh" to restart the chat
        setInputValue(''); // Clear the input after refresh
    };

    return (
        <form onSubmit={handleSubmit} style={{ width: '100%', position: 'relative' }}>
            <TextField
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown} // Handle Enter key
                fullWidth
                placeholder="Type your message or click the refresh icon to restart..."
                variant="outlined"
                autoComplete="off"
                style={{ borderRadius: '8px' }} // Rounded corners for the input
            />
            <IconButton
                onClick={handleRefreshClick}
                style={{
                    position: 'absolute',
                    right: '10px',
                    top: '10px',
                    color: '#1976d2', // Primary color
                }}
            >
                <RefreshIcon />
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
                        bottom: '100%', // Position the box above the input
                        marginBottom: '8px', // Add some space between suggestions and input
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
