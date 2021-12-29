import AuthService from '../../services/auth.service';

const user = JSON.parse(localStorage.getItem('user'));
const initialState = user
    ? { status: { loggedIn: true }, user }
    : { status: { loggedIn: false }, user: null };

export const auth = {
    namespaced: true,
    state: initialState,
    actions: {
        login({ commit }, user) {
            return AuthService.login(user).then(
                user => {
                    commit('loginSuccess', user);
                    return Promise.resolve(user);
                },
                error => {
                    console.log(error, "ERROR FROM VUEX MODILE")
                    commit('loginFailure');
                    return Promise.reject(error);
                }
            )
        },
        logout({ commit }) {
            AuthService.logout();
            commit('logout');
        },
        register({ commit }, user) {
            return AuthService.register(user).then(
                response => {
                    commit('registerSuccess');
                    return Promise.resolve(response.data);
                },
                error => {
                    commit('registerFailure');
                    return Promise.reject(error);
                }
            );
        },
        loginFailure({commit}) {
            commit('loginFailure')
        },
        registerFailure({ commit }) {
            commit('registerFailure')
        },
        changeProfileImage({ commit }, profilePicUrl) {
            commit('changeProfileImage', profilePicUrl)
        }
    },
    mutations: {
        loginSuccess(state, user) {
            state.status.loggedIn = true;
            state.user = user;
        },
        loginFailure(state) {
            state.status.loggedIn = false;
            state.user = null;
        },
        logout(state) {
            state.status.loggedIn = false;
            state.user = null;
        },
        registerSuccess(state) {
            state.status.loggedIn = false;
        },
        registerFailure(state) {
            state.status.loggedIn = false;
        },
        changeProfileImage(state, profilePicUrl) {
            let user = {...state.user}
            user.profilePicUrl = profilePicUrl
            state.user = user
            localStorage.setItem('user', JSON.stringify(user))        
        }
    },
    getters: {
        isAuthenticated(state){
            return !!state.status.loggedIn && !!state.user
        }
    }
}