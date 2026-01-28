const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

class ApiClient {
    private baseUrl: string
    constructor() {
        this.baseUrl = API_BASE_URL;
    }

    //request method (CAN BE USED FOR ALL API CALLS)
    async request(endpoint: string, options: RequestInit = {}) {
        //url end point
        const url = `${this.baseUrl}${endpoint}`
        //request configurations
        const config: RequestInit = {
            // configure the headers
            headers: {
                "Content-Type": "application/json",
                ...options.headers
            },
            //once you logged in you have the token in your cookies, and you must make every request with that token
            credentials: "include", //important to cookies
            ...options
        }

        //request's response
        const response = await fetch(url, config)

        // Handle Erros
        if (response.status === 401) return null;

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: "Network Error" }));
            throw new Error(error.error || "Request Failed")
        }

        return await response.json();

    }

    //API Methods

    //Auth APIs 
    async register(userData: unknown) {
        return this.request("/api/auth/register", {
            method: "POST",
            body: JSON.stringify(userData)
        })
    }
    async login(email: string, password: string) {
        return this.request("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password })
        })
    }
    async logout() {
        return this.request("/api/auth/logout", {
            method: "POST",
        })
    }
    async getCurrentUser() {
        return this.request("/api/auth/me")
    }


    //User APIs
    async getAllUsers() {
        return this.request("/api/user")
    }

    //Admin APIs
    async updateUserRole(userId: string, role: string) {
        return this.request(`/api/user/${userId}/role`, {
            method: "PATCH",
            body: JSON.stringify({ role })
        })
    }
    async assignUserToTeam(userId: string, teamId: string | null) {
        return this.request(`/api/user/${userId}/team`, {
            method: "PATCH",
            body: JSON.stringify({ teamId })
        })
    }

}

export const apiClient = new ApiClient();
