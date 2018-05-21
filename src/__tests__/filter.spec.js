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

describe('filter', () => {
  it('should work', () => {
    const Filter = filter({
      ironMan: {
        allowedProps: Object.keys(IronMan.propTypes),
      },
      captainAmerica: {
        allowedProps: Object.keys(CamptainAmerica.propTypes),
      },
    });

    const Avengers = props => (
      <Filter {...props}>
        {({ ironMan, captainAmerica }) => (
          <div>
            <IronMan {...ironMan} />
            <CamptainAmerica {...captainAmerica} />
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
  });

  it('should work with option DOMProps', () => {
    const Filter = filter({
      ironMan: {
        allowedProps: Object.keys(IronMan.propTypes),
        options: {
          DOMProps: true,
        },
      },
      captainAmerica: {
        allowedProps: Object.keys(CamptainAmerica.propTypes),
      },
    });

    const Avengers = props => (
      <Filter {...props}>
        {({ ironMan, captainAmerica }) => (
          <div>
            <IronMan {...ironMan} />
            <CamptainAmerica {...captainAmerica} />
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
  });

  it('should work with option mapProps', () => {
    const Filter = filter({
      ironMan: {
        allowedProps: Object.keys(IronMan.propTypes),
        mapProps: {
          nameOfIronMan: ({ value }) => ({
            propName: 'ironManName',
            value: `${value} !`,
          }),
        },
      },
      captainAmerica: {
        allowedProps: Object.keys(CamptainAmerica.propTypes),
        mapProps: {
          nameOfCaptainAmerica: 'captainAmericaName',
        },
      },
    });

    const Avengers = props => (
      <Filter {...props}>
        {({ ironMan, captainAmerica }) => (
          <div>
            <IronMan {...ironMan} />
            <CamptainAmerica {...captainAmerica} />
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
        allowedProps: Object.keys(Hulk.propTypes),
        mapProps: {
          hulkName: Object.keys(Hulk.propTypes)[0],
        },
      },
      thor: {
        allowedProps: Object.keys(Thor.propTypes),
        mapProps: {
          thorName: Object.keys(Thor.propTypes)[0],
        },
      },
    });

    const Avengers = props => (
      <Filter {...props}>
        {({ hulk, thor }) => (
          <div>
            <Hulk {...hulk} />
            <Thor {...thor} />
          </div>
        )}
      </Filter>
    );
    const testRenderer = TestRenderer.create(
      <Avengers hulkName="Bruce Banner" thorName="Thor Odinson" />
    );
    const testInstance = testRenderer.root;

    expect(testInstance.props).toEqual({
      thorName: 'Thor Odinson',
      hulkName: 'Bruce Banner',
    });
    expect(testInstance.findByType(Hulk).props).toEqual({
      name: 'Bruce Banner',
    });
    expect(testInstance.findByType(Thor).props).toEqual({
      name: 'Thor Odinson',
    });
  });
});
