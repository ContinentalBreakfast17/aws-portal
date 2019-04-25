<template>
	<div id="app">
		<div v-if="authenticated">
			<span>Hello {{username}}</span>
			<div id="nav">
				<router-link to="/">Home</router-link> |
				<router-link to="/about">About</router-link> |
				<a @click="logout()">Logout</a>
			</div>
			<router-view/>
		</div>

		<div v-if="!authenticated">
			<auth ref="authenticator"/>
		</div>
	</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import auth from './components/auth.vue'

export default {
	name: 'App',
	components: {
		auth
	},
	computed: {
		...mapState({
			authenticated: state => state.auth.authenticated
		}),
		...mapGetters({
			username: 'auth/getUsername'
		})
	},
	methods: {
		...mapActions({
			refreshToken: 'auth/refreshToken',
			refreshUser: 'auth/refreshUser',
			logout: 'auth/logout'
		})
	},
	mounted: function(){
		this.refreshUser()
		.then(() => {
			this.refreshToken().catch(err => {})
		}).catch(err => {})
	}
}
</script>

<style>
#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;
}
</style>
