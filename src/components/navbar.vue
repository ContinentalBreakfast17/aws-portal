<template>
	<ul id="navbar" class="navbar">

		<div v-for="page in pages" :key="page.name">
			<li class="navbar-page">
				<router-link :to="page.link" exact-active-class="active-link" class="link">{{page.name}}</router-link>
			</li>
		</div>

		<li class="navbar-user">
			<div class="dropdown">
				<a @click="userDropdown = !userDropdown" class="dropdown-trigger">{{username}} <i class="fa fa-caret-down"></i></a>
				<div v-if="userDropdown" class="dropdown-content">
					<a @click="logout()">Sign out</a>
				</div>
			</div>
		</li>

	</ul>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'

export default {
	name: "navbar",
	data: function(){
		return {
			pages: [
				{
					name: 'Home',
					link: '/'
				},
				{
					name: 'About',
					link: '/about'
				}
			],
			userDropdown: false
		}
	},
	computed: {
		...mapGetters({
			username: 'auth/getUsername'
		})
	},
	methods: {
		...mapActions({
			logout: 'auth/logout'
		})
	}
}
</script>

<style>
ul.navbar {
	list-style-type: none;
	margin: 0;
	padding: 0;
	overflow: hidden;
	background-color: #666;
	width: 100%;
	display: block;
}

li.navbar-page {
	float: left;
}

li.navbar-user {
	float: right;
}

li.navbar-user .dropdown-trigger,
li.navbar-page .link {
	display: block;
	color: white;
	text-align: center;
	padding: 14px 16px;
	text-decoration: none;
	color: white;
}

.dropdown-content:hover,
li.navbar-page .link:hover {
	background-color: #333;
}

li.navbar-user .dropdown-trigger:hover {
	cursor: pointer;
}

.active-link {
	background-color: #27b;
}

.dropdown {
	float: right;
	overflow: hidden;
}

.dropdown-trigger {
	.display: inline-block;
}

.dropdown-content {
	cursor: pointer;
	position: absolute;
	z-index: 1;
	display: block;
	min-width: 160px;
	text-align: left;
	background-color: #999;
	overflow: hidden;
	color: white;
}
</style>