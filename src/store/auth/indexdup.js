
const user = (() => {
    const userString = localStorage.getItem('user')
    return typeof userString === "string" ? JSON.parse(userString) : null
})()

const initialState = user
    ? { status: { loggedIn: true }, user }
    : { status: { loggedIn: false }, user: null };

const auth = {
    namespaced: true,
    state: initialState,
    actions: {
        login({ commit }, user, error) {
            if(error) {
                commit('loginFailure');
            } else {
                commit('loginSuccess', user);
            }
        },
        logout({ commit }) {
            localStorage.removeItem('user');
            //AuthService.logout();
            commit('logout');
        },
        register({ commit }, user, error) {
            if(error) {
                commit('registerFailure')
            } else {
                commit('registerSuccess')
            }
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
};

export default auth