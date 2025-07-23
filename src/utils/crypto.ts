// utils/crypto.ts
export async function sha256Hex(str: string): Promise<string> {
    const buf = new TextEncoder().encode(str)
    const hash = await crypto.subtle.digest('SHA-256', buf)
    return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
}
