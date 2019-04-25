import { Auth } from 'aws-amplify'

const state = {
	authenticated: false,
	tokens: null,
	user: null
}

const getters = {
	getTokens(state) {
		return state.tokens
	},

	getUsername(state) {
		if(state.user == null || typeof state.user.username === undefined) {
			return ''
		}
		return state.user.username
	},

	getUserAttributes(state) {
		if(state.user == null || typeof state.user.attributes === undefined) {
			return ''
		}
		return state.user.attributes
	}
}

const actions = {
	registerLogin({commit}, user) {
		commit('setAuthState', true)
		commit('setUser', user)
		commit('setTokens', user.signInUserSession)
	},

	registerLogout({commit}) {
		commit('setAuthState', false)
	},

	logout({commit}) {
		Auth.signOut()
		.then(data => {
			commit('setUser', null)
			commit('setAuthState', false)
		}).catch(err => {
			alert(err)
		})
	},

	refreshUser({commit}) {
		return new Promise((resolve, reject) => {
			Auth.currentAuthenticatedUser()
			.then(user => {
				commit('setUser', user)
				resolve()
			}).catch(err => {
				reject(err)
			})
		})
	},

	refreshToken({commit}) {
		return new Promise((resolve, reject) => {
			Auth.currentSession()
			.then(data => {
				commit('setTokens', data)
				commit('setAuthState', true)
				resolve()
			}).catch(err => {
				commit('setAuthState', false)
				reject(err)
			})
		})
	}
}

const mutations = {
	setAuthState(state, authenticated) {
		state.authenticated = authenticated
	},

	setTokens(state, tokens) {
		state.tokens = tokens
	},

	setUser(state, user) {
		state.user = user
	}
}

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations
}