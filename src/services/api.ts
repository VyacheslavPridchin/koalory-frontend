// src/services/api.ts
import axios, { type AxiosInstance, type AxiosResponse } from 'axios'
import router from '@/router'
import { ref } from 'vue'

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

// Common notifier for JSON errors with { reason, target }
function notifyFromErrorValue(val: unknown) {
    let obj: any = null

    if (val && typeof val === 'object') {
        obj = val
    } else if (typeof val === 'string') {
        try {
            obj = JSON.parse(val)
        } catch {
            obj = null
        }
    }

    if (obj && obj.reason && obj.target) {
        window.dispatchEvent(new CustomEvent('koalory:notify', {
            detail: {
                title: 'Attention!',
                message: String(obj.reason),
                target: String(obj.target) as any,
            }
        }))
    }
}

// Helper to unwrap ApiResponse or throw error
function unwrap<T>(res: AxiosResponse<ApiResponse<T>>): T {
    const body = res.data
    if (!body.success) {
        notifyFromErrorValue(body.error)
        throw new Error(body.error || 'API error')
    }
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

// Register endpoints (return tokens)
export async function googleRegister(data: GoogleRequest): Promise<LoginResponse> {
    const res = await api.post<ApiResponse<LoginResponse>>('/register/google_register', data)
    return unwrap(res)
}

export async function emailRegister(data: EmailRequest): Promise<void> {
    const res = await api.post<ApiResponse<void>>('/register/email_register', data)
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

// Verification & Password Reset

export interface CreateVerificationRequest { email: string }
export async function createVerification(data: CreateVerificationRequest): Promise<void> {
    const res = await api.post<ApiResponse<void>>('/verification/create', data)
    unwrap(res)
}

export interface VerifyCodeRequest { email: string; code: string }
export async function verifyCode(data: VerifyCodeRequest): Promise<LoginResponse> {
    const res = await api.post<ApiResponse<LoginResponse>>('/verification/verify', data)
    return unwrap(res)
}

export interface ResetRequest { email: string }
export async function requestPasswordReset(data: ResetRequest): Promise<void> {
    const res = await api.post<ApiResponse<void>>('/auth/reset', data)
    unwrap(res)
}

export interface ResetVerificationRequest { token: string; password: string }
export async function resetPassword(data: ResetVerificationRequest): Promise<void> {
    const res = await api.post<ApiResponse<void>>('/auth/reset_verification', data)
    unwrap(res)
}

export interface InformationResponse { name: string }
export async function getInformation(job_id: number): Promise<InformationResponse> {
    const res = await api.post<ApiResponse<InformationResponse>>('/get_info?job_id=' + job_id)
    return unwrap(res)
}

export const isAuth = ref(checkAuth())

export function checkAuth(): boolean {
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
    async (error: any) => {
        const originalRequest = error.config || {}
        const res = error.response
        const payload = res?.data
        const rawErrValue = (payload && typeof payload === 'object')
            ? (payload as any).error ?? payload
            : payload ?? error.message

        // Fire notification if error contains JSON { reason, target }
        notifyFromErrorValue(rawErrValue)

        const errMsg = String(
            (payload && typeof payload === 'object' && (payload as any).error)
            ?? error.message
            ?? ''
        )

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
                    if (!originalRequest.headers) originalRequest.headers = {}
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
