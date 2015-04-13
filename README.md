react-domain-coloring
=====================

[Domain coloring](http://en.wikipedia.org/wiki/Domain_coloring) is a way to
visualize complex functions. This library provides a component that implements
one possible coloring scheme, with the help of [three.js](http://threejs.org/).

Example
-------
`z^2 + 2 * z` rendered using the component:

![domain coloring example](http://i.imgur.com/4FjPmKE.png)

Usage
-----

```javascript
import DomainColoring from 'react-domain-coloring';

// ...
const domain = {
    x: [-1, 1],
    y: [-2 * Math.PI, 2 * Math.PI]
};

<DomainColoring width={300} height={300}
    domain={domain} func="z^2 + 2 * z" />
```

Development
-----------

```
$ npm install
$ npm start
```

Then navigate to [http://localhost:8080](http://localhost:8080)
