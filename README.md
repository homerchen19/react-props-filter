# react-props-filter

> Filter miscellaneous props and get props precisely.

<p>
  <a target="_blank" href="https://npmjs.org/package/react-props-filter" title="NPM version"><img src="https://img.shields.io/npm/v/react-props-filter.svg"></a>
  <a target="_blank" href="https://travis-ci.com/xxhomey19/react-props-filter" title="Build Status"><img src="https://travis-ci.com/xxhomey19/react-props-filter.svg?branch=master"></a>
  <a target="_blank" href="https://opensource.org/licenses/MIT" title="License: MIT">
    <img src="https://img.shields.io/badge/License-MIT-blue.svg">
  </a>
  <a href="#badge">
    <img alt="code style: prettier" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg">
  </a>
</p>

## 💻 Install

```
$ npm i react-props-filter
```

## 🕹 Usage

```js
import React from 'react';
import PropTypes from 'prop-types';
import filter from 'react-props-filter';

const Hulk = ({ hulkName }) => <p>{`I'm ${hulkName}`}</p>;

Hulk.propTypes = {
  hulkName: PropTypes.string.isRequired,
};

const Thor = ({ thorName }) => <p>{`My name is ${thorName}`}</p>;

Thor.propTypes = {
  thorName: PropTypes.string.isRequired,
};

const Avengers = filter({
  hulk: {
    requiredProps: Object.keys(Hulk.propTypes),
  },
  thor: {
    requiredProps: Object.keys(Thor.propTypes),
  },
});

const App = () => (
  <Avengers
    ironManName="Tony Stark"
    captainAmericaName="Steve Rogers"
    hulkName="Bruce Banner"
    thorName="Thor Odinson"
  >
    {({ hulk, thor, allProps }) => (
      <div>
        <Hulk {...hulk} />
        <Thor {...thor} />
        /*
          hulk === { hulkName: "Bruce Banner" }
          thor === { thorName: "Thor Odinson" }
          allProps === {
            ironManName: 'Tony Stark',
            captainAmericaName: 'Steve Rogers',
            hulkName: 'Bruce Banner',
            thorName: 'Thor Odinson'
          }
        */
      </div>
    )}
  </Avengers>
);
```

## 💡 Features

* Pretty simple. Get props declaratively.
* Render props.

## 🛠 How to Use

### `filter`: `Function(settings)` => `Component`

The main method to create Filter component.

#### settings: `Object`

This contains several **group**s, and each group will be injected into render props.

**Notice**: all original props will be stored in the prop named **allProps**.

For example

```js
const Filter = filter({
  groupA: { ...propsGroupSettingsA },
  groupB: { ...propsGroupSettingsB },
});

const App = props => (
  <Filter { ...props }>
    {({ groupA, groupB, allProps }) => (/* ... */) }
  </Filter>
)
```

#### Group: `Object`

Declare what props does Component need.
It has the following keys.

* **`requiredProps`**
* **`mapProps`**
* **`options`**

##### `requiredProps`: `[String]`

List which props are required in this group. It's suggested to be `Object.keys(Component.propTypes)`.

##### `mapProps`: `Function(props)` => `Object`

A function which lets you map the original props into a single object. All changes will be kept in group scope.

#### `options`: `Object`

| Key      |  Type  | Default | Description                                                                                                                                                         |
| :------- | :----: | :-----: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| DOMProps | `Bool` | `false` | Allowed any [default DOM props](https://github.com/xxhomey19/react-props-filter/blob/master/src/utils/DOMProps.js) from original props to be included in the group. |

**Example for detailed settings**

```js
const Filter = filter({
  groupA: {
    requiredProps: ['propAAA', 'propBBB', 'onClick'],
    mapProps: props => ({
      ...props,
      propAAA: props.propA,
      propBBB: `${props.propB} !`,
    }),
    options: {
      DOMProps: true,
    }
  },
});

const App = () => (
  <Filter propA="A" propB="B" onClick={console.log}>
    {({groupA}) => (/* ... */)
    /*
      groupA === {
        propAAA: 'A',
        propBBB: 'B !',
        onClick=console.log
      }
    */
  }
  </Filter>
)
```

## License

MIT © [xxhomey19](https://github.com/xxhomey19)
