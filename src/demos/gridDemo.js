import React, { Component, Fragment } from 'react';
import ReactGtk from '../renderer/ReactGtk';

import Button from '../components/Button';
import Grid from '../components/Grid';
import Label from '../components/Label';

import config from './config';

class GripApp extends Component {
    state = {
        counter: 0,
        updatedAt: new Date().toTimeString()
    }

    componentDidMount() {
        setInterval(() => {
            this.setState(prevState => ({
                counter: prevState.counter + 1
            }));
        }, 1000);
    }

    handleClick = () => {
        this.setState(prevState => ({
            counter: 0,
            updatedAt: new Date().toTimeString()
        }));
    }

    render() {
        const {
            counter,
            updatedAt
        } = this.state;

        return (
            <Grid>
                <Button
                    label="Stop counter"
                    onClick={this.handleClick}
                />
                <Label label={`Counter = ${counter}`} />
                <Label label={`    Last click at ${updatedAt}`} />
            </Grid>
        );
    }
}

ReactGtk.render(
    <GripApp />,
    'CONTAINER',
    () => {
        console.log('Rendered <%s />', GripApp.name);
    },
);
