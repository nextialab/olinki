import React from 'react';
import RepoListItem from './RepoListItem.jsx';

class RepoList extends React.Component {

    render() {
        const items = this.props.repos.map((repo, index) => {
            return <RepoListItem key={index} name={repo.name} />
        });
        return (
            <ul>{items}</ul>
        )
    }

}

export {RepoList as default }