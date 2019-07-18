import React, { Component } from "react";
import { connect } from "react-redux";
import Alert from "../common/Alert";
import IsLoading from "../common/IsLoading";
import ModalFormPanel from "./ModalFormPanel";
import {
  submitOperInput,
  fetchSuppliedOperInput,
  clearOperInput
} from "../../actions/operInputActions";
import itemSpecific from "./itemSpecific";

class OperInputApprove extends Component {
  #noteInput;
  constructor(props) {
    super(props);
    this.state = {
      inputs: [],
      currentIndex: null,
      note: "",
      actions: [],
      showModal: false
    };
    this.#noteInput = ({ note, onChange }) => (
      <input type="text" value={note} onChange={onChange} />
    );
    this.toggleAction = this.toggleAction.bind(this);
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

  componentDidUpdate(prevProps) {
    if (prevProps.operInput.length < 1 && this.props.operInput.length > 0) {
      this.setState({
        inputs: this.props.operInput,
        actions: Array(this.props.operInput.length).fill("none")
      });
    } else if (
      prevProps.operInput.length > 0 &&
      this.props.operInput.length < 1
    ) {
      this.setState({
        inputs: [],
        actions: []
      });
    }
  }

  componentWillUnmount() {
    // unload operinput from store
    this.props.clearOperInput();
  }

  toggleAction(e) {
    const ind = e.target.dataset.ind;
    const value = e.target.value;
    const actions = [...this.state.actions];
    actions[ind] = value;
    this.setState({ actions });
  }

  setEdit(e) {
    const ind = e.target.dataset.ind;
    this.setState({
      currentIndex: ind,
      note: this.state.inputs[ind].note,
      showModal: true
    });
  }

  submitEdit() {
    const ind = this.state.currentIndex;
    const input = { ...this.state.inputs[ind] };
    input.journal.note = this.state.note;
    const inputs = [...this.state.inputs];
    inputs[ind] = input;
    this.setState({
      inputs,
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
    const inputs = this.state.inputs.map((inp, ind) => ({
      ...inp,
      action: this.state.actions[ind]
    }));
    this.props.submitOperInput(inputs, this.props.itype);
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
    const rows = this.state.inputs.map((i, ind) => (
      <SingleRow
        item={i}
        ind={ind}
        action={this.state.actions[ind]}
        toggleAction={this.toggleAction}
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
  operInput: state.operInput.items,
  info: state.operInput.info,
  isLoading: state.operInput.isLoading
});

export default connect(
  mapStateToProps,
  {
    submitOperInput,
    fetchSuppliedOperInput,
    clearOperInput
  }
)(OperInputApprove);
