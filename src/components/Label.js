import React from 'react';

class Label extends React.Component {
    render() {
        return (
            <widget
                {...this.props}
                type="label"
            />
        );
    }
}

export default Label;
