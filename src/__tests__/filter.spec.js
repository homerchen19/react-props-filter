import React from 'react';
import PropTypes from 'prop-types';
import TestRenderer from 'react-test-renderer';

import filter from '../filter';

const IronMan = ({ ironManName, ...rest }) => (
  <p {...rest}>{`I'm ${ironManName}`}</p>
);
IronMan.propTypes = {
  ironManName: PropTypes.string.isRequired,
};

const CamptainAmerica = ({ captainAmericaName }) => (
  <p>{`My name ${captainAmericaName}`}</p>
);
CamptainAmerica.propTypes = {
  captainAmericaName: PropTypes.string.isRequired,
};

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
        hulk="Bruce Banner"
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

  it('should work with option withDOMProps', () => {
    const Filter = filter({
      ironMan: {
        requiredProps: Object.keys(IronMan.propTypes),
        options: {
          withDOMProps: true,
        },
      },
      captainAmerica: {
        requiredProps: Object.keys(CamptainAmerica.propTypes),
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
        hulk="Bruce Banner"
        onClick={handleClickIromMan}
      />
    );
    const testInstance = testRenderer.root;

    expect(testInstance.props).toEqual({
      ironManName: 'Tony Stark',
      captainAmericaName: 'Steve Rogers',
      hulk: 'Bruce Banner',
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
        requiredProps: Object.keys(IronMan.propTypes),
        options: {
          mapProps: {
            nameOfIronMan: ({ value }) => ({
              propName: 'ironManName',
              value: `${value} !`,
            }),
          },
        },
      },
      captainAmerica: {
        requiredProps: Object.keys(CamptainAmerica.propTypes),
        options: {
          mapProps: {
            nameOfCaptainAmerica: 'captainAmericaName',
          },
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
        hulk="Bruce Banner"
      />
    );
    const testInstance = testRenderer.root;

    expect(testInstance.props).toEqual({
      nameOfIronMan: 'Tony Stark',
      nameOfCaptainAmerica: 'Steve Rogers',
      hulk: 'Bruce Banner',
    });
    expect(testInstance.findByType(IronMan).props).toEqual({
      ironManName: 'Tony Stark !',
    });
    expect(testInstance.findByType(CamptainAmerica).props).toEqual({
      captainAmericaName: 'Steve Rogers',
    });
  });
});
