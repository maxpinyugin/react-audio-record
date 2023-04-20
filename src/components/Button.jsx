import React, { Component } from 'react';

class Button extends Component {
    render() {
        const { title } = this.props

        return (
            <input type="button" className="btn btn-primary" value={title} />
        );
    }
}

export default Button