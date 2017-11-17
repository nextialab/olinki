<template>
<form>
	<div class="form-group">
		<input type="text" class="form-control" placeholder="Username" name="username" v-model="username" />
	</div>
	<div class="form-group">
		<input type="password" class="form-control" placeholder="Password" name="password" v-model="password" />
	</div>
	<div class="form-group">
		<button class="btn btn-default" type="button" v-on:click="login(username, password)">Login</button>
	</div>
</form>
</template>

<script>
import axios from 'axios';
import cookies from 'browser-cookies';

export default {
	data: function () {
		return {
			username: '',
			password: ''
		}
	},
	methods: {
		login: function (username, password) {
			if (username !== '' && password !== '') {
				axios.post('/login', {
					username: username,
					password: password
				}).then(function (response) {
					cookies.set('token', response.data.token);
				}).catch(function (err) {
					console.log(err);
				});
			}
		}
	}
}
</script>