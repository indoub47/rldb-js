import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import HistoryForm from './editHistoryComponents/HistoryForm';
import HistoryRecordsView from './editHistoryComponents/HistoryRecordsView';
// import updateDefect from '../../../actions/defectsActions';
import IsLoading from '../../common/IsLoading';
import ErrorAlert from '../../common/ErrorAlert/ErrorAlert';
import {emptyHistoryItem} from './editHistoryComponents/emptyHistoryItem';

class EditHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentItem: emptyHistoryItem,
      error: null,
      isBusy: false
    }

    this.setItemForEditing = this.setItemForEditing.bind(this);
    this.emptyCurrentItem = this.emptyCurrentItem.bind(this);
    this.submitItem = this.submitItem.bind(this);
  }

  setItemForEditing(e) {
    const id = e.target.dataset.id;  
    const item = this.props.defectHistory.find(h => h.id === id);
    if (!item) return;
    this.setState({currentItem: {...item}});
  } 

  emptyCurrentItem() {
    console.log("empty item");
    this.setState(
      {currentItem: {...emptyHistoryItem}}
    );
  }

  submitItem(draft) {
    this.props.submitItem(draft);
    this.emptyCurrentItem();
  }

  render () {
    if (this.state.isBusy) {
      return <IsLoading />
    }
    
    return (
      <React.Fragment>
        <HistoryRecordsView 
          defectHistory={this.props.defectHistory}
          setItemForEditing={this.setItemForEditing}
          remove={this.props.deleteItem}
        />
        <HistoryForm 
          item={this.state.currentItem}
          submit={this.submitItem}
          empty={this.emptyCurrentItem}
        />
        <ErrorAlert errorObj={this.state.error} />
      </React.Fragment>
    );
  }
}


EditHistory.propTypes = {
  defectHistory: PropTypes.arrayOf(PropTypes.object),
  submitItem: PropTypes.func.isRequired,
  deleteItem: PropTypes.func.isRequired,
  error: PropTypes.object,
  isBusy: PropTypes.bool,
  //defect: PropTypes.object
}

EditHistory.defaultProps = {
  error: null,
  isBusy: false,
  //defect: null
};

const mapStateToProps = state => ({
  isBusy: state.defectsStatus.isBusy,
  error: state.defectsError.updateError,
  //defect: state.defectIntent.currentDefect,
});

export default connect(
  mapStateToProps
)(EditHistory);
