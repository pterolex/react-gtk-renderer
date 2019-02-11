import React, { Component, Fragment } from 'react';
import ReactGtk from '../renderer/ReactGtk';
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

ReactGtk.render(
    <BenjaminButtonApp />,
    'CONTAINER',
    () => {
        console.log('Rendered <%s />', BenjaminButtonApp.name);
    },
);
