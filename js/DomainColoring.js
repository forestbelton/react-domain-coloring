import React from 'react';
import SquareContext from './SquareContext';

export default class DomainColoring extends React.Component {
    componentDidMount() {
        var ctx = new SquareContext(this.props);

        React.findDOMNode(this).appendChild(ctx.getDOMNode());
        ctx.render();

        this.setState({
            ctx: ctx
        });
    }

    componentDidUpdate(prevProps, prevState) {
        var dirty = false;

        if(this.props.width != prevProps.width ||
           this.props.height != prevProps.height) {
            this.state.ctx.setSize(this.props.width, this.props.height);
            dirty = true;
        }

        if(this.props.func != prevProps.func) {
            try {
                this.state.ctx.setFunc(this.props.func);
                dirty = true;
            } catch(e) {}
        }

        function domainNotEq(dom1, dom2) {
            return dom1[0] != dom2[0] ||
                dom1[1] != dom2[1];
        }

        if(domainNotEq(this.props.domain.x, prevProps.domain.x) ||
           domainNotEq(this.props.domain.y, prevProps.domain.y)) {
            this.state.ctx.setDomain(this.props.domain);
            dirty = true;
        }

        if(dirty) {
            this.state.ctx.render();
        }
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
        x: React.PropTypes.arrayOf(React.PropTypes.number).isRequired,
        y: React.PropTypes.arrayOf(React.PropTypes.number).isRequired
    }).isRequired
};

DomainColoring.defaultProps = {
    width:  500,
    height: 500
};
