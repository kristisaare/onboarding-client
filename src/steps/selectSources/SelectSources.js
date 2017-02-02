import React, { PropTypes as Types } from 'react';
import { Message } from 'retranslate';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { selectExchangeSources } from '../../exchange/actions';
import { Loader, Radio } from '../../common';
import PensionFundTable from './pensionFundTable';

function isFullSelection(selection) {
  return selection.reduce((isFull, { percentage }) => isFull && percentage === 1, true);
}

function isNoneSelection(selection) {
  return selection.reduce((isNone, { percentage }) => isNone && percentage === 0, true);
}

function selectFull(selection) {
  return selection.map(fund => ({ ...fund, percentage: 1 }));
}

function selectNone(selection) {
  return selection.map(fund => ({ ...fund, percentage: 0 }));
}

export const SelectSources = ({
  loadingPensionFunds,
  pensionFunds,
  selection,
  onSelect,
  selectedSome,
}) => {
  if (loadingPensionFunds) {
    return <Loader className="align-middle" />;
  }
  return (
    <div>
      <div className="px-col mb-4">
        <p className="mb-4 mt-4"><Message>select.sources.current.status</Message></p>
        <PensionFundTable funds={pensionFunds} />
      </div>
      <Radio
        name="tv-select-sources-type"
        selected={isFullSelection(selection) && !selectedSome}
        onSelect={() => onSelect(selectFull(selection), false)}
      >
        <h3><Message>select.sources.select.all</Message></h3>
        <Message>select.sources.select.all.subtitle</Message>
      </Radio>
      {/* TODO: write tests once we add this section
      <Radio
        name="tv-select-sources-type"
        className="mt-3"
        selected={selectedSome}
        onSelect={() => onSelect(selection, true)}
      >
        <h3><Message>select.sources.select.some</Message></h3>
        <Message>select.sources.select.some.subtitle</Message>
      </Radio>*/}
      <Radio
        name="tv-select-sources-type"
        className="mt-3"
        selected={isNoneSelection(selection) && !selectedSome}
        onSelect={() => onSelect(selectNone(selection), false)}
      >
        <h3><Message>select.sources.select.none</Message></h3>
        <Message>select.sources.select.none.subtitle</Message>
      </Radio>
      <div className="px-col">
        <Link className="btn btn-primary mt-4 mb-4" to="/steps/select-fund">
          <Message>steps.next</Message>
        </Link>
        <br />
        <small className="text-muted">
          <Message>select.sources.calculation.info</Message>
        </small>
      </div>
    </div>
  );
};

const noop = () => null;

SelectSources.defaultProps = {
  pensionFunds: [],
  loadingPensionFunds: false,
  selection: [],
  selectedSome: false,
  onSelect: noop,
};

SelectSources.propTypes = {
  selection: Types.arrayOf(Types.shape({})),
  selectedSome: Types.bool,
  pensionFunds: Types.arrayOf(Types.shape({})),
  loadingPensionFunds: Types.bool,
  onSelect: Types.func,
};

const mapStateToProps = state => ({
  selection: state.exchange.selection,
  selectedSome: state.exchange.selectedSome,
  pensionFunds: state.exchange.pensionFunds,
  loadingPensionFunds: state.exchange.loadingPensionFunds,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  onSelect: selectExchangeSources,
}, dispatch);

const connectToRedux = connect(mapStateToProps, mapDispatchToProps);

export default connectToRedux(SelectSources);