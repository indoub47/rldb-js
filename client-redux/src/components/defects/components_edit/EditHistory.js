import React, {Component} from 'react';
import PropTypes from 'prop-types';
import HistoryForm from './editHistoryComponents/HistoryForm';
import HistoryRecordsView from './editHistoryComponents/HistoryRecordsView';
import {emptyHistoryItem} from './editHistoryComponents/emptyHistoryItem';

class EditHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentItem: {...emptyHistoryItem},
      hiSubmitError: null
    }

    this.setItemForEditing = this.setItemForEditing.bind(this);
    this.emptyCurrentItem = this.emptyCurrentItem.bind(this);
    this.submitItem = this.submitItem.bind(this);
  }

  componentDidUpdate(prevProps) {
    // kai gauna pakeistą defectHistory
    if (prevProps !== this.props) {
      this.emptyCurrentItem();
    }
    // jeigu keičiasi tik state, tai nevyksta nieko
  }

  emptyCurrentItem() {    
    this.setState(
      {currentItem: {...emptyHistoryItem}}
    );
  }

  setItemForEditing(e) {
    const id = e.target.dataset.id;  
    const item = this.props.defectHistory.find(h => h.id === id);
    if (!item) return;
    this.setState({currentItem: {...item}});
  } 

  submitItem(draft) {
    // validate Hi here
    // temporary variables
    const valid = true; 
    const validationError = {msg: "history item submit error"};

    if (!valid) {
      this.setState({hiSubmitError: validationError})
    } else {
      this.props.submitItem(draft);
    }
  }

  render () {    
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
          hiSubmitError={this.state.hiSubmitError}
        />
      </React.Fragment>
    );
  }
}


EditHistory.propTypes = {
  defectHistory: PropTypes.arrayOf(PropTypes.object),
  submitItem: PropTypes.func.isRequired,
  deleteItem: PropTypes.func.isRequired
}

export default EditHistory;
