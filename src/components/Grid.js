import React from 'react';

class Grid extends React.Component {
    render() {
        return (
            <widget
                type="grid"
            >
                {this.props.children}
            </widget>
        );
    }
}

export default Grid;
