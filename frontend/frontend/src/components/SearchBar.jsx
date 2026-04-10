import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const UPLOAD_TYPES = [
    {
        id: 'image',
        accept: 'image/*',
        title: 'Upload Image',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
            </svg>
        ),
    },
    {
        id: 'audio',
        accept: 'audio/*',
        title: 'Upload Audio',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="22" />
            </svg>
        ),
    },
    {
        id: 'video',
        accept: 'video/*',
        title: 'Upload Video',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" />
            </svg>
        ),
    },
];

export default function SearchBar({ compact = false }) {
    const [query, setQuery] = useState('');
    const [activeUpload, setActiveUpload] = useState(null);
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const handleSubmit = (e) => {
        e?.preventDefault();
        if (query.trim()) {
            navigate(`/search?q=${encodeURIComponent(query.trim())}`);
        }
    };

    const handleUploadClick = (accept, id) => {
        setActiveUpload(id);
        if (fileInputRef.current) {
            fileInputRef.current.accept = accept;
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            navigate(`/search?type=file&filename=${encodeURIComponent(file.name)}&kind=${activeUpload}`);
        }
        e.target.value = '';
    };

    return (
        <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.3 }}
            className={`w-full ${compact ? 'max-w-xl' : 'max-w-2xl'} flex items-center h-14 rounded-full px-4 bg-white/10 backdrop-blur-lg border border-white/20 gap-2 hover:border-white/40 hover:bg-white/15`}
            style={{ transition: 'background-color 0.2s ease, border-color 0.2s ease' }}
        >
            {/* Search icon */}
            <div className="text-gray-400 shrink-0 pl-1">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
            </div>

            {/* Input */}
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={compact ? 'Search again...' : 'Search anything...'}
                className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder:text-white-100"
            />

            {/* Divider */}
            <div className="w-px h-5 bg-white/15 shrink-0" />

            {/* Upload buttons */}
            <div className="flex items-center gap-1 shrink-0">
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
                {UPLOAD_TYPES.map(({ id, accept, title, icon }) => (
                    <button
                        key={id}
                        type="button"
                        title={title}
                        onClick={() => handleUploadClick(accept, id)}
                        className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                    >
                        {icon}
                    </button>
                ))}
            </div>

            {/* Divider */}
            <div className="w-px h-5 bg-white/15 shrink-0" />

            {/* Submit */}
            <button
                type="submit"
                disabled={!query.trim()}
                className="px-4 py-1.5 rounded-full text-sm font-medium bg-white text-black hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shrink-0"
            >
                Search
            </button>
        </motion.form>
    );
}
