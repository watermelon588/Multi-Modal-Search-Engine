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
            initial={{ y: -24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 50,
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(10, 10, 18, 0.55)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            }}
        >
            <div style={{
                maxWidth: '1152px',
                margin: '0 auto',
                padding: '0 24px',
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>

                {/* Logo */}
                <Link
                    to="/"
                    style={{
                        fontSize: '15px',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        textDecoration: 'none',
                        background: 'linear-gradient(#ffffff 0%, #ffffffff 60%, #ffffffff 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        transition: 'opacity 0.2s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                    Synchronicity
                </Link>

                {/* Nav links */}
                <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                    {NAV_LINKS.map(({ label, to }) => {
                        const active = location.pathname === to;
                        return (
                            <Link
                                key={label}
                                to={to}
                                style={{
                                    fontSize: '13.5px',
                                    fontWeight: active ? 600 : 400,
                                    color: active ? '#ffffff' : 'rgba(255,255,255,0.5)',
                                    textDecoration: 'none',
                                    letterSpacing: '0.01em',
                                    transition: 'color 0.2s ease, font-weight 0.2s ease',
                                    position: 'relative',
                                }}
                                onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'rgba(255,255,255,0.9)'; }}
                                onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
                            >
                                {label}
                                {active && (
                                    <span style={{
                                        position: 'absolute',
                                        bottom: '-4px',
                                        left: '0',
                                        right: '0',
                                        height: '2px',
                                        borderRadius: '999px',
                                        background: 'linear-gradient( #ffffffff, #ffffffff)',
                                    }} />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* CTA Button */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        padding: '7px 18px',
                        borderRadius: '999px',
                        border: 'none',
                        cursor: 'pointer',
                        letterSpacing: '0.01em',
                        background: 'linear-gradient(135deg, #fbfbfbff 0%, #ffffffff 100%)',
                        color: '#000000ff',
                        transition: 'box-shadow 0.25s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0  rgba(139, 92, 246, 0.65), 0 4px 16px rgba(0,0,0,0.4)'}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0  rgba(139, 92, 246, 0.45), 0 2px 8px rgba(0,0,0,0.3)'}
                >
                    Get Started
                </motion.button>

            </div>
        </motion.header>
    );
}
