export interface Reservation {
    id: string;
    user_id: string;
    start_time: string;
    end_time: string;
    description: string | null;
    created_at: string;
}

export interface ReservationFormData {
    start_time: string;
    end_time: string;
    description?: string;
}

export interface User {
    id: string;
    email: string;
}

export interface AuthState {
    user: User | null;
    session: any | null;
    loading: boolean;
}

export interface ApiError {
    message: string;
    status?: number;
} 