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
				<div v-if="userDropdown" class="dropdown-content" v-on-clickaway="hideDropdown">
					<a class="dropdown-item">Settings</a>
					<a class="dropdown-item" @click="logout()">Sign out</a>
				</div>
			</div>
		</li>

	</ul>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import {mixin as clickaway} from 'vue-clickaway'

export default {
	name: "navbar",
	mixins: [clickaway],
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
				},
				{
					name: 'Minecraft',
					link: '/minecraft'
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
		}),

		hideDropdown: function(){
			this.userDropdown = false
		}
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
	-moz-user-select: none; /* mozilla browsers */
	-khtml-user-select: none; /* webkit browsers */
}

.dropdown-content:hover,
li.navbar-page .link:hover {
	background-color: #333333;
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
	position: absolute;
	z-index: 1;
	display: block;
	overflow: hidden;
	border-style: solid;
	border-width: 2px;
	min-width: 50px;
}

.dropdown-item {
	display: block;
	cursor: pointer;
	text-align: left;
	background-color: #ffffff;
	color: black;
	padding: 4px;
}

.dropdown-item:hover {
	background-color: #333333;
	color: white;
}
</style>