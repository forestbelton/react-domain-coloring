import React from 'react';
import DomainColoring from '../DomainColoring';
import Dropzone from 'react-dropzone';
import ReactBootstrap from 'react-bootstrap';

export default class Sandbox extends React.Component {
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


        var NavigationItem = React.createClass({
            onClick: function() {
                this.props.itemSelected(this.props.item);
            },
            render: function() {
                return (
                    <li onClick={this.onClick} className={this.props.selected ? "selected" : ""}>
                        {this.props.item.data.display_name}
                    </li>
                );
            }
        });

        var Navigation = React.createClass({
            setSelectedItem: function(item) {
                this.props.itemSelected(item);
            },
            render: function() {
                var _this = this;

                var items = this.props.items.map(function(item) {
                    return (
                        <NavigationItem key={item.data.id}
                            item={item} itemSelected={_this.setSelectedItem}
                            selected={item.data.url === _this.props.activeUrl} />
                    );
                });

                return (
                    <div className="navigation">
                        <div className="header">Types Of Domain Coloring</div>
                        <ul>
                            {items}
                        </ul>
                    </div>
                );
            }
        });

        var StoryList = React.createClass({
    render: function() {
        var storyNodes = this.props.items.map(function(item) {
            return (
                <tr key={item.data.url}>
                    <td>
                        <p className="score">{item.data.score}</p>
                    </td>
                    <td>
                        <p className="title">
                            <a href={item.data.url}>
                                {item.data.title}
                            </a>
                        </p>
                        <p className="author">
                            Posted by <b>{item.data.author}</b>
                        </p>
                    </td>
                </tr>
            );
        });

        return (
            <table>
                <tbody>
                    {storyNodes}
                </tbody>
            </table>
        );
    }
});

var App = React.createClass({
    componentDidMount: function() {
        var _this = this;
        var cbname = "fn" + Date.now();
        var script = document.createElement("script");
        script.src = "";https://www.reddit.com/reddits.json?jsonp=" + cbname;

        window[cbname] = function(jsonData) {
            _this.setState({
                navigationItems: jsonData.data.children
            });
            delete window[cbname];
        };

        document.head.appendChild(script);
    },
    getInitialState: function() {
        return ({
            activeNavigationUrl: "",
            navigationItems: [],
            storyItems: [],
            title: "Domain Coloring"
        });
    },
    render: function() {
        return (
            <div>
                <h1>{this.state.title}</h1>
                <Navigation activeUrl={this.state.activeNavigationUrl}
                    items={this.state.navigationItems}
                    itemSelected={this.setSelectedItem} />
                <StoryList items={this.state.storyItems} />
            </div>
        );
    },
    setSelectedItem: function(item) {
        var _this = this;
        var cbname = "fn" + Date.now();
        var script = document.createElement("script");
        script.src = "";//"https://www.reddit.com/" + item.data.url + ".json?sort=top&t=month&jsonp=" + cbname;

        window[cbname] = function(jsonData) {
            _this.setState({storyItems: jsonData.data.children});
            delete window[cbname];
        };
        
        document.head.appendChild(script);

        this.setState({
            activeNavigationUrl: item.data.url,
            title: item.data.display_name
        });
    }
});


        var CommentForm = React.createClass({
          render: function() {
            return (
              <div className="commentForms">
              </div>
            );
          }
        });

        const wellStyles = {maxWidth: 400, margin: '0 auto 10px'};
        var ButtonsOnButtons = React.createClass({
            render: function () {
                return (
                   <div className='well' style={wellStyles}>
                       <ReactBootstrap.Button bsStyle='primary' bsSize='large' block>Block level button</ReactBootstrap.Button>
                    <ReactBootstrap.Button bsSize='large' block>Block level button</ReactBootstrap.Button>
                  </div>
                );
            }
        });

        var imageStyles = {
            width: 500,
            height: 500,
            float: "right"
        }

        var imageContainer = React.createClass ({
            render: function () {
                return (
                    <div className='imageContainer' style={imageStyles}>
                  </div>

                );
            }
        });

        var domainColoringStyle = {
            float: "left",
            maxWidth: 510,
            maxHeight: 520,
            borderStyle: "solid",
            borderWidth: 2,
            marginRight: 40,
            display: "inline-block"
        }

        var imageStyling = {
            width: 500,
            height: 500
        }
        
        return (
            <div>
            <App />
            <CommentForm />
                <b><font color="red">f(z) = </font></b>
                <input type="text" defaultValue={this.state.func}
                    onKeyUp={update} />

                 <Dropzone onDrop={(files) => this.onDrop(files)} size={150} style={domainColoringStyle}>
                  <div>Try dropping some files here, or click to select files to upload.</div>
                <imageContainer> 
                    { this.state.imageURI ? <img src={this.state.imageURI} style={imageStyling} /> : null }
                </imageContainer>

                </Dropzone>

                <DomainColoring width={500} height={500} image={this.state.imageURI}
                    domain={domain} func={this.state.func} />

            </div>
        );
    }
}
