import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8800/api'
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


export const portfolioAPI = {
    get: () => api.get('/portfolio').then(res => res.data),
    update: (data) => api.put('/portfolio/update', data).then(res => res.data),
};

export const skillsAPI = {
    getAll: () => api.get('/skills').then(res => res.data),
    create: (data) => api.post('/skills/add', data).then(res => res.data),
    update: (id, data) => api.put(`/skills/update/${id}`, data).then(res => res.data),
    delete: (id) => api.delete(`/skills/delete/${id}`).then(res => res.data),
};

export const projectsAPI = {
    getAll: () => api.get('/projects').then(res => res.data),
    create: (data) => api.post('/projects/add', data).then(res => res.data),
    update: (id, data) => api.put(`/projects/update/${id}`, data).then(res => res.data),
    delete: (id) => api.delete(`/projects/delete/${id}`).then(res => res.data),
};

export const analyticsAPI = {
    get: () => api.get('/stats').then(res => res.data),
    getPublicStats: () => api.get('/stats/public').then(res => res.data),
    updateStat: (statType) => api.put('/stats/update', { statType }).then(res => res.data) 
};

export default api;