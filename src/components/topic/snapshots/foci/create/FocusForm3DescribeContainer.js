import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import composeIntlForm from '../../../../common/IntlForm';
import AppButton from '../../../../common/AppButton';
import FocusDescriptionForm, { NEW_FOCAL_SET_PLACEHOLDER_ID } from './FocusDescriptionForm';
import { setNewFocusProperties, goToCreateFocusStep, fetchFocalSetDefinitions } from '../../../../../actions/topicActions';
import messages from '../../../../../resources/messages';
import composeAsyncContainer from '../../../../common/AsyncContainer';

const formSelector = formValueSelector('snapshotFocus');

const localMessages = {
  title: { id: 'focus.create.setup.title', defaultMessage: 'Step 3: Describe Your Focus' },
};

class FocusForm3DescribeContainer extends React.Component {

  handleFocalSetSelected = (event, index, focalSetDefinitionId) => {
    const { setProperties } = this.props;
    setProperties({ focalSetDefinitionId });
  }

  render() {
    const { topicId, handleSubmit, finishStep, properties, initialValues, focalSetDefinitions } = this.props;
    const { formatMessage } = this.props.intl;
    // figure out a which focal set ot default to
    if (focalSetDefinitions.length === 0) {
      initialValues.focalSetId = NEW_FOCAL_SET_PLACEHOLDER_ID;
    } else {
      initialValues.focalSetId = focalSetDefinitions[0].focal_set_definitions_id;
    }
    return (
      <Grid>
        <form className="focus-create-details" name="snapshotFocusForm" onSubmit={handleSubmit(finishStep.bind(this))}>
          <Row>
            <Col lg={10} md={10} sm={10}>
              <h1><FormattedMessage {...localMessages.title} /></h1>
            </Col>
          </Row>
          <FocusDescriptionForm
            topicId={topicId}
            initialValues={initialValues}
            focalSetDefinitions={focalSetDefinitions}
            properties={properties}
          />
          <Row>
            <Col lg={12} md={12} sm={12} >
              <AppButton type="submit" label={formatMessage(messages.next)} primary />
            </Col>
          </Row>
        </form>
      </Grid>
    );
  }

}

FocusForm3DescribeContainer.propTypes = {
  // from parent
  topicId: React.PropTypes.number.isRequired,
  initialValues: React.PropTypes.object,
  // form composition
  intl: React.PropTypes.object.isRequired,
  renderTextField: React.PropTypes.func.isRequired,
  renderSelectField: React.PropTypes.func.isRequired,
  handleSubmit: React.PropTypes.func.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  focalSetDefinitions: React.PropTypes.array.isRequired,
  properties: React.PropTypes.object.isRequired,
  formData: React.PropTypes.object,
  // from dispatch
  setProperties: React.PropTypes.func.isRequired,
  finishStep: React.PropTypes.func.isRequired,
  asyncFetch: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  focalSetDefinitions: state.topics.selected.focalSets.definitions.list,
  fetchStatus: state.topics.selected.focalSets.definitions.fetchStatus,
  properties: state.topics.selected.focalSets.create.properties,
  formData: formSelector(state, 'focalTechnique', 'focalSetDefinitionId'),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  setProperties: (properties) => {
    dispatch(setNewFocusProperties(properties));
  },
  goToStep: (step) => {
    dispatch(goToCreateFocusStep(step));
  },
  asyncFetch: () => {
    dispatch(fetchFocalSetDefinitions(ownProps.topicId));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    finishStep: (values) => {
      const focusProps = {
        topicId: ownProps.topicId,
        name: values.focusName,
        description: values.focusDescription,
        focalSetDefinitionId: values.focalSetId,
      };
      if (values.focalSetId === NEW_FOCAL_SET_PLACEHOLDER_ID) {
        // for a new focal set we need the name and descripton to save them
        focusProps.focalSetName = values.focalSetName;
        focusProps.focalSetDescription = values.focalSetDescription;
      }
      dispatchProps.setProperties(focusProps);
      dispatchProps.goToStep(3);
    },
  });
}

function validate() {
  const errors = {};
  // TODO: figure out if we need to do more validation here, because in theory the
  // subforms components have already done it
  return errors;
}

const reduxFormConfig = {
  form: 'snapshotFocus', // make sure this matches the sub-components and other wizard steps
  destroyOnUnmount: false,  // so the wizard works
  validate,
};

export default
  injectIntl(
    composeIntlForm(
      reduxForm(reduxFormConfig)(
        connect(mapStateToProps, mapDispatchToProps, mergeProps)(
          composeAsyncContainer(
            FocusForm3DescribeContainer
          )
        )
      )
    )
  );