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
export default {
    data: function () {
        return {
            repos: []
        }
    },
    mounted: function () {
        fetch('/api/repos', {
            credentials: 'include'
        })
        .then((response) => { return response.json(); })
        .then((json) => {
            this.repos = json.map((repo) => {
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
            fetch(actions[repo.action], {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: body
            })
            .then((response) => { return response.json(); })
            .then((json) => {
                console.log(json);
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
            });
        }
    }
}
</script>