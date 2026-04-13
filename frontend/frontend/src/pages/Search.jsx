import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import { unifiedSearch } from '../services/api';

/* ─── Animation variants ─────────────────────────────────────── */
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.05 },
    },
};

const itemVariant = {
    hidden: { opacity: 0, y: 18, filter: 'blur(4px)' },
    show: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
    },
};

/* ─── Skeleton loader ─────────────────────────────────────────── */
function SkeletonCard() {
    return (
        <div className="w-full p-5 rounded-xl border border-white/10 animate-pulse"
             style={{ background: 'rgba(255,255,255,0.04)' }}>
            <div className="h-3 w-20 rounded-full mb-3" style={{ background: 'rgba(255,255,255,0.10)' }} />
            <div className="h-5 w-3/4 rounded-full mb-2" style={{ background: 'rgba(255,255,255,0.10)' }} />
            <div className="h-3 w-2/5 rounded-full mb-3" style={{ background: 'rgba(255,255,255,0.08)' }} />
            <div className="space-y-2">
                <div className="h-3 w-full rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }} />
                <div className="h-3 w-5/6 rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }} />
            </div>
        </div>
    );
}

function SkeletonGrid() {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
            {[1,2,3,4,5,6].map(i => (
                <div key={i} className="animate-pulse rounded-xl overflow-hidden"
                     style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}>
                    <div style={{ paddingBottom: '66%', background: 'rgba(255,255,255,0.08)' }} />
                    <div style={{ padding: '10px' }}>
                        <div className="h-3 w-3/4 rounded-full" style={{ background: 'rgba(255,255,255,0.10)' }} />
                    </div>
                </div>
            ))}
        </div>
    );
}

/* ─── Arrow icon ─────────────────────────────────────────────── */
function ArrowIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M4 14 14 4M7 4h7v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

/* ─── Section header ─────────────────────────────────────────── */
function SectionHeader({ icon, title, count }) {
    return (
        <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            marginBottom: '20px', paddingBottom: '14px',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}>
            <span style={{ color: 'rgba(129,140,248,0.9)', fontSize: '18px' }}>{icon}</span>
            <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'rgba(255,255,255,0.85)', letterSpacing: '-0.01em' }}>
                {title}
            </h2>
            {count > 0 && (
                <span style={{
                    fontSize: '11px', fontWeight: 500, color: 'rgba(255,255,255,0.35)',
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)',
                    borderRadius: '999px', padding: '2px 8px',
                }}>
                    {count}
                </span>
            )}
        </div>
    );
}

/* ─── Web result card ────────────────────────────────────────── */
function WebCard({ item }) {
    return (
        <motion.a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            variants={itemVariant}
            whileHover={{ y: -2 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className="group"
            style={{
                display: 'block', position: 'relative', width: '100%',
                padding: '20px', borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.09)',
                background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)',
                cursor: 'pointer', overflow: 'hidden', textDecoration: 'none',
                transition: 'background 0.2s ease, border-color 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'; }}
        >
            {/* Left accent */}
            <div className="scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-center"
                 style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '2px', background: 'linear-gradient(to bottom, transparent, rgba(129,140,248,0.5), transparent)', borderRadius: '0 2px 2px 0' }}
            />
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Domain badge */}
                    <p style={{ fontSize: '12px', color: 'rgba(129,140,248,0.75)', marginBottom: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'monospace' }}>
                        {item.link}
                    </p>
                    {/* Title */}
                    <h3 className="group-hover:underline underline-offset-2 decoration-white/30"
                        style={{ fontSize: '16px', fontWeight: 600, color: '#fff', lineHeight: 1.3, marginBottom: '8px' }}>
                        {item.title}
                    </h3>
                    {/* Snippet */}
                    {item.snippet && (
                        <p style={{ fontSize: '14px', color: 'rgba(209,213,219,0.85)', lineHeight: 1.65 }}>
                            {item.snippet}
                        </p>
                    )}
                </div>
                <div className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200"
                     style={{ flexShrink: 0, marginTop: '4px', color: 'rgba(255,255,255,0.25)' }}>
                    <ArrowIcon />
                </div>
            </div>
        </motion.a>
    );
}

