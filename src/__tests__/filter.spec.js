import React from 'react';
import PropTypes from 'prop-types';
import TestRenderer from 'react-test-renderer';

import filter from '../filter';

const IronMan = ({ ironManName }) => <p>{`I'm ${ironManName}`}</p>;

IronMan.propTypes = {
  ironManName: PropTypes.string.isRequired,
};

const CamptainAmerica = ({ captainAmericaName }) => (
  <p>{`My name is ${captainAmericaName}`}</p>
);

CamptainAmerica.propTypes = {
  captainAmericaName: PropTypes.string.isRequired,
};

const All = props => <p>{JSON.stringify(props)}</p>;

describe('filter', () => {
  it('should work', () => {
    const Filter = filter({
      ironMan: {
        requiredProps: Object.keys(IronMan.propTypes),
      },
      captainAmerica: {
        requiredProps: Object.keys(CamptainAmerica.propTypes),
      },
    });

    const Avengers = props => (
      <Filter {...props}>
        {({ ironMan, captainAmerica, allProps }) => (
          <div>
            <IronMan {...ironMan} />
            <CamptainAmerica {...captainAmerica} />
            <All {...allProps} />
          </div>
        )}
      </Filter>
    );

    const testRenderer = TestRenderer.create(
      <Avengers
        ironManName="Tony Stark"
        captainAmericaName="Steve Rogers"
        hulkName="Bruce Banner"
      />
    );
    const testInstance = testRenderer.root;
    const testTree = testRenderer.toJSON();

    expect(testTree).toMatchSnapshot();
    expect(testInstance.findByType(IronMan).props).toEqual({
      ironManName: 'Tony Stark',
    });
    expect(testInstance.findByType(CamptainAmerica).props).toEqual({
      captainAmericaName: 'Steve Rogers',
    });
    expect(testInstance.findByType(All).props).toEqual({
      ironManName: 'Tony Stark',
      captainAmericaName: 'Steve Rogers',
      hulkName: 'Bruce Banner',
    });
  });

  it('should work with option DOMProps', () => {
    const Filter = filter({
      ironMan: {
        requiredProps: Object.keys(IronMan.propTypes),
        options: {
          DOMProps: true,
        },
      },
      captainAmerica: {
        requiredProps: Object.keys(CamptainAmerica.propTypes),
      },
    });

    const Avengers = props => (
      <Filter {...props}>
        {({ ironMan, captainAmerica, allProps }) => (
          <div>
            <IronMan {...ironMan} />
            <CamptainAmerica {...captainAmerica} />
            <All {...allProps} />
          </div>
        )}
      </Filter>
    );

    const handleClickIromMan = () => console.log('Iron Man Clicked.');

    const testRenderer = TestRenderer.create(
      <Avengers
        ironManName="Tony Stark"
        captainAmericaName="Steve Rogers"
        hulkName="Bruce Banner"
        onClick={handleClickIromMan}
      />
    );
    const testInstance = testRenderer.root;

    expect(testInstance.props).toEqual({
      ironManName: 'Tony Stark',
      captainAmericaName: 'Steve Rogers',
      hulkName: 'Bruce Banner',
      onClick: handleClickIromMan,
    });
    expect(testInstance.findByType(IronMan).props).toEqual({
      ironManName: 'Tony Stark',
      onClick: handleClickIromMan,
    });
    expect(testInstance.findByType(CamptainAmerica).props).toEqual({
      captainAmericaName: 'Steve Rogers',
    });
    expect(testInstance.findByType(All).props).toEqual({
      ironManName: 'Tony Stark',
      captainAmericaName: 'Steve Rogers',
      hulkName: 'Bruce Banner',
      onClick: handleClickIromMan,
    });
  });

  it('should work with option mapProps', () => {
    const Filter = filter({
      ironMan: {
        requiredProps: Object.keys(IronMan.propTypes),
        mapProps: {
          nameOfIronMan: ({ value }) => ({
            propKey: 'ironManName',
            value: `${value} !`,
          }),
        },
      },
      captainAmerica: {
        requiredProps: Object.keys(CamptainAmerica.propTypes),
        mapProps: {
          nameOfCaptainAmerica: 'captainAmericaName',
        },
      },
    });

    const Avengers = props => (
      <Filter {...props}>
        {({ ironMan, captainAmerica, allProps }) => (
          <div>
            <IronMan {...ironMan} />
            <CamptainAmerica {...captainAmerica} />
            <All {...allProps} />
          </div>
        )}
      </Filter>
    );
    const testRenderer = TestRenderer.create(
      <Avengers
        nameOfIronMan="Tony Stark"
        nameOfCaptainAmerica="Steve Rogers"
        hulkName="Bruce Banner"
      />
    );
    const testInstance = testRenderer.root;

    expect(testInstance.props).toEqual({
      nameOfIronMan: 'Tony Stark',
      nameOfCaptainAmerica: 'Steve Rogers',
      hulkName: 'Bruce Banner',
    });
    expect(testInstance.findByType(IronMan).props).toEqual({
      ironManName: 'Tony Stark !',
    });
    expect(testInstance.findByType(CamptainAmerica).props).toEqual({
      captainAmericaName: 'Steve Rogers',
    });
    expect(testInstance.findByType(All).props).toEqual({
      nameOfIronMan: 'Tony Stark',
      nameOfCaptainAmerica: 'Steve Rogers',
      hulkName: 'Bruce Banner',
    });
  });

  it('should work with option mapProps when components have same props name', () => {
    const Hulk = ({ name }) => <p>{`I'm ${name}`}</p>;

    Hulk.propTypes = {
      name: PropTypes.string.isRequired,
    };

    const Thor = ({ name }) => <p>{`My name is ${name}`}</p>;

    Thor.propTypes = {
      name: PropTypes.string.isRequired,
    };

    const Filter = filter({
      hulk: {
        requiredProps: Object.keys(Hulk.propTypes),
        mapProps: {
          hulkName: Object.keys(Hulk.propTypes)[0],
        },
      },
      thor: {
        requiredProps: Object.keys(Thor.propTypes),
        mapProps: {
          thorName: Object.keys(Thor.propTypes)[0],
        },
      },
    });

    const Avengers = props => (
      <Filter {...props}>
        {({ hulk, thor, allProps }) => (
          <div>
            <Hulk {...hulk} />
            <Thor {...thor} />
            <All {...allProps} />
          </div>
        )}
      </Filter>
    );
    const testRenderer = TestRenderer.create(
      <Avengers hulkName="Bruce Banner" thorName="Thor Odinson" name="name" />
    );
    const testInstance = testRenderer.root;

    expect(testInstance.props).toEqual({
      thorName: 'Thor Odinson',
      hulkName: 'Bruce Banner',
      name: 'name',
    });
    expect(testInstance.findByType(Hulk).props).toEqual({
      name: 'Bruce Banner',
    });
    expect(testInstance.findByType(Thor).props).toEqual({
      name: 'Thor Odinson',
    });
    expect(testInstance.findByType(All).props).toEqual({
      thorName: 'Thor Odinson',
      hulkName: 'Bruce Banner',
      name: 'name',
    });
  });
});
