<template>
	<div id="app">
		<div v-if="authenticated">
			<div id="nav">
				<router-link to="/">Home</router-link> |
				<router-link to="/about">About</router-link> |
				<router-link to="/login">Login</router-link>
			</div>
			<router-view/>
		</div>

		<div v-if="!authenticated">
			<auth @authSuccess="signIn()"/>
		</div>
	</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import auth from './components/auth.vue'

export default {
	name: 'App',
	components: {
		auth
	},
	computed: {
		...mapState({
			authenticated: state => state.auth.authenticated
		})
	},
	methods: {
		...mapActions({
			signIn: 'auth/signIn'
		})
	},
	mounted: function(){

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
