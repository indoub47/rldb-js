import React, { Component } from "react";
import { connect } from "react-redux";
import Alert from "../common/Alert";
import { createOptions } from "../../../createOptions";
import IsLoading from "../common/IsLoading";
import {
  updateItem,
  insertItem,
  hideSingleItemAlert
} from "../../actions/itemsActions";
import {
  fetchJournal
} from "../../actions/journalActions";
import itemSpecific from "../../itemSpecific";

class EditItem extends Component {
  #options;
  constructor(props) {
    super(props);
    this.state = {
      main: {}, // duodamas MainDataForm'ai
      journal: [], // duodamas JournalList'ui
      jItem: {}, // duodamas JournalEdit'ui
      jItemAlert: null, // duodamas HistoriEdit'ui
      jToDelete: [], // indices to delete
    };

    this.onSubmitItem = this.onSubmitItem.bind(this);
    this.submitJItem = this.submitJItem.bind(this);
    this.deleteJItem = this.deleteJItem.bind(this);
    this.setJItemForEdit = this.setJItemForEdit.bind(this);
    this.cancelJItem = this.cancelJItem.bind(this);
    this.onChangeMain = this.onChangeMain.bind(this);
    this.onChangeJItem = this.onChangeJItem.bind(this);

    this.#options = {
      meistrija: createOptions(
        this.props.things.meistrija.sort((m1, m2) => m1.ind - m2.ind),
        "-- nenurodyta --",
        x => x.abbr + ", " + x.name
      ),
      kkateg: createOptions(
        this.props.things.kkateg,
        "-- nenurodyta --",
        x => x.id
      ),
      btipas: createOptions(
        this.props.things.btipas,
        "-- nenurodyta --",
        x => x.id
      ),
      bgamykl: createOptions(
        this.props.things.bgamykl,
        "-- nenurodyta --",
        x => x.id
      ),
      siule: createOptions(
        this.props.things.siule,
        "-- nenurodyta --",
        x => x.id
      ),
      pavoj: createOptions(
        this.props.things.pavoj.sort((p1, p2) => p1.ind - p2.ind),
        "-- nenurodyta --",
        x => x.id
      ),
      apar: createOptions(
        this.props.things.defskop.sort((d1, d2) => d1.id - d2.id),
        "-- nenurodyta --",
        x => x.id
      ),
      oper: createOptions(
        this.props.things.operat.sort((o1, o2) => o1.name - o2.name),
        "-- nenurodyta --",
        x => x.id + ", " + 
      ),
      action: createOptions(
        [
          { id: 0, name: "aptikta" },
          { id: 1, name: "redaguota" },
          { id: 2, name: "pakeistas bėgis" },
          { id: 3, name: "sutvarsliuota" }
        ],
        "-- nenurodyta --",
        x => x.name
      )
    }
  }

  submitJItem() {
    // Duodamas JournalEdit formai
    
    if (!this.state.jItem) return;
    const jItem = this.state.jItem;
    
    let journal;
    if (jItem.id) {
      if (!jItem.status) {
         jItem.status = "edit";
      }
      // replacing
      const ind = this.state.journal.findIndex(item => item.id === jItem.id);
      journal = [
        ...this.state.journal.slice(0, ind),
        {...jItem},
        ...this.state.journal.slice(ind + 1)
      ]; 
    } else {
      // no id, so there must be no status as well -
      // it's being created
      jItem.id = Date.now() - 10000000;
      jItem.status = "add";

      // pushing
      journal = [
        ...this.state.journal,
        {...jItem}
      ];
    }
        
    journal.sort((a, b) => a.hdata - b.hdata);
    this.setState({journal, jItemAlert: {type: "success", msg: "Įrašas sėkmingai pakeistas/pridėtas"}});
  }

  cancelJItem() {
    // Duodamas JournalEdit formai
    this.setState({jItem: null});
  }

  deleteJItem(e) {
    // Duodamas JournalListui

    // get id from e-data, 
    const id = parseInt(e.dataset.id);

    // find jitem index in state.journal;
    const index = this.state.journal.findIndex(j => j.id === id);
    if (index < 0) return;

    let journal = [...this.state.journal];
    let jToDelete = [...this.state.jToDelete];
    
    if (this.state.journal[index].status === "edit") {
      jToDelete.push(id);
    }

    journal.splice(index, 1);

    this.setState({journal, jToDelete, jItemAlert: {type: "success", msg: "Įrašas sėkmingai pašalintas"}});
  }

  setJItemForEdit(e) {
    // Duodamas JournalListui
    // state.journal[index] kopijuojamas į state.jItem
    const id = parseInt(e.dataset.id);
    const jItem = this.state.journal.find(j => j.id === id);
    if (!jItem) return
    this.setState({jItemAlert: null, jItem: {...jItem}});
  }

  componentDidMount() {
    if (this.props.match.params.id) {
      const id = parseInt(this.props.match.params.id);
      // console.log("id", id);
      // console.log("items", this.props.items);
      const item = this.props.items.find(item => item.id === id);
      /// console.log("item", item);
      if (item) {
        this.setState({ main: item });
      }
      this.props.fetchJournal(id, this props.itype);
    }
  }

  componentDidUpdate(prevProps) {
    // journal has been fetched
    if (prevProps.journal == null && this.props.journal != null) {
      this.setState({journal: this.props.journal});
    }
  }

  componentWillUnmount() {
    this.props.hideSingleItemError(this.props.itype);
  }

  onChangeMain(e) {
    // paduodamas MainDataForm
    const main = {
      ...this.state.main,
      [e.target.name]: e.target.value
    };
    this.setState({ main });
  }

  onChangeJItem(e) {
    // paduodamas JournalEditForm
    const jItem = {
      ...this.state.jItem,
      [e.target.name]: e.target.value
    };
    this.setState({ jItem });
  }

  onSubmitItem(e) {
    e.preventDefault();
    if (this.state.main == null) return;
    const main = this.state.main;

    // journal items are already validated.
    // validate main data here
    // if bad - set stateError and return
    
    if (main.id) {
      let journal = {};
      journal.added = this.state.journal
        .filter(jItem => jItem.status === "add")
        .map(jItem => {
          delete jItem.status;
          return jItem;
        });
      journal.edited = this.state.journal
        .filter(jItem => jItem.status === "edit")
        .map(jItem => {
          delete jItem.status;
          return jItem;
        });
      journal.deleted = this.state.jToDelete;
      this.props.updateItem(main, journal, this.props.history, this.props.itype);
    } else {
      // jeigu nėra id, reiškia, kuriamas naujas
      // todėl visa jo journal - state.journal
      this.props.insertItem(main, {added: this.state.journal}, this.props.history, this.props.itype);
    }
  }

  render() {
    // select form type
    const mainDataForm = itemSpecific[this.props.itype].mainDataForm;
    const journalEditForm = itemSpecific[this.props.itype].journalEditForm;

    return (
      <div className="container">
        {this.props.alert ? (
          <div className="col-12">
            <Alert
              type={this.props.alert.type}
              message={this.props.alert.msg}
              hide={this.props.alert.hide}
            />
          </div>
        ) : null}
        <IsLoading when={this.props.isBusy} />
        {mainDataForm({
          item: this.state.main,
          onChange: this.onChange,
          options: this.#options
        })}
        <JournalList
          jItems={this.state.jItems}
          setForEdit={this.setJItemForEdit}
          deleteJItem={this.deleteJItem}
          itype={this.props.itype}
        />
        {journalEditForm({ 
          jItem: this.state.jItem,
          onChange: this.onChangeJItem,
          options: this.#options,
          submitJItem: this.submitJItem,
          cancelJItem: this.cancelJItem,
          alert: this.state.jItemAlert
        })}
        <div className="container">
          <button className="btn btn-info" onClick={this.onSubmitItem}>
            Submit Item
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  isBusy: state.itemsStatus[ownProps.itype].isBusy,
  alert: state.itemsStatus[ownProps.itype].singleItemAlert,
  things: state.things.data,
  items: state.fsedItems[ownProps.itype].data,
  journal: state.itemJournal,
});

export default connect(
  mapStateToProps,
  {
    updateItem,
    insertItem,
    hideSingleItemAlert
  }
)(EditItem);
