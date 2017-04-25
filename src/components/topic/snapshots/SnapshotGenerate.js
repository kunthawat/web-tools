import React from 'react';
import { FormattedHTMLMessage, FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import BackLinkingControlBar from '../BackLinkingControlBar';
import SnapshotGenerateForm from './GenerateSnapshotForm';
import messages from '../../../resources/messages';
import { generateSnapshot, fetchTopicSummary } from '../../../actions/topicActions';
import { updateFeedback } from '../../../actions/appActions';
import SnapshotIcon from '../../common/icons/SnapshotIcon';
import { SOURCE_SCRAPE_STATE_QUEUED, SOURCE_SCRAPE_STATE_RUNNING } from '../../../reducers/sources/sources/selected/sourceDetails';

const localMessages = {
  title: { id: 'snapshot.builder.title', defaultMessage: 'Generate Snapshot' },
  aboutText: { id: 'snapshot.builder.about', defaultMessage: '<p>A Snapshot includes all the content in your Topic at one point in time.  You can\'t change the content within a Snapshot.  Anything you want to change within a Topic requires a new Snapshot to be made.  This doesn\'t take a long time, but it isn\'t instant either.</p>' },
  snapshotFailed: { id: 'snapshot.generate.failed', defaultMessage: 'Sorry, but we failed to start generating the snapshot' },
  backToTopicLink: { id: 'snapshot.builder.backToTopic.link', defaultMessage: 'back to Topic' },
};

const SnapshotGenerate = props => (
  <div className="snapshot-builder-home">
    <BackLinkingControlBar message={localMessages.backToTopicLink} linkTo={`/topics/${props.params.topicId}/summary`} />
    <Grid>
      <Row>
        <Col lg={10}>
          <h1><SnapshotIcon /><FormattedMessage {...localMessages.title} /></h1>
          <FormattedHTMLMessage {...localMessages.aboutText} />
        </Col>
      </Row>
      <SnapshotGenerateForm onGenerate={props.handleGenerateSnapshotRequest} />
    </Grid>
  </div>
);

SnapshotGenerate.propTypes = {
  intl: React.PropTypes.object.isRequired,
  params: React.PropTypes.object.isRequired,
  children: React.PropTypes.node,
  // from state
  topicId: React.PropTypes.number.isRequired,
  // from dispatch
  handleGenerateSnapshotRequest: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  topicId: parseInt(ownProps.params.topicId, 10),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleGenerateSnapshotRequest: (values) => {
    dispatch(generateSnapshot(ownProps.params.topicId, { note: values.note }))
      .then((results) => {
        if ((results.job_state.state === SOURCE_SCRAPE_STATE_QUEUED) ||
          (results.job_state.state === SOURCE_SCRAPE_STATE_RUNNING)) {
          dispatch(updateFeedback({ open: true, message: ownProps.intl.formatMessage(messages.snapshotGenerating) }));
          dispatch(fetchTopicSummary(ownProps.params.topicId))  // update the topic so that we see the msg that a new snapshot is being generated up top
            .then(() => dispatch(push(`/topics/${ownProps.params.topicId}/summary`)));
        } else {
          // was completed far too quickly, or was an error
          dispatch(updateFeedback({ open: true, message: ownProps.intl.formatMessage(localMessages.snapshotFailed) }));
        }
      });
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      SnapshotGenerate
    )
  );