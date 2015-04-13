react-domain-coloring
=====================

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
