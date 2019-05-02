<template>
	<div id="minecraft">
		<h1>Here is some data from the API :)</h1>
		{{ msg }}
	</div>
</template>

<script>
export default {
	name: 'minecraft',
	data: function(){
		return {
			msg: ''
		}
	},
	methods: {
		callAPI: function(){
			//this.call().then(data => this.msg = JSON.stringify(JSON.parse(data),null,4)).catch(err => this.msg = err)
			this.call().then(data => this.msg = data).catch(err => this.msg = err)
		}
	},
	mounted: function(){
		this.callAPI()
	}
}
</script>