const state = {
	authenticated: false
}

const getters = {
	
}

const actions = {
	signIn({commit}, user) {
		commit('setAuthState', true)
	},

	signOut({commit}) {
		commit('setAuthState', false)
	}
}

const mutations = {
	setAuthState(state, authenticated) {
		console.log(authenticated)
		state.authenticated = authenticated
	}
}

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations
}