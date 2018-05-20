import React from 'react';
import PropTypes from 'prop-types';
import TestRenderer from 'react-test-renderer';

import filter from '../filter';

const IronMan = ({ ironMan }) => <p>{`I'm ${ironMan}`}</p>;
IronMan.propTypes = {
  ironMan: PropTypes.string.isRequired,
};

const CamptainAmerica = ({ camptainAmerica }) => (
  <p>{`My name ${camptainAmerica}`}</p>
);
CamptainAmerica.propTypes = {
  camptainAmerica: PropTypes.string.isRequired,
};

describe('filter', () => {
  it('should work', () => {
    const Filter = filter({
      ironMan: {
        requiredProps: Object.keys(IronMan.propTypes),
      },
      camptainAmerica: {
        requiredProps: Object.keys(CamptainAmerica.propTypes),
      },
    });

    const Avengers = props => (
      <Filter {...props}>
        {({ ironMan, camptainAmerica }) => (
          <div>
            <IronMan {...ironMan} />
            <CamptainAmerica {...camptainAmerica} />
          </div>
        )}
      </Filter>
    );

    const testRenderer = TestRenderer.create(
      <Avengers
        ironMan="Tony Stark"
        camptainAmerica="Steve Rogers"
        hulk="Bruce Banner"
      />
    );
    const testInstance = testRenderer.root;
    const testTree = testRenderer.toJSON();

    expect(testTree).toMatchSnapshot();
    expect(testInstance.findByType(IronMan).props).toEqual({
      ironMan: 'Tony Stark',
    });
    expect(testInstance.findByType(CamptainAmerica).props).toEqual({
      camptainAmerica: 'Steve Rogers',
    });
  });
});
