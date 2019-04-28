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
		/*API.axios = axios.create({
			baseURL: '/api',
			timeout: 30000
		})
*/
		Vue.mixin({
			methods: {
				call: function(){
					/*API.refreshToken().then(() => {
						//console.log(API.getTokens().idToken.jwtToken)

						let request = {
							url: '/minecraft',
							method: 'get',
							headers: {'Authorization': API.getTokens().idToken.jwtToken}
						}

						API.axios.request(request).then(data => {
							console.log(data)
						}).catch(err => {console.log(err)})
					})*/
				}
			}
		})
	}
}

export default API