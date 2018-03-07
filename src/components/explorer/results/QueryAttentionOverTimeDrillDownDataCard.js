import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import DataCard from '../../common/DataCard';
import StorySentencePreview from '../../common/StorySentencePreview';
import OrderedWordCloud from '../../vis/OrderedWordCloud';

const localMessages = {
  attention: { id: 'explorer.results.attention.title', defaultMessage: 'Attention' },
  language: { id: 'explorer.results.language.title', defaultMessage: 'Language' },
  people: { id: 'explorer.results.people.title', defaultMessage: 'People & Places' },
  details: { id: 'explorer.attention.drillDown.details', defaultMessage: 'Here are some details about what was reported on for {date}' },
  sampleStories: { id: 'explorer.attention.drillDown.sampleStories', defaultMessage: 'Sample Stories for {date}' },
  topWords: { id: 'explorer.attention.drillDown.topWords', defaultMessage: 'Top Words for {date}' },
};

const QueryAttentionOverTimeDrillDownDataCard = (props) => {
  const { stories, words, info } = props;
  const date = info.start_date;
  const color = info.color;
  const hexToRGBArray = clr => clr.match(/[A-Za-z0-9]{2}/g).map(v => parseInt(v, 16));
  const rgbColor = hexToRGBArray(color);
  return (
    <DataCard>
      <Row>
        <h2><FormattedMessage {...localMessages.details} values={{ date }} /></h2>
        <Col lg={6}>
          <h3 style={{ color }} ><FormattedMessage {...localMessages.sampleStories} values={{ date }} /></h3>
          <StorySentencePreview stories={stories !== null && stories !== undefined ? Object.values(stories) : []} />
        </Col>
        <Col lg={6}>
          <h3 style={{ color }} ><FormattedMessage {...localMessages.topWords} values={{ date }} /></h3>
          <OrderedWordCloud words={words} textColor={`rgb(${rgbColor[0]}, ${rgbColor[1]}, ${rgbColor[2]})`} />
        </Col>
      </Row>
    </DataCard>
  );
};

QueryAttentionOverTimeDrillDownDataCard.propTypes = {
  // from parent
  stories: PropTypes.object,
  words: PropTypes.array,
  info: PropTypes.object,
  // from compositional chain
  intl: PropTypes.object.isRequired,
};

export default
  injectIntl(
    QueryAttentionOverTimeDrillDownDataCard
  );