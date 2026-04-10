import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const NAV_LINKS = [
    { label: 'Home', to: '/' },
    { label: 'Explore', to: '/search' },
    { label: 'About', to: '#' },
];

export default function Navbar() {
    const location = useLocation();

    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="fixed top-0 inset-x-0 z-50 h-16 flex items-center bg-white/5 backdrop-blur-md border-b border-white/10"
        >
            <div className="max-w-6xl mx-auto px-6 w-full flex justify-between items-center">
                {/* Logo */}
                <Link
                    to="/"
                    className="text-white font-semibold text-base tracking-tight hover:opacity-70"
                >
                    Synchronicity
                </Link>

                {/* Nav links */}
                <nav className="flex items-center gap-6">
                    {NAV_LINKS.map(({ label, to }) => {
                        const active = location.pathname === to;
                        return (
                            <Link
                                key={label}
                                to={to}
                                className={`text-sm font-medium ${active
                                    ? 'text-white'
                                    : 'text-gray-500 hover:text-gray-200'
                                    }`}
                            >
                                {label}
                            </Link>
                        );
                    })}
                </nav>

                {/* CTA */}
                <button className="text-sm font-medium px-4 py-2 rounded-lg bg-white text-black hover:bg-gray-200 hover:shadow-md">
                    Get Started
                </button>
            </div>
        </motion.header>
    );
}
