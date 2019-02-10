import React from 'react';

class Button extends React.Component {
    handleClick = (data) => {
        console.log('Button/action', data);
        const {
            onClick,
        } = this.props;

        if (onClick) {
            onClick(data);
        }
    }

    render() {
        return (
            <widget
                type="button"
                onClick={this.handleClick}
            />
        );
    }
}

export default Button;
