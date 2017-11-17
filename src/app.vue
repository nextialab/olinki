<template>
<div>
    <p>Hello Olinki!</p>
    <table class="table">
        <thead>
            <tr>
                <th>Repo</th>
                <th>State</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="repo in repos" v-bind:key="repo.id">
                <td>{{repo.name}}</td>
                <td><i>{{repo.status}}</i></td>
                <td><button v-on:click="action(repo)">{{repo.action}}</button></td>
            </tr>
        </tbody>
    </table>
</div>
</template>

<script>
import axios from 'axios';
import cookies from 'browser-cookies';

export default {
    data: function () {
        return {
            repos: []
        }
    },
    mounted: function () {
        axios.get('/api/repos', {
            headers: {
                'Authorization': cookies.get('token')
            }
        }).then((response) => {
            this.repos = response.data.map((repo) => {
                let action = 'clone';
                switch (repo.status) {
                    case 'stopped':
                        action = 'run';
                        break;
                    case 'running':
                        action = 'stop';
                        break; 
                }
                repo.action = action;
                return repo;
            });
        }).catch((err) => {
            console.log(err);
        });
    },
    methods: {
        action: function (repo) {
            let body = JSON.stringify({
                repourl: repo.html_url,
                name: repo.name
            });
            let actions = {
                'clone': '/api/repos/clone',
                'run': '/api/docker/run',
                'stop': '/api/docker/stop'
            }
            axios.post(actions[repo.action], {
                repourl: repo.html_url,
                name: repo.name
            }, {
                headers: {
                    'Authorization': cookies.get('token')
                }
            }).then((response) => {
                switch (repo.status) {
                    case 'waiting':
                    case 'running':
                        repo.status = 'stopped';
                        repo.action = 'run';
                        break;
                    case 'stopped':
                        repo.status = 'running';
                        repo.action = 'stop';
                        break;
                }
            }).catch((err) => {
                console.log(err);
            });
        }
    }
}
</script>