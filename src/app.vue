<template>
	<div id="app">
		<div v-if="authenticated">
			<navbar/>
			<router-view class="main"/>
		</div>

		<div v-if="!authenticated">
			<auth ref="authenticator"/>
		</div>
	</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import auth from './components/auth.vue'
import navbar from './components/navbar.vue'

export default {
	name: 'App',
	components: {
		auth,
		navbar
	},
	computed: {
		...mapState({
			authenticated: state => state.auth.authenticated
		})
	},
	methods: {
		...mapActions({
			refreshToken: 'auth/refreshToken',
			refreshUser: 'auth/refreshUser'
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
}

.main {
	margin-top: 0px;
}
</style>
