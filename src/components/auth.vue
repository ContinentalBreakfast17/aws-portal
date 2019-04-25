<template>
	<div class="auth">
		<span style="display: block;">Username: <input type="text" v-model="username" @keyup.enter="login"/></span>
		<span style="display: block;">Password: <input type="password" v-model="password" @keyup.enter="login"/></span>
		<button @click="login()">Sign In</button>
	</div>
</template>

<script>
import { Auth } from 'aws-amplify'
import { components } from 'aws-amplify-vue';
import { mapState, mapActions } from 'vuex'

export default {
	name: 'auth',
	components: {
		...components
	},
	data: function(){
		return {
			username: '',
			password: ''
		}
	},
	methods: {
		...mapActions({
			registerLogin: 'auth/registerLogin',
			registerLogout: 'auth/registerLogout'
		}),

		login: function(){
			Auth.signIn({
				'username': this.username,
				'password': this.password
			}).then(user => {
				// handle MFA, new password required, and email verification https://aws-amplify.github.io/docs/js/authentication#common-authentication-use-cases
				this.registerLogin(user)
			}).catch(err => {
				console.log(err)
				this.registerLogout()
			});
		}
	},
	mounted: function(){

	}
}
</script>
