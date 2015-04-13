import React from 'react';
import DomainColoring from './DomainColoring';

const domain = {
    x: [-Math.PI, Math.PI],
    y: [-Math.PI, Math.PI]
};

React.render(
    <DomainColoring width={300} height={300}
        domain={domain} func="z" />,
        document.body
);
