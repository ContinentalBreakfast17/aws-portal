import axios from 'axios'
import { mapActions, mapGetters } from 'vuex'

const API = {
	axios: {},
	...mapGetters({
		getTokens: 'auth/getTokens'
	}),
	...mapActions({
		refreshToken: 'auth/refreshToken'
	}),

	install: function(Vue, options) {
		API.axios = axios.create({
			baseURL: '/api',
			timeout: 30000
		})

		Vue.mixin({
			methods: {
				call: function(){
					return API.refreshToken().then(() => {
						let request = {
							url: 'https://4awymbocy5.execute-api.us-east-2.amazonaws.com/api/minecraft/test',
							method: 'get',
							headers: {'Authorization': API.getTokens().idToken.jwtToken}
						}

						return API.axios.request(request)
					})
				}
			}
		})
	}
}

export default API