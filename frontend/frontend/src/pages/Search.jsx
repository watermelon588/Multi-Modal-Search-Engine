import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.3 },
    },
};

const resultVariant = {
    hidden: { opacity: 0, y: 20, filter: 'blur(6px)' },
    show: {
        opacity: 1, y: 0, filter: 'blur(0px)',
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
};

const MOCK_RESULTS = [
    {
        id: 1,
        title: 'Semantic Analysis of Text Query Patterns',
        desc: 'Explores how large language models process and retrieve information from high-dimensional vector embeddings, using contrastive learning techniques.',
        tag: 'Research',
    },
    {
        id: 2,
        title: 'Cross-modal Retrieval with CLIP Embeddings',
        desc: "A technical overview of OpenAI CLIP's approach to aligning visual and textual representations in a shared embedding space.",
        tag: 'Deep Dive',
    },
    {
        id: 3,
        title: 'Multimodal Transformers: Architecture Overview',
        desc: 'A structured walkthrough of vision-language transformer architectures, covering attention mechanisms across input modalities.',
        tag: 'Paper',
    },
];

export default function Search() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const type = searchParams.get('type');
    const filename = searchParams.get('filename');
    const kind = searchParams.get('kind');

    const displayQuery = type === 'file'
        ? `${kind ? `[${kind}] ` : ''}${filename}`
        : query || '…';

    return (
        <div className="noise relative min-h-screen flex flex-col bg-black overflow-hidden">
            {/* Subtle top glow */}
            <div className="fixed top-0 inset-x-0 h-64 bg-gradient-to-b from-indigo-950/20 to-transparent pointer-events-none z-0" />
            <div className="fixed top-32 left-1/2 -translate-x-1/2 w-[50rem] h-[20rem] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none z-0" />

            <Navbar />

            <div className="relative z-10 w-full max-w-4xl mx-auto px-6 pt-32 pb-24">
                {/* Compact search bar at top */}
                <div className="mb-12">
                    <SearchBar compact />
                </div>

                {/* Results header */}
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-end justify-between mb-8 pb-5 border-b border-white/8"
                >
                    <div>
                        <p className="text-xs text-white/30 uppercase tracking-widest mb-2">Results for</p>
                        <h1 className="font-display text-2xl md:text-3xl font-[700] tracking-tight text-white/90 max-w-lg truncate">
                            "{displayQuery}"
                        </h1>
                    </div>
                    <span className="text-xs text-white/25 shrink-0 pb-1">
                        {MOCK_RESULTS.length} results
                    </span>
                </motion.div>

                {/* Result cards */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="space-y-4"
                >
                    {MOCK_RESULTS.map((result) => (
                        <motion.div
                            key={result.id}
                            variants={resultVariant}
                            className="group relative p-6 rounded-2xl glass cursor-pointer overflow-hidden transition-all duration-300 hover:bg-white/5"
                        >
                            {/* Hover left accent line */}
                            <div className="absolute left-0 inset-y-0 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-center" />

                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <span className="badge mb-3 inline-block">{result.tag}</span>
                                    <h2 className="text-base font-medium text-white/85 group-hover:text-white transition-colors duration-200 mb-2 leading-snug">
                                        {result.title}
                                    </h2>
                                    <p className="text-sm text-white/35 leading-relaxed">
                                        {result.desc}
                                    </p>
                                </div>
                                {/* Arrow icon */}
                                <div className="shrink-0 text-white/20 group-hover:text-white/60 transition-all duration-200 group-hover:translate-x-1 group-hover:-translate-y-1">
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                        <path d="M4 14 14 4M7 4h7v7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
