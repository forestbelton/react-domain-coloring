import React from 'react';
import DomainColoring from '../DomainColoring';
import Dropzone from 'react-dropzone';

export default class Sandbox extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            func: 'z',
            files: []
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

    onDrop (files) {
        debugger;
        this.state.files.push.apply(this.state.files, files);
        this.setState({});
    }

    render() {
        const update = this.update.bind(this);
        const domain = {
            x: [-Math.PI, Math.PI],
            y: [-Math.PI, Math.PI]
        };
        
        var file = this.state.files;

        return (
            <div>
                <b>f(z) = </b>
                <input type="text" defaultValue={this.state.func}
                    onKeyUp={update} />
                <DomainColoring width={500} height={500}
                    domain={domain} func={this.state.func} />

                <Dropzone onDrop={(files) => this.onDrop(files)} size={150} >
                  <div>Try dropping some files here, or click to select files to upload.</div>
                </Dropzone>
                <h3>Dropped files: </h3>
                  <ul>
                    {[].map.call(file, function (f, i) {
                      return <li key={i}>{f.name + ' : ' + f.size + ' bytes.'}</li>
                    })}
                  </ul>
            </div>
        );
    }
}
