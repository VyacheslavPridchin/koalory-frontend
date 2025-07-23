// src/services/api.ts
import axios, { type AxiosInstance, type AxiosResponse } from 'axios'
import router from '@/router'

// Koalory API base URL
const api: AxiosInstance = axios.create({
    baseURL: 'https://story.koalory.com/api/',
    headers: { 'Content-Type': 'application/json' },
})

// Attach Authorization header if token exists
api.interceptors.request.use(config => {
    const token = localStorage.getItem('access_token')
    if (token) config.headers!['Authorization'] = `Bearer ${token}`
    return config
})

// Generic API response wrapper
type ApiResponse<T> = {
    success: boolean
    data: T
    error: string
}

// Helper to unwrap ApiResponse or throw error
function unwrap<T>(res: AxiosResponse<ApiResponse<T>>): T {
    const body = res.data
    if (!body.success) throw new Error(body.error || 'API error')
    return body.data
}

function unwrapNotCompletely<T>(res: AxiosResponse<ApiResponse<T>>): ApiResponse<T> {
    return res.data
}

// Schemas
export interface GoogleRequest { token: string }
export interface EmailRequest { email: string; password: string }
export interface LaunchStoryGenerationRequest { job_id: number }
export interface LoginResponse { access_token: string; refresh_token: string }
export interface SuccessfulSubmission { job_id: number }
export interface StoryDetailSubmission { job_id: number; field_name: string; value: string | number }
export interface PhotoLinkResponse { photo_link: string }
export interface AvailableStoriesResponse { available_stories: number }
export interface PaymentResponse { link: string }
export interface StoryResponse {
    progress: number
    pdf_url: string | null
    email: string | null
    word_count: string | null
    title: string | null
    text: string[] | null
    images: string[] | null
}
export interface StorySummary {  job_id: number; title: string | null; progress: string; theme: string | null; image: string | null; }
export interface StoriesResponse { stories: StorySummary[] }

// Auth endpoints
export async function googleLogin(data: GoogleRequest): Promise<LoginResponse> {
    const res = await api.post<ApiResponse<LoginResponse>>('/auth/google_login', data)
    return unwrap(res)
}

export async function emailLogin(data: EmailRequest): Promise<LoginResponse> {
    const res = await api.post<ApiResponse<LoginResponse>>('/auth/email_login', data)
    return unwrap(res)
}

export async function refreshToken(refresh_token: string): Promise<LoginResponse> {
    const res = await api.post<ApiResponse<LoginResponse>>(
        '/auth/refresh',
        null,
        { params: { refresh_token } }
    )
    return unwrap(res)
}

export async function testAuth(): Promise<LoginResponse> {
    const res = await api.post<ApiResponse<LoginResponse>>('/auth/test_auth')
    return unwrap(res)
}

// Register endpoints (return tokens)
export async function googleRegister(data: GoogleRequest): Promise<LoginResponse> {
    const res = await api.post<ApiResponse<LoginResponse>>('/register/google_register', data)
    return unwrap(res)
}

export async function emailRegister(data: EmailRequest): Promise<LoginResponse> {
    const res = await api.post<ApiResponse<LoginResponse>>('/register/email_register', data)
    return unwrap(res)
}

// Story form
export async function createStory(): Promise<SuccessfulSubmission> {
    const res = await api.post<ApiResponse<SuccessfulSubmission>>('/form/create_story')
    return unwrap(res)
}

export interface FirstScreenPayload {
    job_id: number
    name: string
    gender: string
    age: number
    location: string
    photo: File
}
export async function submitFirstScreen(
    payload: FirstScreenPayload
): Promise<SuccessfulSubmission> {
    const form = new FormData()
    Object.entries(payload).forEach(([k, v]) => form.append(k, v as any))
    const res = await api.post<ApiResponse<SuccessfulSubmission>>(
        '/form/submit_first_screen',
        form,
        { headers: { 'Content-Type': 'multipart/form-data' } }
    )
    return unwrap(res)
}

