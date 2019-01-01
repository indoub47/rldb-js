import React, { Component } from "react";
//import {Link} from 'react-router-dom';
import { PropTypes } from "prop-types";
import { connect } from "react-redux";

import MainDataForm from "./components_edit/MainDataForm";
import EditHistory from "./components_edit/EditHistory";
import ErrorAlert from "../common/ErrorAlert/ErrorAlert";
import IsLoading from "../common/IsLoading";
import { updateDefect, insertDefect } from "../../actions/defectsActions";
import getId from "../../utils/getId";

class EditDefect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defect: {
        id: "",
        kkateg: "",
        vieta: {
          meistrij: "",
          linst: "",
          kelias: "",
          iesmas: "",
          km: "",
          pk: "",
          m: "",
          siule: ""
        },
        history: [],
        begis: {
          tipas: "",
          gamykla: "",
          metai: ""
        }
      },
      isBusy: false,
      error: null
    };
    this.onChangeMain = this.onChangeMain.bind(this);
    this.onChangeVieta = this.onChangeVieta.bind(this);
    this.onChangeBegis = this.onChangeBegis.bind(this);
    this.onSubmitHi = this.onSubmitHi.bind(this);
    this.onDeleteHi = this.onDeleteHi.bind(this);
    this.onSubmitDefect = this.onSubmitDefect.bind(this);
  }

  componentDidMount() {
    if (this.props.match.params.id) {
      const defect = this.props.defects.find(
        d => d.id === this.props.match.params.id
      );
      if (defect) {
        //console.log('defect', defect);
        this.setState({ defect });
      }
    }
  }

  // onMoveHiUp(e) {
  //   const id = e.target.dataset.id;
  //   const ind = this.state.defect.history.findIndex(hi => hi.id === id);
  //   if (ind < 0) return;
  //   const currHistory = this.state.defect.history;
  //   let newHistory;
  //   if (ind === 0) {
  //     newHistory = [...currHistory.slice(1), currHistory[0]];
  //   } else {
  //     newHistory = [
  //       ...currHistory.slice(0, ind - 1),
  //       currHistory[ind],
  //       currHistory[ind - 1],
  //       ...currHistory.slice(ind + 1)
  //     ];
  //   }
  //   const defect = { ...this.state.defect, history: newHistory };
  //   this.setState({ defect });
  // }

  // replace history record
  replaceItem(draft, arr) {
    const ind = arr.findIndex(h => h.id === draft.id);
    if (ind < 0) return;
    return [...arr.slice(0, ind), draft, ...arr.slice(ind + 1)];
  }

  // insert new record
  insertItem(draft, arr) {
    draft.id = getId();
    return [...arr, draft];
  }

  // submit historyItem
  onSubmitHi(draft) {
    let newHistory;
    if (draft.id) {
      newHistory = this.replaceItem(draft, this.state.defect.history);
    } else {
      newHistory = this.insertItem(draft, this.state.defect.history);
    }

    const sort = (a, b) => {
      if (a.date < b.date) return -1;
      if (a.date > b.date) return 1;
      if (a.action.end && !b.action.end) return 1;
      if (!a.action.end && b.action.end) return -1;
      return 0;
    };

    newHistory.sort(sort);
    const newDefect = {
      ...this.state.defect,
      history: newHistory
    };
    this.setState({ defect: newDefect });
  }

  onChangeMain(e) {
    const defect = {
      ...this.state.defect,
      [e.target.name]: e.target.value
    };
    this.setState({ defect });
  }

  onChangeVieta(e) {
    const vieta = {
      ...this.state.defect.vieta,
      [e.target.name]: e.target.value
    };
    const defect = {
      ...this.state.defect,
      vieta
    };
    this.setState({ defect });
  }

  onChangeBegis(e) {
    const begis = {
      ...this.state.defect.begis,
      [e.target.name]: e.target.value
    };
    const defect = {
      ...this.state.defect,
      begis
    };
    this.setState({ defect });
  }

  onDeleteHi(e) {
    const id = e.target.dataset.id;
    const currHistory = this.state.defect.history;
    const ind = currHistory.findIndex(hi => hi.id === id);
    if (ind < 0) return;
    let newHistory = [
      ...currHistory.slice(0, ind),
      ...currHistory.slice(ind + 1)
    ];
    const defect = {
      ...this.state.defect,
      history: newHistory
    };
    this.setState({ defect });
  }

  onSubmitDefect(e) {
    e.preventDefault();
    const defect = this.state.defect;
    if (defect === null || defect === undefined) return;
    // validate defect here
    if (defect.id) {
      this.props.updateDefect(defect, this.props.history);
    } else {
      defect.id = getId();
      this.props.insertDefect(defect);
    }
  }

  render() {
    return (
      <React.Fragment>
        {this.props.error && <ErrorAlert errorObj={this.props.error} />}
        <IsLoading when={this.props.isBusy} />
        <MainDataForm
          defect={this.state.defect}
          onChangeMain={this.onChangeMain}
          onChangeVieta={this.onChangeVieta}
          onChangeBegis={this.onChangeBegis}
          things={this.props.things}
        />

        <EditHistory
          defectHistory={this.state.defect.history}
          submitItem={this.onSubmitHi}
          deleteItem={this.onDeleteHi}
        />

        <button className="btn btn-info" onClick={this.onSubmitDefect}>
          Submit Defect
        </button>
      </React.Fragment>
    );
  }
}

EditDefect.propTypes = {
  updateDefect: PropTypes.func.isRequired,
  insertDefect: PropTypes.func.isRequired,
  isBusy: PropTypes.bool,
  error: PropTypes.object
};

const mapStateToProps = state => ({
  isBusy: state.defectsStatus.isBusy,
  error: state.defectsError.error,
  things: state.things.data,
  defects: state.fsedDefects.data
});

export default connect(
  mapStateToProps,
  { updateDefect, insertDefect }
)(EditDefect);
