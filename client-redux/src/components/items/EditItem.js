import React, { Component } from "react";
//import {Link} from 'react-router-dom';
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import ErrorAlert from "../common/Alerts/ErrorAlert";
import WarningAlert from "../common/Alerts/WarningAlert";
import SuccessAlert from "../common/Alerts/SuccessAlert";
import IsLoading from "../common/IsLoading";
import {
  updateItem,
  insertItem,
  hideSingleItemError
  //hideWarning,
  //hideSuccess
} from "../../actions/itemsActions";
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
    if (this.props.match.params.id) {
      const id = parseInt(this.props.match.params.id);
      // console.log("id", id);
      // console.log("items", this.props.items);
      const item = this.props.items.find(item => item.id === id);
      /// console.log("item", item);
      if (item) {
        this.setState({ item });
      }
    }
  }

  componentWillUnmount() {
    this.props.hideSingleItemError(this.props.itype);
    // console.log("edit item component will unmount");
  }

  // hideSingleItemError() {
  //   this.props.hideSingleItemError(this.props.itype);
  // }

  onChange(e) {
    //const numberProps = ["km", "pk", "m", "bmetai", "dl", "dh"];
    const propName = e.target.name;
    let propValue = e.target.value;
    // console.log("e.target", e.target);
    // console.log("propName, propValue", propName, propValue);
    //if (numberProps.includes(propName)) {
    //  propValue = Number(e.target.value);
    //}
    const item = {
      ...this.state.item,
      [propName]: propValue
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
      // item.id = getId();
      this.props.insertItem(item, this.props.history, this.props.itype);
    }
  }

  render() {
    // select form type
    const mainDataForm = itemSpecific(this.props.itype).mainDataForm;

    return (
      <React.Fragment>
        {this.props.warningmsg ? (
          <div className="col-12">
            <WarningAlert
              message={this.props.warningmsg}
              hide={this.hideWarning}
            />
          </div>
        ) : null}
        {this.props.errormsg ? (
          <div className="col-12">
            <ErrorAlert message={this.props.errormsg} hide={this.hideError} />
          </div>
        ) : null}
        {this.props.successmsg ? (
          <div className="col-12">
            <SuccessAlert
              message={this.props.successmsg}
              hide={this.hideSuccess}
            />
          </div>
        ) : null}
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

const mapStateToProps = (state, ownProps) => ({
  isBusy: state.itemsStatus[ownProps.itype].isBusy,
  warningmsg: state.itemsStatus[ownProps.itype].warningmsg,
  successmsg: state.itemsStatus[ownProps.itype].successmsg,
  errormsg: state.itemsStatus[ownProps.itype].singleItemErrorMsg,
  things: state.things.data,
  items: state.fsedItems[ownProps.itype].data
});

export default connect(
  mapStateToProps,
  {
    updateItem,
    insertItem,
    hideSingleItemError
    //hideWarning,
    //hideSuccess
  }
)(EditItem);
