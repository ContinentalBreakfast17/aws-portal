<template>
	<div id="auth">
		<div id="err" v-if="loginError !== ''">
			{{loginError}}
		</div>

		<div id="notice" v-if="notice !== ''">
			{{notice}}
		</div>

		<div id="login" v-if="currentRender === renders.loginForm">
			<span style="display: block;">Username: <input type="text" v-model="renders.loginForm.username" @keyup.enter="login()"/></span>
			<span style="display: block;">Password: <input type="password" v-model="renders.loginForm.password" @keyup.enter="login()"/></span>
			<span style="display: block;"><button @click="login()">Sign In</button></span>
			<a @click="currentRender = renders.forgotPassword">Forgot password?</a>
		</div>

		<div id="mfa" v-if="currentRender === renders.mfaForm">
			<span style="display: block;">Enter code: <input type="text" v-model="renders.mfaForm.code" @keyup.enter="mfaCode()"/></span>
			<button @click="mfaCode()">Submit</button>
		</div>

		<div id="newPass" v-if="currentRender === renders.newPasswordForm">
			<span style="display: block;">Enter new password: <input type="password" v-model="renders.newPasswordForm.password" @keyup.enter="newPass()"/></span>
			<span style="display: block;">Confirm new password: <input type="password" v-model="renders.newPasswordForm.confirmPass" @keyup.enter="newPass()"/></span>
			<div v-for="attribute in renders.newPasswordForm.requiredAttributes" v-bind:key="attribute.field">
				<span style="display: block;">Enter your {{attribute['name']}}: <input type="text" v-bind="attribute['value']" @keyup.enter="newPass()"/></span>
			</div>
			<button @click="newPass()">Submit</button>
		</div>

		<div id="forgotPass" v-if="currentRender === renders.forgotPassword">
			<span style="display: block;">
				Enter email address to send password reset to: 
				<input type="text" v-model="renders.forgotPassword.email" @keyup.enter="forgotPassSendEmail()"/>
				<button @click="forgotPassSendEmail()">Submit</button>
			</span>
		</div>

		<div id="forgotPassCode" v-if="currentRender === renders.forgotPasswordForm">
			<span>An code been sent to {{renders.forgotPasswordForm.email}}. Enter the code and a new password to reset your password.</span>
			<span style="display: block;">Verification code: <input type="text" v-model="renders.forgotPasswordForm.code" @keyup.enter="forgotPassSubmit()"/></span>
			<span style="display: block;">Enter new password: <input type="password" v-model="renders.forgotPasswordForm.password" @keyup.enter="forgotPassSubmit()"/></span>
			<span style="display: block;">Confirm new password: <input type="password" v-model="renders.forgotPasswordForm.confirmPass" @keyup.enter="forgotPassSubmit()"/></span>
			<button @click="forgotPassSubmit()">Submit</button>
		</div>

	</div>
</template>

<script>
import { Auth } from 'aws-amplify'
import { components } from 'aws-amplify-vue';
import { mapActions } from 'vuex'

export default {
	name: 'auth',
	components: {
		...components
	},
	data: function(){
		return {
			user: null,
			loginError: '',
			notice: '',
			currentRender: null,
			renders: {}
		}
	},
	methods: {
		...mapActions({
			registerLogin: 'auth/registerLogin'
		}),

		newRenders: function(){
			return {
				// username + password login
				loginForm: {
					username: '',
					password: ''
				},
				// verify mfa code
				mfaForm: {
					type: '',
					code: ''
				},
				// new password requried by aws cognito
				newPasswordForm: {
					requiredAttributes: [],
					password: '',
					confirmPass: ''
				},
				// enter email to send reset code to
				forgotPassword: {
					email: ''
				},
				// enter new password with confirmation code
				forgotPasswordForm: {
					email: '',
					code: '',
					password: '',
					confirmPass: ''
				}
			}
		},

		// TODO: maybe make all these take a parameter instead so we can reuse them?
		login: function(){
			Auth.signIn({
				'username': this.renders.loginForm.username,
				'password': this.renders.loginForm.password
			}).then(user => {
				this.user = user
				this.renders.password = ''

				// handle MFA, new password required, and email verification https://aws-amplify.github.io/docs/js/authentication#common-authentication-use-cases
				if(user.challengeName === 'SMS_MFA' || user.challengeName === 'SOFTWARE_TOKEN_MFA') {
					this.renders.mfaForm.type = user.challengeName
					this.currentRender = this.renders.mfaForm
				} else if(user.challengeName === 'NEW_PASSWORD_REQUIRED') {
					let { requiredAttributes } = user.challengeParam
					this.renders.newPasswordForm.requiredAttributes = []
					for(let attribute in requiredAttributes) {
						this.renders.newPasswordForm.requiredAttributes.push({'field': attribute, 'name': attribute.replace(/_/g, ' '), 'value': ''})
					}
					this.currentRender = this.renders.newPasswordForm
				} else if(user.challengeName === 'MFA_SETUP') {
					// do something
				}else {
					this.registerLogin(user)
					this.reset()
				}
			}).catch(err => {
				this.reset()

				if(err.code === 'PasswordResetRequiredException') {
					this.loginError = 'Your password needs to be reset, click forget password to proceed'
				} else if(err.code === 'NotAuthorizedException' || err.code === 'UserNotFoundException') {
					this.loginError = 'Incorrect username or password'
				} else {
					this.loginError = 'Unexpected error - ' + err
				}
			});
		},

		mfaCode: function(){
			Auth.confirmSignIn(this.user, this.renders.mfaForm.code, this.renders.mfaForm.type)
			.then((user) => {
				this.registerLogin(user)
				this.reset()
			}).catch(err => {
				this.loginError = 'Unexpected error - ' + err
			})	
		},

		newPass: function(){
			if(this.renders.newPasswordForm.password !== this.renders.newPasswordForm.confirmPass) {
				this.loginError = 'Passwords must match'
				return
			}

			let attributes = {}
			for(let attribute in this.renders.newPasswordForm.requiredAttributes) {
				attributes[attribute['field']] = attribute['value']
			}

			Auth.completeNewPassword(this.user, this.renders.newPasswordForm.password, attributes)
			.then((user) => {
				this.registerLogin(user)
				this.reset()
			})
			.catch(err => {
				this.loginError = 'Unexpected error - ' + err
			})
		},

		forgotPassSendEmail: function(){
			Auth.forgotPassword(this.renders.forgotPassword.email)
			.then(() => {
				this.renders.forgotPasswordForm.email = this.renders.forgotPassword.email
				this.currentRender = this.renders.forgotPasswordForm
			})
			.catch(err => {
				this.loginError = 'Unexpected error - ' + err
			})
		},

		forgotPassSubmit: function(){
			if(this.renders.forgotPasswordForm.password !== this.renders.forgotPasswordForm.confirmPass) {
				this.loginError = 'Passwords must match'
				return
			}

			Auth.forgotPasswordSubmit(this.renders.forgotPasswordForm.email, this.renders.forgotPasswordForm.code, this.renders.forgotPasswordForm.password)
			.then(() => {
				this.reset()
				this.notice = 'Your password has been reset successfully. Please log in with your new password'
			})
			.catch(err => {
				this.loginError = 'Unexpected error - ' + err
			})
		},

		reset: function(){
			this.renders = this.newRenders()
			this.notice = ''
			this.loginError = ''
			this.user = null
			this.currentRender = this.renders.loginForm
		}
	},
	mounted: function(){
		this.reset()
	}
}
</script>

<style>
#auth {
	margin-top: 60px;
}
</style>