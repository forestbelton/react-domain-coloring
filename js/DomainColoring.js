import React from 'react';
import SquareContext from './SquareContext';

class DomainColoring extends React.Component {
    componentDidMount() {
        var ctx = new SquareContext(
            this.props.width,
            this.props.height,
            this.props.func
        );

        React.findDOMNode(this).appendChild(
            ctx.getDOMNode()
        );

        ctx.render();
    }

    render() {
        return <div />;
    }
}

DomainColoring.propTypes = {
    func:   React.PropTypes.string,
    width:  React.PropTypes.number,
    height: React.PropTypes.number,
    domain: React.PropTypes.shape({
        x: React.PropTypes.arrayOf(React.PropTypes.number),
        y: React.PropTypes.arrayOf(React.PropTypes.number),
    })
};

module.exports = DomainColoring;
