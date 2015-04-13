import React from 'react';
import DomainColoring from './DomainColoring';

const domain = {
    x: [-2 * Math.PI, 2 * Math.PI],
    y: [-2 * Math.PI, 2 * Math.PI]
};

React.render(
    <DomainColoring width={300} height={300}
            domain={domain} func="z * z + 2 * z * i" />,
        document.body
);
