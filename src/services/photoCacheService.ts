/**
 * photoCacheService.ts
 *
 * Сервис для кэширования и управления фотографиями по jobId через Cache API.
 */

const CACHE_NAME = 'photo-cache'

/**
 * Генерирует уникальный ключ для кэша на основе jobId
 */
function makeCacheKey(id: number): Request {
    // виртуальный ключ как Request, фактически не запрашивается
    return new Request(`/photo-cache/${id}`)
}

/**
 * Получает URL фотографии из кэша, если он там есть
 * @param id jobId
 * @returns Promise<string|null> — blob URL или null, если нет в кэше
 */
export async function getCachedPhotoUrl(id: number): Promise<string | null> {
    const cache = await caches.open(CACHE_NAME)
    const match = await cache.match(makeCacheKey(id))
    if (!match) return null
    const blob = await match.blob()
    return URL.createObjectURL(blob)
}

/**
 * Кэширует фотографию по URL photoLink под ключом jobId и возвращает blob URL
 * @param id jobId
 * @param photoLink URL для fetch() фотографии
 * @returns Promise<string> — blob URL
 */
export async function cachePhotoUrl(id: number, photoLink: string): Promise<string> {
    const cache = await caches.open(CACHE_NAME)
    const key = makeCacheKey(id)

    const resp = await fetch(photoLink)
    if (!resp.ok) throw new Error(`Failed to fetch image: ${resp.status}`)

    // Кэшируем ответ
    await cache.put(key, resp.clone())

    const blob = await resp.blob()
    return URL.createObjectURL(blob)
}

/**
 * Очищает кэшированное фото для конкретного jobId
 */
export async function clearCachedPhoto(id: number): Promise<void> {
    const cache = await caches.open(CACHE_NAME)
    await cache.delete(makeCacheKey(id))
}

/**
 * Очищает весь кэш фото
 */
export async function clearAllPhotosCache(): Promise<void> {
    await caches.delete(CACHE_NAME)
}
