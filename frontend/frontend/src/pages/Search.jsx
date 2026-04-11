import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';

/* ─── Animation variants ─────────────────────────────────────── */
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.09, delayChildren: 0.1 },
    },
};

const cardVariant = {
    hidden: { opacity: 0, y: 16, filter: 'blur(4px)' },
    show: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
};

/* ─── Dummy results ───────────────────────────────────────────── */
const MOCK_RESULTS = [
    {
        id: 1,
        title: 'Semantic Analysis of Text Query Patterns',
        displayLink: 'arxiv.org › research › semantic-analysis',
        snippet: 'Explores how large language models process and retrieve information from high-dimensional vector embeddings, using contrastive learning techniques to align cross-modal representations.',
        tag: 'Research',
    },
    {
        id: 2,
        title: 'Cross-modal Retrieval with CLIP Embeddings',
        displayLink: 'openai.com › research › clip',
        snippet: "A comprehensive technical overview of OpenAI CLIP's approach to aligning visual and textual representations in a shared 512-dimensional embedding space for zero-shot classification.",
        tag: 'Deep Dive',
    },
    {
        id: 3,
        title: 'Multimodal Transformers: Architecture Overview',
        displayLink: 'paperswithcode.com › methods › multimodal',
        snippet: 'A structured walkthrough of vision-language transformer architectures, covering cross-attention mechanisms, token fusion strategies, and benchmarks across input modalities.',
        tag: 'Paper',
    },
    {
        id: 4,
        title: 'Vector Similarity Search at Scale with FAISS',
        displayLink: 'engineering.fb.com › data-infrastructure',
        snippet: 'Facebook AI Research introduces FAISS — a library for efficient similarity search and clustering of dense vectors, enabling billion-scale nearest-neighbour lookups in milliseconds.',
        tag: 'Engineering',
    },
    {
        id: 5,
        title: 'Retrieval-Augmented Generation for Knowledge-Intensive NLP',
        displayLink: 'arxiv.org › abs › 2005.11401',
        snippet: 'RAG combines pre-trained parametric and non-parametric memory for language generation. This paper demonstrates substantial gains on open-domain QA, fact verification, and knowledge-grounded dialogue.',
        tag: 'Paper',
    },
    {
        id: 6,
        title: 'Building a Multimodal Search Engine from Scratch',
        displayLink: 'towardsdatascience.com › multimodal-search',
        snippet: 'Step-by-step guide to architecting a production-grade multimodal search pipeline using Weaviate, CLIP, and Whisper. Covers ingest, indexing, query routing, and relevance ranking.',
        tag: 'Tutorial',
    },
    {
        id: 7,
        title: 'Audio Embeddings for Semantic Search: A Survey',
        displayLink: 'dl.acm.org › doi › audio-embeddings',
        snippet: 'Surveys state-of-the-art audio representation learning models including wav2vec 2.0, HuBERT, and Whisper. Discusses use-cases in speech retrieval, music search, and environmental sound indexing.',
        tag: 'Survey',
    },
    {
        id: 8,
        title: 'Pinecone: Managed Vector Database for AI Applications',
        displayLink: 'pinecone.io › learn › vector-database',
        snippet: 'Learn how managed vector databases power modern AI search systems. Covers indexing strategies, ANN algorithms, metadata filtering, and real-time upsert semantics at production scale.',
        tag: 'Docs',
    },
];

/* ─── Tag badge styles ────────────────────────────────────────── */
const TAG_STYLES = {
    Research:    'bg-violet-500/10 text-violet-300 border-violet-500/20',
    'Deep Dive': 'bg-blue-500/10 text-blue-300 border-blue-500/20',
    Paper:       'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    Engineering: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    Tutorial:    'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
    Survey:      'bg-pink-500/10 text-pink-300 border-pink-500/20',
    Docs:        'bg-slate-500/10 text-slate-300 border-slate-500/20',
};

/* ─── Skeleton card ───────────────────────────────────────────── */
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

/* ─── Arrow icon ─────────────────────────────────────────────── */
function ArrowIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M4 14 14 4M7 4h7v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

