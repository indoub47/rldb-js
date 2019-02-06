import React, { Component } from "react";
//import {Link} from 'react-router-dom';
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import ErrorAlert from "../common/Alerts/ErrorAlert";
import IsLoading from "../common/IsLoading";
import { updateItem, insertItem } from "../../actions/itemsActions";
import getId from "../../utils/getId";
import itemSpecific from "../../itemSpecific";

class EditItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: {}
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmitItem = this.onSubmitItem.bind(this);
  }

  componentDidMount() {
    if (this.props.match.params._id) {
      const _id = this.props.match.params._id;
      const item = this.props.items.find(
        d => d._id === _id
      );
      //console.log("item", item);
      if (item) {
        this.setState({ item });
      }
    }
  }

  onChange(e) {
    const item = {
      ...this.state.item,
      [e.target.name]: e.target.value
    };
    this.setState({ item });
  }

  onSubmitItem(e) {
    e.preventDefault();
    const item = this.state.item;
    if (item == null) return;
    // validate item here
    if (item.id) {
      this.props.updateItem(item, this.props.history, this.props.itype);
    } else {
      item.id = getId();
      this.props.insertItem(item, this.props.itype);
    }
  }

  render() {
    // select form type 
    const mainDataForm = itemSpecific(this.props.itype).mainDataForm;

    return (
      <React.Fragment>
        {this.props.error && <ErrorAlert message={this.props.error.message} />}
        <IsLoading when={this.props.isBusy} />
        {mainDataForm({
          item: this.state.item, 
          onChange: this.onChange, 
          things: this.props.things
        })}
        <button className="btn btn-info" onClick={this.onSubmitItem}>
          Submit Item
        </button>
      </React.Fragment>
    );
  }
}

EditItem.propTypes = {
  updateItem: PropTypes.func.isRequired,
  insertItem: PropTypes.func.isRequired,
  isBusy: PropTypes.bool,
  error: PropTypes.object,
  itype: PropTypes.string.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  isBusy: state.itemsStatus[ownProps.itype].isBusy,
  error: state.itemsStatus[ownProps.itype].error,
  things: state.things.data,
  items: state.fsedItems[ownProps.itype].data
});

export default connect(
  mapStateToProps,
  { updateItem, insertItem }
)(EditItem);