/* ─── Image card ─────────────────────────────────────────────── */
function ImageCard({ item }) {
    const [imgError, setImgError] = useState(false);
    return (
        <motion.div
            variants={itemVariant}
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            style={{
                borderRadius: '12px', overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.09)',
                background: 'rgba(255,255,255,0.04)', cursor: 'pointer',
            }}
        >
            <div style={{ position: 'relative', paddingBottom: '66%', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                {!imgError ? (
                    <img
                        src={item.image_url}
                        alt={item.title}
                        onError={() => setImgError(true)}
                        style={{
                            position: 'absolute', inset: 0,
                            width: '100%', height: '100%', objectFit: 'cover',
                            transition: 'transform 0.3s ease',
                        }}
                    />
                ) : (
                    <div style={{
                        position: 'absolute', inset: 0, display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        color: 'rgba(255,255,255,0.2)', fontSize: '12px',
                    }}>
                        No preview
                    </div>
                )}
            </div>
            <div style={{ padding: '10px 12px' }}>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.title}
                </p>
                {item.source && (
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.30)', marginTop: '3px' }}>
                        {item.source}
                    </p>
                )}
            </div>
        </motion.div>
    );
}

/* ─── Video card ─────────────────────────────────────────────── */
function VideoCard({ item }) {
    const [thumbError, setThumbError] = useState(false);
    return (
        <motion.a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            variants={itemVariant}
            whileHover={{ y: -3 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className="group"
            style={{
                display: 'flex', gap: '14px', alignItems: 'flex-start',
                padding: '14px', borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.09)',
                background: 'rgba(255,255,255,0.04)', textDecoration: 'none',
                transition: 'background 0.2s ease, border-color 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'; }}
        >
            {/* Thumbnail */}
            <div style={{
                flexShrink: 0, width: '140px', height: '88px', borderRadius: '8px',
                overflow: 'hidden', background: 'rgba(255,255,255,0.08)', position: 'relative',
            }}>
                {item.thumbnail && !thumbError ? (
                    <img src={item.thumbnail} alt={item.title} onError={() => setThumbError(true)}
                         style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                    </div>
                )}
                {/* Play overlay */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                     style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="none">
                        <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                </div>
            </div>
            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <h3 className="group-hover:underline underline-offset-2 decoration-white/30"
                    style={{ fontSize: '14px', fontWeight: 600, color: '#fff', lineHeight: 1.4, marginBottom: '6px' }}>
                    {item.title}
                </h3>
                {item.channel && (
                    <p style={{ fontSize: '12px', color: 'rgba(129,140,248,0.75)', marginBottom: '4px' }}>{item.channel}</p>
                )}
                {item.duration && (
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', padding: '2px 6px' }}>
                        {item.duration}
                    </span>
                )}
            </div>
        </motion.a>
    );
}

/* ─── News card ──────────────────────────────────────────────── */
function NewsCard({ item }) {
    return (
        <motion.a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            variants={itemVariant}
            whileHover={{ y: -2 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className="group"
            style={{
                display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
                gap: '12px', padding: '14px 16px', borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.09)',
                background: 'rgba(255,255,255,0.04)', textDecoration: 'none',
                transition: 'background 0.2s ease, border-color 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'; }}
        >
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                    {item.source && (
                        <span style={{
                            fontSize: '11px', fontWeight: 600, color: 'rgba(129,140,248,0.85)',
                            background: 'rgba(129,140,248,0.10)', border: '1px solid rgba(129,140,248,0.20)',
                            borderRadius: '999px', padding: '2px 8px',
                        }}>
                            {item.source}
                        </span>
                    )}
                    {item.date && (
                        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.30)' }}>{item.date}</span>
                    )}
                </div>
                <h3 className="group-hover:underline underline-offset-2 decoration-white/30"
                    style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.90)', lineHeight: 1.4 }}>
                    {item.title}
                </h3>
                {item.snippet && (
                    <p style={{ fontSize: '13px', color: 'rgba(209,213,219,0.70)', lineHeight: 1.55, marginTop: '5px' }}>
                        {item.snippet}
                    </p>
                )}
            </div>
            <div className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200"
                 style={{ flexShrink: 0, marginTop: '2px', color: 'rgba(255,255,255,0.25)' }}>
                <ArrowIcon />
            </div>
        </motion.a>
    );
}

/* ─── Tab button ─────────────────────────────────────────────── */
function TabButton({ id, label, icon, active, count, onClick }) {
    return (
        <button
            id={`tab-${id}`}
            onClick={() => onClick(id)}
            style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '7px 16px', borderRadius: '999px', fontSize: '13px',
                fontWeight: active ? 600 : 400, cursor: 'pointer',
                border: active ? '1px solid rgba(129,140,248,0.5)' : '1px solid rgba(255,255,255,0.09)',
                background: active ? 'rgba(129,140,248,0.15)' : 'rgba(255,255,255,0.04)',
                color: active ? 'rgba(200,200,255,0.95)' : 'rgba(255,255,255,0.45)',
                transition: 'all 0.2s ease', backdropFilter: 'blur(8px)',
            }}
            onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; }}}
            onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; }}}
        >
            <span style={{ fontSize: '14px' }}>{icon}</span>
            {label}
            {count > 0 && (
                <span style={{
                    fontSize: '10px', fontWeight: 500,
                    background: active ? 'rgba(129,140,248,0.25)' : 'rgba(255,255,255,0.08)',
                    borderRadius: '999px', padding: '1px 6px',
                    color: active ? 'rgba(200,200,255,0.8)' : 'rgba(255,255,255,0.30)',
                }}>
                    {count}
                </span>
            )}
        </button>
    );
}

