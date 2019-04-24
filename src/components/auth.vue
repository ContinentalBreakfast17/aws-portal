<template>
	<div class="auth">
		<span style="display: block;">Username: <input type="text" v-model="username" @keyup.enter="login"/></span>
		<span style="display: block;">Password: <input type="password" v-model="password" @keyup.enter="login"/></span>
		<button @click="login()">Sign In</button>
	</div>
</template>

<script>
import { Auth } from 'aws-amplify'
import { components, AmplifyEventBus } from 'aws-amplify-vue';
import VueCookies from 'vue-cookies'

export default {
	name: 'auth',
	components: {
		...components,
		AmplifyEventBus
	},
	data: function(){
		return {
			username: '',
			password: ''
		}
	},
	methods: {
		login: function(){
			Auth.signIn({
				'username': this.username,
				'password': this.password
			}).then(user => {
				// handle MFA and new password required https://aws-amplify.github.io/docs/js/authentication#common-authentication-use-cases
				console.log(user)
				this.getToken()
				this.$emit('authSuccess')
			}).catch(err => {
				console.log(err)
			});
		},
		getToken: function(){
			Auth.currentSession()
			.then(data => {
				console.log(data)
			}).catch(err => {
				console.log(err)
			});
		}
	},
	mounted: function(){

	}
}
</script>
