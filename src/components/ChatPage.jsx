import React, { useState, useEffect } from 'react';
import { Box, Paper, CircularProgress, Typography, useMediaQuery } from '@mui/material';
import ChatWindow from './ChatWindow';
import ChatInput from './ChatInput';
import MarkdownDisplay from './MarkdownDisplay';

const ChatPage = () => {
    // Initialize messages from localStorage or default to an empty array
    const [messages, setMessages] = useState(() => {
        const savedMessages = localStorage.getItem('messages');
        return savedMessages ? JSON.parse(savedMessages) : [];
    });

    // Initialize threadId from localStorage or default to null
    const [threadId, setThreadId] = useState(() => {
        const savedThreadId = localStorage.getItem('threadId');
        return savedThreadId || null;
    });

    const [suggestions, setSuggestions] = useState([]); // Default is an empty array
    const [markdownContent, setMarkdownContent] = useState(''); // Default is an empty string
    const [showMarkdown, setShowMarkdown] = useState(false); // Default is false
    const [loading, setLoading] = useState(false); // Loading state

    const predefinedSuggestions = {
        // Your predefined suggestions go here
        job_industry: [
            "Technology", "Healthcare", "Finance", "Education", 
            "Retail", "Manufacturing", "Hospitality", "Transportation", 
            "Media", "Construction", "Government", "Non-profit", "Other",
        ],
        job_department: [
            "Engineering", "Sales", "Marketing", "Finance", 
            "Human Resources", "Operations", "Customer Service", 
            "Information Technology", "Product", "Design", "Legal", 
            "Research", "Other",
        ],
        work_schedule_types: ["Full-time", "Part-time", "Contract", "Temporary", "Internship"],
        workplace_types: ["Office", "Remote", "Hybrid", "On-Site"],
        seniority_levels: [
            "Internship", "Entry Level", "Associate", "Mid-Senior Level", 
            "Director", "Executive",
        ],
        required_documents: [
            "Resume", "Cover Letter", "Recommendation Letter", "Portfolio", "Transcript", "CV","Curriculum Vitae"
        ],
        optional_education_qualifications: [
            "BSc Computer Science",
            "BSc Physics",
            "BSc Information Technology",
            "BSc Mathematics",
            "BSc Software Engineering",
            "BSc Data Science",
            "BSc Artificial Intelligence",
            "BSc Cybersecurity",
            "BSc Computer Engineering",
            "BSc Electrical Engineering",
            "BSc Applied Mathematics",
            "BSc Statistics",
            "BSc Information Systems",
            "BEng Computer Engineering",
            "BEng Electrical and Electronic Engineering",
            "BEng Software Engineering",
            "BSc Network Engineering",
            "BSc Robotics",
            "BSc Electronics",
            "BSc Computational Science",
            "BSc Bioinformatics",
            "BSc Computational Physics",
            "BSc Game Development",
            "BSc Cloud Computing",
            "BSc Web Development",
            "BSc Mobile Application Development",
            "BSc IT Management",
            "BSc Digital Forensics",
            "BSc DevOps Engineering",
            "BSc Machine Learning",
            "BSc Computational Biology",
            "BSc Human-Computer Interaction",
            "BSc Systems Engineering",
            "BSc Database Management",
            "BSc Network Security",
            "BSc Project Management",
            "BSc Information Security",
            "BSc Data Analytics",
            "BSc IT Support",
            "BSc Geographic Information Systems (GIS)",
            "BSc Health Informatics"
        ],
        required_education_qualifications: [
            "BSc Computer Science",
            "BSc Physics",
            "BSc Information Technology",
            "BSc Software Engineering",
            "BSc Mathematics"
        ]
        
    };

    // Save messages to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('messages', JSON.stringify(messages));
    }, [messages]);

    // Save threadId to localStorage when it changes
    useEffect(() => {
        if (threadId) {
            localStorage.setItem('threadId', threadId);
        }
    }, [threadId]);

    const handleSendMessage = async (text) => {
        if (loading) return;

        setLoading(true);

        // Capture timestamp when the user sends a message
        const timestamp = new Date().toISOString();

        // Add message from user with timestamp
        const userMessage = { sender: 'user', text, timestamp };
        setMessages((prevMessages) => [...prevMessages, userMessage]);

        try {
            let response, data;

            if (text.toLowerCase() === "restart") {
                response = await fetch('https://135.236.16.196:8000/jd/initialize', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ jd: null }),
                });

                data = await response.json();

                if (data.thread_id) {
                    setThreadId(data.thread_id);
                }

                const botMessage = {
                    sender: 'bot',
                    text: data.message.message_content || 'No message content',
                    timestamp: new Date().toISOString(),
                };
                setMessages((prevMessages) => [...prevMessages, botMessage]);
                return;
            }

            if (!threadId) {
                if (text === "Hello" || text === "hello") {
                    setLoading(false);
                    return;
                }

                response = await fetch('https://135.236.16.196:8000/jd/initialize', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ jd: text }),
                });

                data = await response.json();

                if (data.thread_id) {
                    setThreadId(data.thread_id);
                }

                const botMessage = {
                    sender: 'bot',
                    text: data.message.message_content || 'No message content',
                    timestamp: new Date().toISOString(),
                };
                setMessages((prevMessages) => [...prevMessages, botMessage]);
            } else {
                response = await fetch('https://135.236.16.196:8000/jd/message', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        thread_id: threadId,
                        message: {
                            message_content: text,
                            groups: null,
                        },
                    }),
                });

                data = await response.json();

                if (data.message.keys) {
                    const newSuggestions = data.message.keys.map(key => ({
                        category: key,
                        suggestions: predefinedSuggestions[key] || []
                    }));
                    setSuggestions(newSuggestions);
                }

                const regex = /```([\s\S]*?)```/;
                const match = data.message.message_content.match(regex);

                if (match) {
                    setMarkdownContent(match[1].trim());
                    setShowMarkdown(true);
                    
                    const nonMarkdownText = data.message.message_content.replace(regex, '').trim();
                    if (nonMarkdownText) {
                        const botMessage = {
                            sender: 'bot',
                            text: nonMarkdownText || 'No non-markdown text',
                            timestamp: new Date().toISOString(),
                        };
                        setMessages((prevMessages) => [...prevMessages, botMessage]);
                    }
                } else {
                    const botMessage = {
                        sender: 'bot',
                        text: data.message.message_content || 'No message content',
                        timestamp: new Date().toISOString(),
                    };
                    setMessages((prevMessages) => [...prevMessages, botMessage]);
                }
            }
        } catch (error) {
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: 'bot', text: 'Sorry, something went wrong. Please try again later.', timestamp: new Date().toISOString() },
            ]);
            console.error('Error fetching bot response:', error);
        } finally {
            setLoading(false);
        }
    };

    // Media query to detect small screens (phones)
    const isMobile = useMediaQuery('(max-width:600px)');

    return (
        <Box
            display="flex"
            flexDirection={isMobile ? 'column' : 'row'}
            alignItems="stretch"
            height="100vh"
            width="100vw"
            bgcolor="#ffffff"
            p={isMobile ? 1 : 2}
        >
            <Box
                style={{
                    flex: isMobile ? '1 0 auto' : '0 0 55%',
                    maxWidth: isMobile ? '100%' : '700px',
                    padding: '10px',
                    overflowY: 'auto',
                    backgroundColor: '#ffffff',
                }}
            >
                <Paper elevation={3} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box style={{ flexGrow: 1, overflowY: 'auto' }}>
                        <ChatWindow messages={messages} />
                        <Typography variant="caption" color="textSecondary" align="center" style={{ marginTop: '10px' }}>
                            Note: Typing "restart" will restart the bot.
                        </Typography>
                    </Box>
                    <Box width="100%" display="flex" alignItems="center">
                        {loading ? (
                            <CircularProgress size={24} />
                        ) : (
                            <ChatInput 
                                onSendMessage={handleSendMessage} 
                                suggestions={suggestions}
                                disabled={loading} 
                            />
                        )}
                    </Box>
                </Paper>
            </Box>

            {showMarkdown && (
                <Box
                    style={{
                        flex: isMobile ? '1 0 auto' : '0 0 45%',
                        maxWidth: isMobile ? '100%' : '600px',
                        padding: '10px',
                        backgroundColor: '#f5f5f5',
                        overflowY: 'auto',
                        borderLeft: isMobile ? 'none' : '1px solid #ddd',
                        marginTop: isMobile ? '10px' : '0',
                    }}
                >
                    <MarkdownDisplay content={markdownContent} />
                </Box>
            )}
        </Box>
    );
};

export default ChatPage;
