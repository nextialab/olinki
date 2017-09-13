import React from 'react';

class RepoListItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            cloned: props.repo.cloned
        };
        this.cloneRepo = this.cloneRepo.bind(this);
    }

    cloneRepo() {
        var body = JSON.stringify({
            repourl: this.props.repo.html_url,
            name: this.props.repo.name
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
            this.setState({cloned: true});
        });
    }

    render() {
        if (this.state.cloned) {
            return (
                <li>{this.props.repo.name} <i>Cloned</i></li>
            )
        } else {
            return (
                <li>{this.props.repo.name} <button onClick={this.cloneRepo}>Clone</button></li>
            )
        }
    }

}

export { RepoListItem as default }