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
    if (this.props.match.params.id) {
      const id = parseInt(this.props.match.params.id);
      //console.log("id", id);
      //console.log("items", this.props.items);
      const item = this.props.items.find(
        item => item.id === id
      );
      ///console.log("item", item);
      if (item) {
        this.setState({ item });
      }
    }
  }

  onChange(e) {
    //const numberProps = ["km", "pk", "m", "bmetai", "dl", "dh"];
    const propName = e.target.name;
    let propValue = e.target.value;
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
      this.props.insertItem(item, this.props.itype);
    }
  }

  render() {
    // select form type 
    const mainDataForm = itemSpecific(this.props.itype).mainDataForm;

    return (
      <React.Fragment>
        {this.props.errormsg && <ErrorAlert message={this.props.errormsg} />}
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
  errormsg: PropTypes.string,
  itype: PropTypes.string.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  isBusy: state.itemsStatus[ownProps.itype].isBusy,
  errormsg: state.itemsStatus[ownProps.itype].errormsg,
  things: state.things.data,
  items: state.fsedItems[ownProps.itype].data
});

export default connect(
  mapStateToProps,
  { updateItem, insertItem }
)(EditItem);
