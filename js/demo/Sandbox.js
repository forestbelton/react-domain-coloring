import React from 'react';
import DomainColoring from '../DomainColoring';
import Dropzone from 'react-dropzone';

class Sandbox extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            func: 'z',
            image: null
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
        this.setState({
            image: files[0]
        });


        var reader  = new FileReader();

        reader.onloadend = () => {
            this.setState({
                imageURI: reader.result
            })
        }

        reader.readAsDataURL(files[0]);
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
                <DomainColoring width={500} height={500} image={this.state.imageURI}
                    domain={domain} func={this.state.func} />

                <Dropzone onDrop={(files) => this.onDrop(files)} size={150} >
                  <div>Try dropping some files here, or click to select files to upload.</div>
                </Dropzone>

                { this.state.imageURI ? <img src={this.state.imageURI} width = "500px" /> : null }
            </div>
        );
    }
}

module.exports = Sandbox;


