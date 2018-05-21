# react-props-filter

## Install

```
$ npm i react-props-filter
```

## Usage

```js
import React from 'react';
import PropTypes from 'prop-types';
import filter from 'react-props-filter';

const Hulk = ({ name }) => <p>{`I'm ${name}`}</p>;

Hulk.propTypes = {
  name: PropTypes.string.isRequired,
};

const Thor = ({ name }) => <p>{`My name is ${name}`}</p>;

Thor.propTypes = {
  name: PropTypes.string.isRequired,
};

const Avengers = filter({
  hulk: {
    allowedProps: Object.keys(Hulk.propTypes),
    mapProps: {
      hulkName: Object.keys(Hulk.propTypes)[0], // 'name'
    },
  },
  thor: {
    allowedProps: Object.keys(Thor.propTypes),
    mapProps: {
      thorName: Object.keys(Thor.propTypes)[0], // 'name'
    },
  },
});

const App = () => (
  <Avengers
    ironManName="Tony Stark"
    captainAmericaName="Steve Rogers"
    hulkName="Bruce Banner"
    thorName="Thor Odinson"
  >
    {({ hulk, thor }) => (
      <div>
        <Hulk {...hulk} /> // {...hulk} = { name: "Bruce Banner" }
        <Thor {...thor} /> // {...thor} = { name: "Thor Odinson" }
      </div>
    )}
  </Avengers>
);
```
