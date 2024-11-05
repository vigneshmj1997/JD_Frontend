// MarkdownDisplay.js
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // For GitHub Flavored Markdown (supporting tables, strikethrough, etc.)

const MarkdownDisplay = ({ content }) => {
    return (
        <div 
            style={{ 
                padding: '20px', 
                backgroundColor: '#f9f9f9', 
                borderRadius: '5px', 
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                lineHeight: '1.5',
                margin: '10px 0',
            }}
        >
            <ReactMarkdown 
                children={content} 
                remarkPlugins={[remarkGfm]} // Add any plugins you want to use
                components={{
                    h1: ({node, ...props}) => <h1 style={{ margin: '10px 0', color: '#333' }} {...props} />,
                    h2: ({node, ...props}) => <h2 style={{ margin: '10px 0', color: '#444' }} {...props} />,
                    h3: ({node, ...props}) => <h3 style={{ margin: '10px 0', color: '#555' }} {...props} />,
                    p: ({node, ...props}) => <p style={{ margin: '10px 0' }} {...props} />,
                    blockquote: ({node, ...props}) => (
                        <blockquote style={{ borderLeft: '2px solid #ccc', paddingLeft: '10px', color: '#666', margin: '10px 0', fontStyle: 'italic' }} {...props} />
                    ),
                    a: ({node, ...props}) => <a style={{ color: '#007bff', textDecoration: 'none' }} {...props} onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'} onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'} />,
                    ul: ({node, ...props}) => <ul style={{ margin: '10px 0 10px 20px', padding: '0' }} {...props} />,
                    ol: ({node, ...props}) => <ol style={{ margin: '10px 0 10px 20px', padding: '0' }} {...props} />,
                    li: ({node, ...props}) => <li style={{ margin: '5px 0' }} {...props} />,
                }}
            />
        </div>
    );
};

export default MarkdownDisplay;
