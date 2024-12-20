import React, { useState, useEffect } from 'react';
import { Box, Paper, CircularProgress, Typography, useMediaQuery, AppBar, Toolbar, FormControlLabel, Switch } from '@mui/material';
import ChatWindow from './ChatWindow';
import ChatInput from './ChatInput';
import MarkdownDisplay from './MarkdownDisplay';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const ChatPage = () => {
    const [messages, setMessages] = useState(() => {
        const savedMessages = localStorage.getItem('messages');
        return savedMessages ? JSON.parse(savedMessages) : [];
    });
    const [threadId, setThreadId] = useState(() => {
        const savedThreadId = localStorage.getItem('threadId');
        return savedThreadId || null;
    });
    const [suggestions, setSuggestions] = useState([]);
    const [markdownContent, setMarkdownContent] = useState('');
    const [showMarkdown, setShowMarkdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [isArabic, setIsArabic] = useState(false);

    const predefinedSuggestions = {
        // Your predefined suggestions go here
        list_of_required_skills: [
            "Active Listening",
            "Adaptability",
            "Adobe Creative Suite",
            "Agile Project Management",
            "Analytical Thinking",
            "Android Development",
            "Angular Development",
            "Animal Care",
            "Animation",
            "App Development",
            "Artificial Intelligence (AI)",
            "Attention to Detail",
            "AutoCAD",
            "Automotive Repair",
            "B2B Sales",
            "B2C Sales",
            "Backend Development",
            "Banking",
            "Basic Math",
            "Big Data Analytics",
            "Blogging",
            "Body Language Reading",
            "Bookkeeping",
            "Budget Management",
            "Building Information Modeling (BIM)",
            "Business Analysis",
            "Business Development",
            "Business Intelligence (BI)",
            "Business Strategy",
            "C++ Programming",
            "Calculus",
            "Calligraphy",
            "Camera Operation",
            "Carpentry",
            "Cash Handling",
            "Change Management",
            "Chatbot Development",
            "Childcare",
            "Cloud Computing",
            "CMS Management",
            "Coaching",
            "Coding",
            "Collaboration",
            "Communication Skills",
            "Community Management",
            "Complaint Resolution",
            "Conflict Resolution",
            "Content Creation",
            "Content Marketing",
            "Content Strategy",
            "Continuous Improvement",
            "Contract Negotiation",
            "Copywriting",
            "Cost Management",
            "Creative Thinking",
            "Critical Thinking",
            "Cross-Functional Collaboration",
            "Crowdfunding",
            "Customer Relationship Management (CRM)",
            "Customer Retention",
            "Customer Service",
            "Cybersecurity",
            "Data Analysis",
            "Data Entry",
            "Data Mining",
            "Data Science",
            "Database Management",
            "Decision Making",
            "Deep Learning",
            "Design Thinking",
            "Desktop Support",
            "Digital Marketing",
            "Digital Strategy",
            "Diplomacy",
            "Direct Marketing",
            "Docker",
            "Documentation",
            "Drawing",
            "Drone Operation",
            "Early Childhood Education",
            "Editing",
            "Electrical Engineering",
            "Electrical Installation",
            "Email Marketing",
            "Emotional Intelligence (EQ)",
            "Employee Engagement",
            "Employee Training",
            "Entrepreneurship",
            "Event Management",
            "Excel Spreadsheets",
            "Facilitation",
            "Facebook Ads",
            "Fashion Design",
            "Financial Analysis",
            "Financial Planning",
            "Fine Arts",
            "Fire Safety",
            "First Aid",
            "Food Preparation",
            "Forecasting",
            "Foreign Language Skills",
            "Front-End Development",
            "Fundraising",
            "Game Development",
            "Gardening",
            "Git Version Control",
            "Google Analytics",
            "Graphic Design",
            "Hardware Troubleshooting",
            "Healthcare Administration",
            "Hiring",
            "Hospitality Management",
            "HTML/CSS",
            "Human Resources (HR)",
            "Illustration",
            "Industrial Design",
            "Information Architecture",
            "Information Security",
            "Inside Sales",
            "Instagram Marketing",
            "Inventory Management",
            "iOS Development",
            "IT Security",
            "JavaScript Programming",
            "Java Programming",
            "Journalism",
            "JQuery",
            "Kanban",
            "Key Account Management",
            "Laboratory Skills",
            "Landscaping",
            "Language Translation",
            "Lead Generation",
            "Leadership",
            "Legal Compliance",
            "Life Coaching",
            "Linux Administration",
            "Logical Thinking",
            "Machine Learning",
            "Management",
            "Manufacturing",
            "Market Analysis",
            "Market Research",
            "Marketing Automation",
            "Marketing Strategy",
            "Mechanical Engineering",
            "Medical Coding",
            "Medical Terminology",
            "Mental Health Counseling",
            "Merchandising",
            "Microsoft Office Suite",
            "Mobile App Testing",
            "Multi-Tasking",
            "Negotiation Skills",
            "Network Engineering",
            "Network Security",
            "Neuroscience",
            "Node.js Development",
            "Non-Profit Management",
            "Nutrition",
            "Object-Oriented Programming (OOP)",
            "Online Advertising",
            "Online Research",
            "Operations Management",
            "Oracle Database",
            "Organizational Skills",
            "Painting",
            "Payroll Management",
            "Personal Finance",
            "Personal Training",
            "Photography",
            "PHP Programming",
            "Pinterest Marketing",
            "Podcasting",
            "Policy Analysis",
            "Presentation Skills",
            "Problem Solving",
            "Product Design",
            "Product Management",
            "Project Coordination",
            "Project Management",
            "Proofreading",
            "Public Relations",
            "Public Speaking",
            "Python Programming",
            "Quality Assurance (QA)",
            "Quality Control",
            "Quantitative Analysis",
            "React Development",
            "Recruiting",
            "Report Writing",
            "Risk Assessment",
            "Robotics",
            "Ruby on Rails Development",
            "Sales Forecasting",
            "Salesforce CRM",
            "SAP Management",
            "SEO (Search Engine Optimization)",
            "Social Media Management",
            "Software Testing"
        ],
        
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

    useEffect(() => {
        localStorage.setItem('messages', JSON.stringify(messages));
    }, [messages]);

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

                const requestData = {
                    jd: null, // Replace "string" with the actual job description value
                    language: isArabic ? "arabic" : "english",
                    user_info: {
                        user_name: "Vignesh", // Replace "string" with the actual user name
                        company_name: "Nautilus Principle", // Replace with the company name
                        company_address: "7th Floor, Burj Al Gassar Tower, Westbay, Doha,", // Replace with the company address
                        company_phone: "1234567", // Replace with the company phone
                        company_website: "https://www.nautilusprinciple.com", // Replace with the company website
                        company_email: "info@nautilusprinciple.com", // Replace with the company email
                    }
                };
                response = await fetch('https://deeble-jdassistant.com/jd/initialize', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestData),
                });

                data = await response.json();
                console.log(data)
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
                response = await fetch('https://deeble-jdassistant.com/jd/initialize', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        jd: text,
                        language: isArabic ? "arabic" : "english"
                    }),
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

                response = await fetch('https://deeble-jdassistant.com/jd/message', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        thread_id: threadId,
                        message: {
                            message_content: text,
                            groups: null,
                            language: isArabic ? "arabic" : "english"
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
                { sender: 'bot', text: isArabic ? "عذرًا، حدث خطأ ما. يرجى المحاولة مرة أخرى لاحقًا.":"Sorry, something went wrong. Please try again later.", timestamp: new Date().toISOString() },
            ]);
            console.error('Error fetching bot response:', error);
        } finally {
            setLoading(false);
        }
    };

    const isMobile = useMediaQuery('(max-width:600px)');

    const handleToggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const handleLanguageToggle = () => {
        setIsArabic(!isArabic);
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            height="100vh"
            width="100vw"
            bgcolor={darkMode ? '#333' : '#ffffff'}
        >
            {/* Fixed AppBar with blue color, chatbot icon, and language toggle */}
            <AppBar position="fixed" color="primary">
                <Toolbar>
                    {/* Chatbot icon */}
                    <AccountCircleIcon fontSize="large" style={{ marginRight: '10px' }} />
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                        Jd Builder
                    </Typography>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={isArabic}
                                onChange={handleLanguageToggle}
                                color="default"
                            />
                        }
                        label={isArabic ? "Arabic" : "English"}
                        labelPlacement="start"
                    />
                </Toolbar>
            </AppBar>

            {/* Main Content Area */}
            <Box
                display="flex"
                flexDirection={isMobile ? 'column' : 'row'}
                alignItems="stretch"
                flex="1"
                paddingTop="64px"
                paddingBottom="56px"
                overflow="hidden"
            >
                <Box
                    style={{
                        flex: isMobile ? '1 0 auto' : '0 0 55%',
                        maxWidth: isMobile ? '100%' : '700px',
                        padding: '10px',
                        overflowY: 'auto',
                        backgroundColor: darkMode ? '#424242' : '#ffffff',
                    }}
                >
                    <Paper elevation={3} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Box style={{ flexGrow: 1, overflowY: 'auto' }}>
                            <ChatWindow messages={messages} />
                            <Typography variant="caption" color="textSecondary" align="center" style={{ marginTop: '10px' }}>
                                Note: Typing "restart" will restart the bot.
                            </Typography>
                        </Box>
                    </Paper>
                </Box>

                {showMarkdown && (
                    <Box
                        style={{
                            flex: isMobile ? '1 0 auto' : '0 0 45%',
                            maxWidth: isMobile ? '100%' : '600px',
                            padding: '10px',
                            backgroundColor: darkMode ? '#616161' : '#f5f5f5',
                            overflowY: 'auto',
                            borderLeft: isMobile ? 'none' : '1px solid #ddd',
                            marginTop: isMobile ? '10px' : '0'
                        }}
                    >
                        <MarkdownDisplay content={markdownContent} />
                    </Box>
                )}
            </Box>

            {/* Fixed Chat Input Box */}
            <Box
                position="fixed"
                bottom="0"
                left="0"
                width="100%"
                bgcolor={darkMode ? '#333' : '#ffffff'}
                display="flex"
                justifyContent="center"
                boxShadow="0 -2px 5px rgba(0,0,0,0.1)"
            >
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
        </Box>
    );
};

export default ChatPage;
