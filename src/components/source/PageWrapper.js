import React from 'react';
import { injectIntl } from 'react-intl';
import ControlBar from './controlbar/SourceControlBar';

const PageWrapper = (props) => {
  const { children } = props;
  return (
    <div className="controlbar controlbar-sources">
      <ControlBar />
      {children}
    </div>
  );
};

PageWrapper.propTypes = {
  children: React.PropTypes.node,
};

export default
  injectIntl(
    PageWrapper
  );