export async function getGeneratedPhoto(
    job_id: number
): Promise<PhotoLinkResponse> {
    const res = await api.get<ApiResponse<PhotoLinkResponse>>(
        '/form/get_generated_photo',
        { params: { job_id } }
    )
    return unwrap(res)
}

export async function submitStoryDetail(
    data: StoryDetailSubmission
): Promise<SuccessfulSubmission> {
    const res = await api.post<ApiResponse<SuccessfulSubmission>>(
        '/form/submit_story_detail',
        data
    )
    return unwrap(res)
}

// Payment
export interface GeneratePaymentLinkRequest { option: string, job_id?: number }
export async function generatePaymentLink(
    data: GeneratePaymentLinkRequest
): Promise<PaymentResponse> {
    const res = await api.post<ApiResponse<PaymentResponse>>(
        '/payment/generate_payment_link',
        data
    )
    return unwrap(res)
}

// Story retrieval
export async function getAvailableStories(): Promise<AvailableStoriesResponse> {
    const res = await api.get<ApiResponse<AvailableStoriesResponse>>(
        '/story/available_stories',
    )
    return unwrap(res)
}

// Story retrieval
export async function canContinueStories(): Promise<AvailableStoriesResponse> {
    const res = await api.get<ApiResponse<AvailableStoriesResponse>>(
        '/story/can_continue_story',
    )
    return unwrap(res)
}


export async function launchStoryGeneration (data: LaunchStoryGenerationRequest): Promise<SuccessfulSubmission> {
    const res = await api.post<ApiResponse<SuccessfulSubmission>>(`/story/launch_story_generation?job_id=${data.job_id}`)
    return unwrap(res)
}

export async function requestStory(
    job_id: number
): Promise<StoryResponse> {
    const res = await api.get<ApiResponse<StoryResponse>>(
        '/story/request_story',
        { params: { job_id } }
    )
    return unwrap(res)
}

export async function getAllStories(): Promise<StoriesResponse> {
    const res = await api.get<ApiResponse<StoriesResponse>>('/story/all_stories')
    return unwrap(res)
}

// Healthcheck
export async function healthcheck(): Promise<void> {
    const res = await api.get<ApiResponse<void>>('/health')
    unwrap(res)
}

import { ref } from 'vue'

export const isAuth = ref(checkAuth())

export function checkAuth(): boolean {
    console.log(localStorage.getItem('refresh_token'), localStorage.getItem('access_token'), !!localStorage.getItem('refresh_token') || !!localStorage.getItem('access_token'))
    return !!localStorage.getItem('refresh_token') || !!localStorage.getItem('access_token')
}

export function updateAuthStatus() {
    isAuth.value = checkAuth()
}

export async function logOut(): Promise<void> {
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('access_token')
    updateAuthStatus()
    await router.push('/auth')
}

// Response interceptor: auto-refresh token on expired signature
api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = (error.config as any)
        const errMsg = error.response?.data?.error || error.message
        if (!originalRequest._retry && errMsg === 'Signature has expired') {
            originalRequest._retry = true
            const refreshTokenStr = localStorage.getItem('refresh_token')
            if (refreshTokenStr) {
                try {
                    const tokens = await refreshToken(refreshTokenStr)
                    localStorage.setItem('access_token', tokens.access_token)
                    localStorage.setItem('refresh_token', tokens.refresh_token)
                    updateAuthStatus()
                    api.defaults.headers['Authorization'] = `Bearer ${tokens.access_token}`
                    originalRequest.headers['Authorization'] = `Bearer ${tokens.access_token}`
                    return api(originalRequest)
                } catch {
                    localStorage.removeItem('refresh_token')
                    localStorage.removeItem('access_token')
                    updateAuthStatus()
                    await router.push('/auth')
                    return Promise.reject(error)
                }
            }
        }
        return Promise.reject(error)
    }
)
