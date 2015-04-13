import React from 'react';
import DomainColoring from './DomainColoring';

React.render(
    <DomainColoring width={300} height={300} func="z * z + 2 * z" />,
        document.body
);