/* ─── Main component ──────────────────────────────────────────── */
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

    /* 900 ms fake loading shimmer */
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        const t = setTimeout(() => setLoading(false), 900);
        return () => clearTimeout(t);
    }, [query, type, filename]);

    return (
        <div style={{ minHeight: '100vh', background: '#000', position: 'relative' }}>

            {/* ── Background layers ──────────────────────────── */}
            <video
                src="/1.mp4"
                autoPlay muted loop playsInline
                style={{
                    position: 'absolute', inset: 0,
                    width: '100%', height: '100%',
                    objectFit: 'cover', opacity: 0.28,
                    zIndex: 0, transform: 'translateY(4%)',
                    pointerEvents: 'none',
                }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.72)', zIndex: 1, pointerEvents: 'none' }} />
            <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, height: '256px',
                background: 'linear-gradient(to bottom, rgba(30,27,75,0.28), transparent)',
                zIndex: 2, pointerEvents: 'none',
            }} />

            {/* ── Navbar ─────────────────────────────────────── */}
            {/* Navbar is already fixed; this just ensures it stacks above content */}
            <div style={{ position: 'relative', zIndex: 50 }}>
                <Navbar />
            </div>

            {/* ── Page content ───────────────────────────────── */}
            {/*
                The navbar is position: fixed with height 64px.
                We push content down with paddingTop: 96px (64px navbar + 32px gap).
                All content is constrained to max-width 1024px (max-w-5xl) centered.
            */}
            <div
                style={{
                    position: 'relative',
                    zIndex: 10,
                    paddingTop: '96px',
                    paddingBottom: '96px',
                }}
            >
                <div
                    style={{
                        maxWidth: '1024px',
                        margin: '0 auto',
                        paddingLeft: '24px',
                        paddingRight: '24px',
                    }}
                >
                    {/* ── Search bar (always visible) ─────────── */}
                    <div style={{ width: '100%', marginBottom: '40px' }}>
                        <SearchBar compact />
                    </div>

                    {/* ── Conditional content area ────────────── */}
                    <AnimatePresence mode="wait">

                        {/* EMPTY STATE */}
                        {!hasQuery && (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0, y: 14 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.35 }}
                                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '96px', paddingBottom: '96px', gap: '12px', textAlign: 'center' }}
                            >
                                <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                                <p style={{ color: 'rgba(156,163,175,1)', fontSize: '14px', letterSpacing: '0.025em' }}>
                                    Start searching to explore results
                                </p>
                            </motion.div>
                        )}

                        {/* SKELETON STATE */}
                        {hasQuery && loading && (
                            <motion.div
                                key="skeleton"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}
                            >
                                {/* Header skeleton */}
                                <div
                                    style={{ width: '100%', paddingBottom: '20px', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
                                    className="animate-pulse"
                                >
                                    <div style={{ height: '10px', width: '80px', borderRadius: '9999px', background: 'rgba(255,255,255,0.10)', marginBottom: '12px' }} />
                                    <div style={{ height: '22px', width: '240px', borderRadius: '9999px', background: 'rgba(255,255,255,0.10)' }} />
                                </div>
                                {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
                            </motion.div>
                        )}

                        {/* RESULTS STATE */}
                        {hasQuery && !loading && (
                            <motion.div
                                key="results"
                                style={{ width: '100%' }}
                                initial="hidden"
                                animate="show"
                                exit={{ opacity: 0 }}
                                variants={containerVariants}
                            >
                                {/* Results header */}
                                <motion.div
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, ease: 'easeOut' }}
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'flex-end',
                                        justifyContent: 'space-between',
                                        marginBottom: '32px',
                                        paddingBottom: '20px',
                                        borderBottom: '1px solid rgba(255,255,255,0.08)',
                                    }}
                                >
                                    <div style={{ minWidth: 0, flex: 1, paddingRight: '16px' }}>
                                        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.30)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 500, marginBottom: '6px' }}>
                                            Results for
                                        </p>
                                        <h1 style={{ fontSize: '22px', fontWeight: 600, color: 'rgba(255,255,255,0.90)', letterSpacing: '-0.02em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            "{displayQuery}"
                                        </h1>
                                    </div>
                                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)', flexShrink: 0, paddingBottom: '2px' }}>
                                        {MOCK_RESULTS.length} results
                                    </span>
                                </motion.div>

                                {/* Result cards */}
                                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    {MOCK_RESULTS.map(result => (
                                        <motion.div
                                            key={result.id}
                                            variants={cardVariant}
                                            whileHover={{ y: -2 }}
                                            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                                            className="group"
                                            style={{
                                                position: 'relative',
                                                width: '100%',
                                                padding: '20px',
                                                borderRadius: '12px',
                                                border: '1px solid rgba(255,255,255,0.09)',
                                                background: 'rgba(255,255,255,0.04)',
                                                backdropFilter: 'blur(12px)',
                                                cursor: 'pointer',
                                                overflow: 'hidden',
                                                transition: 'background 0.2s ease, border-color 0.2s ease',
                                            }}
                                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'; }}
                                        >
                                            {/* Left accent line */}
                                            <div
                                                className="scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-center"
                                                style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '2px', background: 'linear-gradient(to bottom, transparent, rgba(129,140,248,0.5), transparent)', borderRadius: '0 2px 2px 0' }}
                                            />

                                            {/* Card inner */}
                                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
                                                <div style={{ flex: 1, minWidth: 0 }}>

                                                    {/* Tag */}
                                                    <span className={`inline-block text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-full border mb-3 ${TAG_STYLES[result.tag] ?? 'bg-white/5 text-white/40 border-white/10'}`}>
                                                        {result.tag}
                                                    </span>

                                                    {/* Title */}
                                                    <h2
                                                        className="group-hover:underline underline-offset-2 decoration-white/30"
                                                        style={{ fontSize: '17px', fontWeight: 600, color: '#fff', lineHeight: 1.3, marginBottom: '6px' }}
                                                    >
                                                        {result.title}
                                                    </h2>

                                                    {/* URL */}
                                                    <p style={{ fontSize: '13px', color: 'rgba(156,163,175,1)', marginBottom: '8px', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                        {result.displayLink}
                                                    </p>

                                                    {/* Snippet */}
                                                    <p style={{ fontSize: '14px', color: 'rgba(209,213,219,1)', lineHeight: 1.65 }}>
                                                        {result.snippet}
                                                    </p>
                                                </div>

                                                {/* Arrow */}
                                                <div
                                                    className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200"
                                                    style={{ flexShrink: 0, marginTop: '4px', color: 'rgba(255,255,255,0.25)' }}
                                                    onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.75)'}
                                                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.25)'}
                                                >
                                                    <ArrowIcon />
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
