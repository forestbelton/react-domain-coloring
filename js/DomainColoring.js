import React from 'react';
import SquareContext from './SquareContext';

class DomainColoring extends React.Component {
    draw() {
        try {
            this.state.ctx.draw(this.props.func, this.props.domain);
            this.state.ctx.render();
        } catch(e) {
            console.log(e);
        }
    }

    componentDidMount() {
        var ctx = new SquareContext(
            this.props.width,
            this.props.height,
            this.props.func,
            this.props.domain
        );

        React.findDOMNode(this).appendChild(ctx.getDOMNode());

        this.setState({
            ctx: ctx
        });
    }

    componentDidUpdate(prevProps, prevState) {
        this.draw();
    }

    render() {
        return <div />;
    }
}

DomainColoring.propTypes = {
    func:   React.PropTypes.string.isRequired,
    width:  React.PropTypes.number,
    height: React.PropTypes.number,
    domain: React.PropTypes.shape({
        x: React.PropTypes.arrayOf(React.PropTypes.number),
        y: React.PropTypes.arrayOf(React.PropTypes.number),
    })
};

module.exports = DomainColoring;
