import React from 'react';
import './Rating.css';

export default function Rating(props) {
  const stars = [0, 0, 0, 0, 0].map((_, i) =>
    (i < props.value)
      ? <span key={i}>&#9733; </span>
      : <span key={i}>&#9734; </span>
  );
  return (
    <div className="rating">
      {stars}
    </div>
  );
}

Rating.defaultProps = {
  value: 1
};

Rating.propTypes = {
  value: (props, propName, componentName) => {
    const prop = props[propName];
    if(!prop) {
      return new Error(`${propName} is required in ${componentName}. Validation Failed`);
    }

    // if (typeof prop != 'number') {
    //   return new Error(`Invalid prop, ${propName} is expected to be a number in ${componentName}. ${typeof prop} found.`);
    // }

    if(prop < 1 || prop > 5) {
      return new Error(`Invalid prop, ${propName} should be in range 1 - 5 in ${componentName}. ${prop} found.`);
    }
  }
}
