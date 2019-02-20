import React, { Component, Fragment } from 'react';
import ReactGtk from '../renderer/ReactGtk';

import Button from '../components/Button';
import Grid from '../components/Grid';
import Label from '../components/Label';

import config from './config';

// TODO: open dev tools!
class DemoApp extends Component {
    state = {
        counter: 0,
        updatedAt: new Date().toTimeString()
    }

    updateCounter = (addedValue) => {
        this.setState(prevState => ({
            counter: prevState.counter + addedValue,
            updatedAt: new Date().toTimeString()
        }));
    }

    handleDecreaseClick = () => {
        this.updateCounter(-1);
    }

    handleIncreaseClick = () => {
        this.updateCounter(1);
    }

    render() {
        const {
            counter,
            updatedAt
        } = this.state;

        return (
            <Grid>
                <Button
                    label="-"
                    onClick={this.handleDecreaseClick}
                />
                <Label label={`Counter = ${counter}`} />
                <Button
                    label="+"
                    onClick={this.handleIncreaseClick}
                />
                <Label label={`    Last click at ${updatedAt}`} />
            </Grid>
        );
    }
}

ReactGtk.render(
    <DemoApp />,
    'CONTAINER',
    () => {
        console.log('Rendered <%s />', GripApp.name);
    },
);
