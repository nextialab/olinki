import React from 'react';

class RepoListItem extends React.Component {

    render() {
        return (
            <li>{this.props.name}</li>
        )
    }

}

export { RepoListItem as default }