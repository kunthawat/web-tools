import React from 'react';
import Title from 'react-title-component';
import { reduxForm } from 'redux-form';
import { push } from 'react-router-redux';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import composeIntlForm from '../../common/IntlForm';
import SourceSuggestionForm from './form/SourceSuggestionForm';
import SourceCollectionsForm from './form/SourceCollectionsForm';
import { suggestSource } from '../../../actions/sourceActions';
import { updateFeedback } from '../../../actions/appActions';
import AppButton from '../../common/AppButton';


const localMessages = {
  mainTitle: { id: 'source.suggest.maintitle', defaultMessage: 'Suggest A Source' },
  addButton: { id: 'source.suggest.saveAll', defaultMessage: 'Submit Suggestion' },
  feedback: { id: 'source.suggest.feedback', defaultMessage: 'We submitted your suggestion' },
};

const SuggestSourceContainer = (props) => {
  const { initialValues, pristine, submitting, handleSubmit, handleSave } = props;
  const { formatMessage } = props.intl;
  const titleHandler = parentTitle => `${formatMessage(localMessages.mainTitle)} | ${parentTitle}`;
  return (
    <Grid>
      <Title render={titleHandler} />
      <form className="source-suggestion-form" name="suggestionForm" onSubmit={handleSubmit(handleSave.bind(this))}>
        <SourceSuggestionForm initialValues={initialValues} />
        <SourceCollectionsForm form="suggestionForm" />
        <Row>
          <Col lg={12}>
            <AppButton
              style={{ marginTop: 30 }}
              type="submit"
              label={formatMessage(localMessages.addButton)}
              disabled={pristine || submitting}
              primary
            />
          </Col>
        </Row>
      </form>
    </Grid>
  );
};

SuggestSourceContainer.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
  renderTextField: React.PropTypes.func.isRequired,
  // from dispatch
  handleSave: React.PropTypes.func.isRequired,
  // from form healper
  initialValues: React.PropTypes.object,
  handleSubmit: React.PropTypes.func,
  pristine: React.PropTypes.bool,
  submitting: React.PropTypes.bool,
};

function validate() {
  const errors = {};
  // TODO: figure out if we need to do more validation here, because in theory the
  // subforms components have already done it
  return errors;
}

const reduxFormConfig = {
  form: 'suggestionForm',
  validate,
};

const mapStateToProps = () => ({
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleSave: (values) => {
    const infoToSave = {
      url: values.url,
      name: values.name,
      feedurl: values.feedurl,
      reason: values.reason,
      collections: values.collections ? values.collections.map(s => s.id) : [],
    };
    // try to save it
    dispatch(suggestSource(infoToSave))
      .then((results) => {
        // let them know it worked
        dispatch(updateFeedback({ open: true, message: ownProps.intl.formatMessage(localMessages.feedback) }));
        // TODO: redirect to new source detail page
        dispatch(push(`/sources/${results.media_id}`));
      });
  },
});

export default
  injectIntl(
    composeIntlForm(
      reduxForm(reduxFormConfig)(
        connect(mapStateToProps, mapDispatchToProps)(
         SuggestSourceContainer
        )
      )
    )
  );