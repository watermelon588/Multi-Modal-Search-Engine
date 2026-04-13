import { BASE_URL } from "../config";

/**
 * @param {{ query?: string, file?: File, signal?: AbortSignal }} options
 */
export async function unifiedSearch({ query, file, signal } = {}) {
    const formData = new FormData();

    if (query) formData.append("query", query);
    if (file)  formData.append("file",  file);

    const res = await fetch(`${BASE_URL}/search/unified`, {
        method: "POST",
        body: formData,
        signal,          // ← allows AbortController to cancel the request
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Search failed (${res.status}): ${text}`);
    }

    return res.json();
}

