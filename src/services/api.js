import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const getToken = () => localStorage.getItem('accessToken');

apiClient.interceptors.request.use(
    (config) => {
        const token = getToken();
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


// --- User & Auth ---
export const signupUser = (userData) => apiClient.post('/users/signup', userData);

export const loginUser = (credentials) => {
        const formData = new URLSearchParams();
        formData.append('username', credentials.email);
        formData.append('password', credentials.password);
        return apiClient.post('/users/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
};

export const fetchCurrentUser = () => apiClient.get('/users/me');

// --- Clubs ---
export const getAllClubs = () => apiClient.get('/clubs/');
export const getClubById = (clubId) => apiClient.get(`/clubs/${clubId}`);
export const createClub = (clubData) => apiClient.post('/clubs/', clubData);
export const joinClub = (clubId) => apiClient.post(`/clubs/${clubId}/join`);

// --- Events ---
export const getAllEvents = () => apiClient.get('/events/');
export const createEvent = (clubId, eventData) => apiClient.post(`/events/?club_id=${clubId}`, eventData);
export const registerForEvent = (eventId) => apiClient.post(`/events/${eventId}/register`);

// --- Announcements ---
export const createAnnouncement = (clubId, announcementData) => apiClient.post(`/clubs/${clubId}/announcements`, announcementData);
// ... keep all existing functions ...

// Add this new function at the end of the User & Auth section
export const getMyClubs = () => apiClient.get('/users/me/administered-clubs');

// And add this one for recommendations from Phase 5
export const getRecommendedEvents = () => apiClient.get('/events/recommendations');
// --- Admin ---
export const getAllUsers = () => apiClient.get('/admin/users');
export const updateUserRole = (userId, newRole) => apiClient.put(`/admin/users/${userId}/role?new_role=${newRole}`);
export const deleteUser = (userId) => apiClient.delete(`/admin/users/${userId}`);