/* ─── Error banner ───────────────────────────────────────────── */
function ErrorBanner({ message }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            style={{
                padding: '16px 20px', borderRadius: '12px',
                border: '1px solid rgba(239,68,68,0.25)',
                background: 'rgba(239,68,68,0.08)', backdropFilter: 'blur(12px)',
                color: 'rgba(252,165,165,0.9)', fontSize: '14px',
                display: 'flex', alignItems: 'center', gap: '10px',
            }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{message}</span>
        </motion.div>
    );
}

/* ─── Empty section state ────────────────────────────────────── */
function EmptySection({ label }) {
    return (
        <div style={{ padding: '40px 0', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '14px' }}>
            No {label} found for this query.
        </div>
    );
}

/* ═══ TABS CONFIG ════════════════════════════════════════════════ */
const TABS = [
    { id: 'all',    label: 'All',    icon: '🔍' },
    { id: 'web',    label: 'Web',    icon: '🌐' },
    { id: 'images', label: 'Images', icon: '🖼️' },
    { id: 'videos', label: 'Videos', icon: '▶️' },
    { id: 'news',   label: 'News',   icon: '📰' },
];

const LIMIT = 5; // max results shown per section in "All" tab

/* ═══ MAIN COMPONENT ═════════════════════════════════════════════ */
export default function Search() {
    const [searchParams] = useSearchParams();
    const query    = searchParams.get('q');
    const type     = searchParams.get('type');
    const filename = searchParams.get('filename');
    const kind     = searchParams.get('kind');

    const displayQuery = type === 'file'
        ? `${kind ? `[${kind}] ` : ''}${filename}`
        : query;

    const hasQuery = Boolean(displayQuery);

    const [loading, setLoading]   = useState(false);
    const [error,   setError]     = useState(null);
    const [results, setResults]   = useState({ web: [], images: [], videos: [], news: [] });
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        if (!displayQuery) return;

        // Create a controller for THIS effect invocation.
        // If React Strict Mode fires the effect twice, the cleanup from the
        // first run aborts its fetch before the second run starts a fresh one.
        const controller = new AbortController();

        setLoading(true);
        setError(null);
        setResults({ web: [], images: [], videos: [], news: [] });
        setActiveTab('all');

        unifiedSearch({ query: displayQuery, signal: controller.signal })
            .then((data) => {
                const r = data?.results ?? {};
                setResults({
                    web:    Array.isArray(r.web)    ? r.web    : [],
                    images: Array.isArray(r.images) ? r.images : [],
                    videos: Array.isArray(r.videos) ? r.videos : [],
                    news:   Array.isArray(r.news)   ? r.news   : [],
                });
            })
            .catch((err) => {
                // AbortError means WE cancelled the request — not a real failure.
                // Ignore it so valid results from a prior successful call are kept.
                if (err.name === 'AbortError') return;
                console.error('[Search] API error:', err);
                setError(err.message || 'Something went wrong. Please try again.');
            })
            .finally(() => {
                // Only clear the loading flag if this request wasn't aborted.
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            });

        // Cleanup: abort the fetch when the query changes or the component unmounts.
        return () => controller.abort();
    }, [displayQuery]);


    const totalCount = results.web.length + results.images.length + results.videos.length + results.news.length;

    /* Tab counts (excluding 'all') */
    const tabCounts = {
        web:    results.web.length,
        images: results.images.length,
        videos: results.videos.length,
        news:   results.news.length,
    };

    /* Visible tabs: only show when there is data (or still loading) */
    const visibleTabs = TABS.filter(t => {
        if (t.id === 'all') return true;
        return loading || tabCounts[t.id] > 0;
    });

    /* ── Render sections based on active tab ─────────────────── */
    function renderContent() {
        if (loading) {
            return (
                <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
                </motion.div>
            );
        }

        if (error) {
            return <ErrorBanner key="error" message={error} />;
        }

        if (totalCount === 0) {
            return (
                <motion.div key="empty" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '60px', gap: '12px', textAlign: 'center' }}>
                    <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <p style={{ color: 'rgba(156,163,175,1)', fontSize: '14px' }}>No results found for "{displayQuery}"</p>
                </motion.div>
            );
        }

        const show = activeTab;

        return (
            <motion.div key={show} initial="hidden" animate="show" exit={{ opacity: 0, transition: { duration: 0.15 } }}
                        variants={containerVariants} style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>

                {/* WEB */}
                {(show === 'all' || show === 'web') && results.web.length > 0 && (
                    <section>
                        <SectionHeader icon="🌐" title="Web Results" count={results.web.length} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {(show === 'all' ? results.web.slice(0, LIMIT) : results.web).map((item, i) => (
                                <WebCard key={i} item={item} />
                            ))}
                        </div>
                    </section>
                )}
                {show === 'web' && results.web.length === 0 && <EmptySection label="web results" />}

                {/* IMAGES */}
                {(show === 'all' || show === 'images') && results.images.length > 0 && (
                    <section>
                        <SectionHeader icon="🖼️" title="Images" count={results.images.length} />
                        <motion.div variants={containerVariants} style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                            gap: '14px',
                        }}>
                            {(show === 'all' ? results.images.slice(0, LIMIT + 1) : results.images).map((item, i) => (
                                <ImageCard key={i} item={item} />
                            ))}
                        </motion.div>
                    </section>
                )}
                {show === 'images' && results.images.length === 0 && <EmptySection label="images" />}

                {/* VIDEOS */}
                {(show === 'all' || show === 'videos') && results.videos.length > 0 && (
                    <section>
                        <SectionHeader icon="▶️" title="Videos" count={results.videos.length} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {(show === 'all' ? results.videos.slice(0, LIMIT) : results.videos).map((item, i) => (
                                <VideoCard key={i} item={item} />
                            ))}
                        </div>
                    </section>
                )}
                {show === 'videos' && results.videos.length === 0 && <EmptySection label="videos" />}

                {/* NEWS */}
                {(show === 'all' || show === 'news') && results.news.length > 0 && (
                    <section>
                        <SectionHeader icon="📰" title="News" count={results.news.length} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {(show === 'all' ? results.news.slice(0, LIMIT) : results.news).map((item, i) => (
                                <NewsCard key={i} item={item} />
                            ))}
                        </div>
                    </section>
                )}
                {show === 'news' && results.news.length === 0 && <EmptySection label="news" />}

            </motion.div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#000', position: 'relative' }}>

            {/* ── Background ────────────────────────────────────── */}
            <video src="/1.mp4" autoPlay muted loop playsInline style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%',
                objectFit: 'cover', opacity: 0.28, zIndex: 0,
                transform: 'translateY(4%)', pointerEvents: 'none',
            }} />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.72)', zIndex: 1, pointerEvents: 'none' }} />
            <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, height: '256px',
                background: 'linear-gradient(to bottom, rgba(30,27,75,0.28), transparent)',
                zIndex: 2, pointerEvents: 'none',
            }} />

            {/* ── Navbar ────────────────────────────────────────── */}
            <div style={{ position: 'relative', zIndex: 50 }}>
                <Navbar />
            </div>

            {/* ── Page content ──────────────────────────────────── */}
            <div style={{ position: 'relative', zIndex: 10, paddingTop: '96px', paddingBottom: '96px' }}>
                <div style={{ maxWidth: '1024px', margin: '0 auto', paddingLeft: '24px', paddingRight: '24px' }}>

                    {/* Search bar */}
                    <div style={{ width: '100%', marginBottom: '32px' }}>
                        <SearchBar compact />
                    </div>

                    {/* ── Empty state (no query) ─────────────────── */}
                    {!hasQuery && (
                        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
                                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '96px', gap: '12px', textAlign: 'center' }}>
                            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            <p style={{ color: 'rgba(156,163,175,1)', fontSize: '14px', letterSpacing: '0.025em' }}>
                                Start searching to explore results
                            </p>
                        </motion.div>
                    )}

                    {/* ── Results area ───────────────────────────── */}
                    {hasQuery && (
                        <>
                            {/* Results header */}
                            <motion.div
                                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, ease: 'easeOut' }}
                                style={{
                                    display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
                                    marginBottom: '20px', paddingBottom: '18px',
                                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                                }}
                            >
                                <div style={{ minWidth: 0, flex: 1, paddingRight: '16px' }}>
                                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.30)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 500, marginBottom: '5px' }}>
                                        Results for
                                    </p>
                                    <h1 style={{ fontSize: '22px', fontWeight: 600, color: 'rgba(255,255,255,0.90)', letterSpacing: '-0.02em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        "{displayQuery}"
                                    </h1>
                                </div>
                                {!loading && (
                                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)', flexShrink: 0, paddingBottom: '2px' }}>
                                        {totalCount} result{totalCount !== 1 ? 's' : ''}
                                    </span>
                                )}
                            </motion.div>

                            {/* Tabs */}
                            {(!loading && totalCount > 0) && (
                                <motion.div
                                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.1 }}
                                    style={{ display: 'flex', gap: '8px', marginBottom: '28px', flexWrap: 'wrap' }}
                                >
                                    {visibleTabs.map(tab => (
                                        <TabButton
                                            key={tab.id}
                                            id={tab.id}
                                            label={tab.label}
                                            icon={tab.icon}
                                            active={activeTab === tab.id}
                                            count={tab.id !== 'all' ? tabCounts[tab.id] : 0}
                                            onClick={setActiveTab}
                                        />
                                    ))}
                                </motion.div>
                            )}

                            {/* Content */}
                            <AnimatePresence mode="wait">
                                {renderContent()}
                            </AnimatePresence>
                        </>
                    )}

                </div>
            </div>
        </div>
    );
}
