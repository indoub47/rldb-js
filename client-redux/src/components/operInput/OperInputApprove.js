import React, { Component } from "react";
import { connect } from "react-redux";
import Alert from "../common/Alert";
import IsLoading from "../common/IsLoading";
import ModalFormPanel from "./ModalFormPanel";
import {
  submitIApprove,
  fetchSuppliedOperInput,
  setAction,
  setNote
} from "../../actions/inputApproveActions";
import itemSpecific from "./itemSpecific";

class OperInputApprove extends Component {
  #noteInput;
  constructor(props) {
    super(props);
    this.state = {
      currentIndex: null,
      note: "",
      showModal: false
    };
    this.#noteInput = ({ note, onChange }) => (
      <input type="text" value={note} onChange={onChange} />
    );
    this.changeAction = this.changeAction.bind(this);
    this.changeNote = this.changeNote.bind(this);
    this.setEdit = this.setEdit.bind(this);
    this.submitEdit = this.submitEdit.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
    this.submitInputs = this.submitInputs.bind(this);
  }

  componentDidMount() {
    /// reikia užkrauti visus inputus
    this.props.fetchSuppliedOperInput(this.props.itype);
  }

  changeAction(e) {
    const ind = e.target.dataset.ind;
    const action = e.target.value;
    this.props.setAction(action, ind);
  }

  setEdit(e) {
    const ind = e.target.dataset.ind;
    this.setState({
      currentIndex: ind,
      note: this.props.inputs[ind].note,
      showModal: true
    });
  }

  submitEdit() {
    const ind = this.state.currentIndex;
    const note = this.state.note;
    this.props.setNote(note, ind);
    this.setState({
      currentIndex: null,
      note: "",
      showModal: false
    });
  }

  cancelEdit() {
    this.setState({
      currentIndex: null,
      note: "",
      showModal: false
    });
  }

  changeNote(e) {
    const note = e.target.value;
    if (note.length > 50) return;
    this.setState({ note });
  }

  submitInputs() {
    this.props.submitIApprove(this.props.inputs, this.props.itype);
  }

  render() {
    // select row type
    if (this.state.inputs.length === 0) {
      return (
        <div className="container">
          <div className="row">
            <div className="col">No inputs to approve or disapprove yet.</div>
          </div>
        </div>
      );
    }
    const SingleRow = itemSpecific[this.props.itype].approveRow.SingleRow;
    const HeadRow = itemSpecific[this.props.itype].approveRow.HeadRow;
    const rows = this.props.inputs.map((i, ind) => (
      <SingleRow
        item={i}
        ind={ind}
        changeAction={this.changeAction}
        setEdit={this.setEdit}
        key={i.id}
      />
    ));

    return (
      <React.Fragment>
        <IsLoading when={this.props.isLoading} />
        {this.props.info ? (
          <Alert
            message={this.props.info.message}
            type={this.props.info.type}
          />
        ) : null}
        <ModalFormPanel
          body={this.#noteInput({
            note: this.state.note,
            onChange: this.changeNote
          })}
          title={"Pastaba"}
          submitHandler={this.submitEdit}
          cancelHandler={this.cancelEdit}
          show={this.state.showModal}
        />
        <div className="container">
          <div className="row">
            <table className="table">
              <HeadRow />
              <tbody>{rows}</tbody>
            </table>
          </div>
          <div className="row">
            <button className="btn btn-warning" onClick={this.submitInputs}>
              Submit
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  inputs: state.iApprove.items,
  info: state.iApprove.info,
  isLoading: state.iApprove.isLoading
});

export default connect(
  mapStateToProps,
  {
    submitIApprove,
    fetchSuppliedOperInput,
    setAction,
    setNote
  }
)(OperInputApprove);
