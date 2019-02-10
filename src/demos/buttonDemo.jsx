import React, { Component, Fragment } from 'react';
import ReactSmartDOM from '../renderer/render';
import Button from '../components/Button';

import config from './config';

class BenjaminButtonApp extends Component {
    handleClick = () => {
        console.log('Gtk button clicked!')
    }

    render() {
        return (
            <Button
                label="Look ma, I'm from React!"
                onClick={this.handleClick}
            />
        );
    }
}

ReactSmartDOM.render(
    <BenjaminButtonApp />,
    'CONTAINER',
    () => {
        console.log('Rendered <%s />', BenjaminButtonApp.name);
    },
);
