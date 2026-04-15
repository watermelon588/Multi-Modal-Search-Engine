import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { setPendingFile, clearPendingFile } from '../fileStore';

/* ─── Upload type definitions ───────────────────────────────────── */
const UPLOAD_TYPES = [
    { id: 'image', accept: 'image/*',  title: 'Upload image',  faClass: 'fa-solid fa-image' },
    { id: 'audio', accept: 'audio/*',  title: 'Upload audio',  faClass: 'fa-solid fa-microphone' },
    { id: 'video', accept: 'video/*',  title: 'Upload video',  faClass: 'fa-solid fa-video' },
];

/* ═══ SEARCHBAR ════════════════════════════════════════════════════ */
export default function SearchBar({ compact = false, initialQuery = '', loading = false }) {
    const [query,      setQuery]      = useState(initialQuery);
    const [file,       setFile]       = useState(null);       // File | null
    const [imgPreview, setImgPreview] = useState(null);       // object URL | null
    const [focused,    setFocused]    = useState(false);
    const [dragging,   setDragging]   = useState(false);

    const navigate     = useNavigate();
    const fileInputRef = useRef(null);
    const activeTypeId = useRef(null);

    /* revoke object URL on unmount / file change */
    useEffect(() => {
        return () => { if (imgPreview) URL.revokeObjectURL(imgPreview); };
    }, [imgPreview]);

    /* ── apply a chosen File ────────────────────────────────────── */
    const applyFile = useCallback((selected) => {
        if (!selected) return;
        setFile(selected);
        setPendingFile(selected);
        if (selected.type.startsWith('image/')) {
            setImgPreview(URL.createObjectURL(selected));
        } else {
            setImgPreview(null);
        }
    }, []);

    /* ── remove file ────────────────────────────────────────────── */
    const removeFile = useCallback(() => {
        setFile(null);
        clearPendingFile();
        if (imgPreview) { URL.revokeObjectURL(imgPreview); setImgPreview(null); }
        if (fileInputRef.current) fileInputRef.current.value = '';
        activeTypeId.current = null;
    }, [imgPreview]);

    /* ── icon button click ──────────────────────────────────────── */
    const handleUploadClick = (type) => {
        activeTypeId.current = type.id;
        if (fileInputRef.current) {
            fileInputRef.current.accept = type.accept;
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e) => {
        applyFile(e.target.files?.[0]);
        e.target.value = '';
    };

    /* ── drag & drop ────────────────────────────────────────────── */
    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        applyFile(e.dataTransfer.files?.[0]);
    };

    /* ── submit ─────────────────────────────────────────────────── */
    const handleSubmit = (e) => {
        e?.preventDefault();
        const q = query.trim();
        if (!q && !file) return;
        const params = new URLSearchParams();
        if (q)    params.set('q', q);
        if (file) { params.set('type', 'file'); params.set('filename', file.name); params.set('kind', activeTypeId.current ?? 'unknown'); }
        navigate(`/search?${params.toString()}`);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
    };

    const canSubmit = (!!query.trim() || !!file) && !loading;

    /* ── border / glow styles ───────────────────────────────────── */
    const borderColor = dragging
        ? 'rgba(167,139,250,0.65)'
        : focused ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.10)';

    const glowShadow = dragging
        ? '0 0 0 2px rgba(167,139,250,0.35), 0 8px 32px rgba(0,0,0,0.45)'
        : focused
            ? '0 0 0 1px rgba(255,255,255,0.12), 0 6px 28px rgba(0,0,0,0.40)'
            : '0 4px 20px rgba(0,0,0,0.30)';

    /* ── file icon for non-image ────────────────────────────────── */
    const fileIconClass = file?.type.startsWith('audio/') ? 'fa-solid fa-microphone' : 'fa-solid fa-video';

    return (
        <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            style={{
                position: 'relative',
                width: '100%',
                maxWidth: compact ? '640px' : '720px',

                /* ── Fixed-height pill — NEVER stretches ── */
                height: compact ? '52px' : '58px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0 8px 0 16px',

                borderRadius: '999px',
                border: `1px solid ${borderColor}`,
                background: 'rgba(255,255,255,0.07)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                boxShadow: glowShadow,
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                overflow: 'hidden',
            }}
        >
            {/* hidden file input */}
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />

            {/* ── Left: file preview OR search icon ──────────────── */}
            {file ? (
                /* File preview chip */
                <div style={{ position: 'relative', flexShrink: 0 }}>

                    {/* Thumbnail or icon */}
                    <div style={{
                        width: imgPreview ? '38px' : '34px',
                        height: imgPreview ? '32px' : '34px',
                        borderRadius: imgPreview ? '8px' : '50%',
                        overflow: 'hidden',
                        background: imgPreview ? 'transparent' : 'rgba(255,255,255,0.10)',
                        border: '1px solid rgba(255,255,255,0.14)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                    }}>
                        {imgPreview ? (
                            <img
                                src={imgPreview}
                                alt="preview"
                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                            />
                        ) : (
                            <i className={fileIconClass} style={{ fontSize: '14px', color: 'rgba(167,139,250,0.85)' }} />
                        )}
                    </div>

                    {/* Remove (×) badge */}
                    <button
                        type="button"
                        onClick={removeFile}
                        title="Remove file"
                        style={{
                            position: 'absolute',
                            top: '-4px',
                            right: '-4px',
                            width: '16px',
                            height: '16px',
                            borderRadius: '50%',
                            background: 'rgba(20,20,30,0.85)',
                            border: '1px solid rgba(255,255,255,0.18)',
                            color: 'rgba(255,255,255,0.65)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            padding: 0,
                            lineHeight: 1,
                            transition: 'background 0.15s ease, color 0.15s ease',
                            zIndex: 2,
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,50,50,0.85)'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(20,20,30,0.85)'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; }}
                    >
                        <i className="fa-solid fa-xmark" style={{ fontSize: '9px', pointerEvents: 'none' }} />
                    </button>
                </div>
            ) : (
                /* Default search icon */
                <div style={{ color: 'rgba(255,255,255,0.28)', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                    {loading
                        ? <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '15px' }} />
                        : <i className="fa-solid fa-magnifying-glass" style={{ fontSize: '15px' }} />
                    }
                </div>
            )}

            {/* ── Text input ──────────────────────────────────────── */}
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder={
                    file
                        ? 'Add a question… (optional)'
                        : compact
                            ? 'Search again…'
                            : 'Search anything — text, image, audio, video…'
                }
                style={{
                    flex: 1,
                    minWidth: 0,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#fff',
                    fontSize: compact ? '13.5px' : '14.5px',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    letterSpacing: '-0.01em',
                    caretColor: 'rgba(255,255,255,0.7)',
                }}
            />

            {/* ── Upload icon buttons (no dividers) ───────────────── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                {UPLOAD_TYPES.map((type) => (
                    <UploadBtn
                        key={type.id}
                        type={type}
                        onClick={handleUploadClick}
                        active={file?.type.startsWith(type.id === 'image' ? 'image/' : type.id === 'audio' ? 'audio/' : 'video/')}
                    />
                ))}
            </div>

            {/* ── Submit button ────────────────────────────────────── */}
            <motion.button
                type="submit"
                disabled={!canSubmit}
                whileHover={canSubmit ? { scale: 1.04 } : {}}
                whileTap={canSubmit ? { scale: 0.96 } : {}}
                transition={{ type: 'spring', stiffness: 420, damping: 22 }}
                style={{
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: compact ? '6px 14px' : '7px 18px',
                    borderRadius: '999px',
                    border: 'none',
                    cursor: canSubmit ? 'pointer' : 'not-allowed',
                    fontSize: '13px',
                    fontWeight: 600,
                    letterSpacing: '0.01em',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    background: canSubmit
                        ? 'rgba(255,255,255,0.94)'
                        : 'rgba(255,255,255,0.08)',
                    color: canSubmit ? '#0a0a12' : 'rgba(255,255,255,0.22)',
                    boxShadow: canSubmit ? '0 2px 10px rgba(255,255,255,0.12)' : 'none',
                    transition: 'background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease',
                }}
            >
                {loading
                    ? <><i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '12px' }} /> Searching</>
                    : <><i className="fa-solid fa-magnifying-glass" style={{ fontSize: '12px' }} /> Search</>
                }
            </motion.button>

            {/* ── Drag-over overlay ────────────────────────────────── */}
            {dragging && (
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '999px',
                    background: 'rgba(139,92,246,0.10)',
                    border: '1.5px dashed rgba(167,139,250,0.55)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none',
                }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(192,168,255,0.90)' }}>
                        <i className="fa-solid fa-cloud-arrow-up" style={{ marginRight: '6px' }} />
                        Drop to attach
                    </span>
                </div>
            )}
        </motion.form>
    );
}

/* ─── Upload icon button ─────────────────────────────────────────── */
function UploadBtn({ type, onClick, active }) {
    return (
        <button
            type="button"
            title={type.title}
            onClick={() => onClick(type)}
            style={{
                width: '30px',
                height: '30px',
                borderRadius: '8px',
                border: active ? '1px solid rgba(167,139,250,0.45)' : '1px solid transparent',
                background: active ? 'rgba(167,139,250,0.12)' : 'transparent',
                color: active ? 'rgba(192,168,255,0.90)' : 'rgba(255,255,255,0.38)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                flexShrink: 0,
            }}
            onMouseEnter={e => {
                if (!active) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                    e.currentTarget.style.color = 'rgba(255,255,255,0.80)';
                }
            }}
            onMouseLeave={e => {
                if (!active) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'rgba(255,255,255,0.38)';
                }
            }}
        >
            <i className={type.faClass} style={{ fontSize: '13px', pointerEvents: 'none' }} />
        </button>
    );
}
