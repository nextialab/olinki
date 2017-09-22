<template>
<div>
    <p>Hello Olinki!</p>
    <table>
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
                <td><i v-if="repo.cloned">cloned</i><i v-else>preparing</i></td>
                <td><button v-if="!repo.cloned" v-on:click="clone(repo)">Clone</button></td>
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
            this.repos = json;
        });
    },
    methods: {
        clone: function (repo) {
            var body = JSON.stringify({
                repourl: repo.html_url,
                name: repo.name
            });
            fetch('/api/repos/clone', {
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
                repo.cloned = true;
            });
        }
    }
}
</script>