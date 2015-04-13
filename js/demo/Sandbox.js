import React from 'react';
import DomainColoring from '../DomainColoring';

class Sandbox extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            func: 'z'
        };
    }

    setFunc(func) {
        this.setState({
            busy: null,
            func: func
        });
    }

    update(e) {
        const func = e.target.value;

        if(this.state.busy) {
            clearTimeout(this.state.busy);
        }

        this.setState({
            busy: setTimeout(() => this.setFunc(func), 500)
        });
    }

    render() {
        const update = this.update.bind(this);
        const domain = {
            x: [-Math.PI, Math.PI],
            y: [-Math.PI, Math.PI]
        };

        return (
            <div>
                <b>f(z) = </b>
                <input type="text" defaultValue={this.state.func}
                    onKeyUp={update} />
                <DomainColoring width={300} height={300}
                    domain={domain} func={this.state.func} />
            </div>
        );
    }
}

module.exports = Sandbox;


