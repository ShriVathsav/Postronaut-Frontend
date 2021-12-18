import axios from 'axios'

//const API_URL2 = 'http://localhost:5000/api/auth/'

class AuthService {
    login(user) {
        console.log(user, "FROM AUTHSERVICE")
        return axios.post('/api/auth/signin', {
            email: user.email,
            password: user.password
        })
        .then(response => {
            console.log(response, "RESPONSE FDROM AUTH SERVICE")
            if (response.data.token) {
                console.log(response.data.token)
                localStorage.setItem('user', JSON.stringify(response.data))
            }

            return response.data;
        })
    }

    logout() {
        localStorage.removeItem('user');
    }

    register(user) {
        return axios.post('/api/auth/signup', {
            username: user.username,
            email: user.email,
            password: user.password,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        })
    }
}

export default new AuthService()