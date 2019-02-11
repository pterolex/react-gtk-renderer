import React, { Component, Fragment } from 'react';
import ReactGtk from '../renderer/ReactGtk';
import Button from '../components/Button';

import config from './config';

class BenjaminButtonApp extends Component {
    state = {
        counter: 0
    }

    componentDidMount() {
        setInterval(() => {
            this.setState(prevState => ({
                counter: prevState.counter + 1
            }));
        }, 5000);
    }

    handleClick = () => {
        console.log('Gtk button clicked!')
        this.setState(prevState => ({
            counter: 0
        }));
    }

    render() {
        return (
            <Button
                label={'Counter = ' + this.state.counter}
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
