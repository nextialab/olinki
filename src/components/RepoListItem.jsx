import React from 'react';

class RepoListItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            cloned: false
        };
        this.cloneRepo = this.cloneRepo.bind(this);
    }

    cloneRepo() {
        console.log(this.props.repo.html_url);
        fetch('/api/repos/clone', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                repourl: this.props.repo.html_url
            }
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