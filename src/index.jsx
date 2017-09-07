import React from 'react';
import { render } from 'react-dom';
import RepoList from './components/RepoList.jsx'

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            repos: []
        };
    }

    componentDidMount() {
        fetch('/api/repos', {
            credentials: 'include'
        })
        .then((response) => { return response.json(); })
        .then((json) => {
            this.setState({repos: json});
        });
    }

    render() {
        return (
            <div>
                <p>Hello Olinki!</p>
                <RepoList repos={this.state.repos} />
            </div>
        )
    }

}

render(<App/>, document.getElementById('app'));