import React, { PropTypes as Types } from 'react';

import './Radio.scss';
/* eslint-disable jsx-a11y/label-has-for */
const Radio = ({ children, onSelect, selected, name, className }) => (
  <label className={`tv-radio p-4 mb-0 px-col ${selected ? 'tv-radio--selected' : ''} ${className}`}>
    {/* eslint-enable jsx-a11y/label-has-for */}
    <div className="row mb-0">
      <div className="col col-auto pr-0">
        <input
          type="radio"
          className="sr-only"
          name={name}
          checked={selected}
          onChange={() => onSelect(!selected)}
        />
        <button
          type="button"
          className="tv-radio__button"
          onClick={() => onSelect(!selected)}
          aria-pressed={selected}
        >
          <span className="tv-radio__check" />
        </button>
      </div>
      <div className="col">
        {children}
      </div>
    </div>
  </label>
);

const noop = () => null;

Radio.defaultProps = {
  children: '',
  onSelect: noop,
  selected: false,
  className: '',
};

Radio.propTypes = {
  children: Types.oneOfType([Types.node, Types.string, Types.arrayOf(Types.node)]),
  onSelect: Types.func,
  selected: Types.bool,
  name: Types.string.isRequired,
  className: Types.string,
};

export default Radio;
