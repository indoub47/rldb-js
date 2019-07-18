import React, { Component } from "react";
import { connect } from "react-redux";
import { createOptions } from "../createOptions";
import IsLoading from "../common/IsLoading";
import InputPanel from "./InputPanel";
import SearchPanel from "./SearchPanel";
import ModalFormPanel from "./ModalFormPanel";
import {dropFields} from "./functions";
import {
  fetchUnapprovedOperInput,
  setItems,
  searchItems,
  supplyOperInput,
  clearOperInput,
  dispatchRemoveInfo,
  dispatchRemoveSearchInfo
} from "../../actions/operInputActions";
import itemSpecific from "./itemSpecific";

class OperInputSupply extends Component {
  #options;
  constructor(props) {
    super(props);
    this.state = {
      currentInput: {},
      inputItemErrors: {},
      showInputModal: false,
      searchInput: {},
      searchInputErrors: {},
      showSearchModal: false
    };


    this.changeInputItem = this.changeInputItem.bind(this);
    this.startNewInput = this.startNewInput.bind(this);
    this.submitRecord = this.submitRecord.bind(this);
    this.cancelEditRecord = this.cancelEditRecord.bind(this);
    this.clearCurrentRecord = this.clearCurrentRecord.bind(this);
    this.changeSearchInput = this.changeSearchInput.bind(this);
    this.submitSearch = this.submitSearch.bind(this);
    this.cancelSearch = this.cancelSearch.bind(this);
    this.clearCurrentSearch = this.clearCurrentSearch.bind(this);
    this.sendItems = this.sendItems.bind(this);
    this.clearInputItems = this.clearInputItems.bind(this);
    this.setItemEdit = this.setItemEdit.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.setFoundItemEdit = this.setFoundItemEdit.bind(this);
    this.startNewSearch = this.startNewSearch.bind(this);
    this.hideInfo = this.hideInfo.bind(this);
    this.hideSearchInfo = this.hideSearchInfo.bind(this);
    this.copyInput = this.copyInput.bind(this);


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
        x => x.id + ", " + x.name
      ),      
      virino: createOptions(
        this.props.things.virino.sort((v1, v2) => v1.name - v2.name),
        "-- nenurodyta --",
        x => x.id + ", " + x.name
      ),
      vbudas: createOptions(
        this.props.things.vbudas.sort((b1, b2) => b1.id - b2.id),
        "-- nenurodyta --",
        x => x.id + ", " + x.name
      ),
      itemStatus: createOptions(
        this.props.things.itemstatus.sort((b1, b2) => b1.id - b2.id),
        "-- nenurodyta --",
        x => x.id + ", " + x.name
      )
    }
  }

  componentDidMount() {
    this.props.fetchUnapprovedOperInput(this.props.itype);
  }

  hideInfo() {
    this.props.dispatchRemoveInfo();
  }

  hideSearchInfo() {
    this.props.dispatchRemoveSearchInfo();
  }

  componentWillUnmount() {
    this.props.clearOperInput();
  }

  copyInput(e) {
    const id = e.target.dataset.id;
    const item = this.props.items.find(i => i.id.toString() === id.toString());
    if (!item) return;
    const newItem = {...item, id: -Date.now()};
    delete newItem.mainid;
    this.setState({
      currentInput: newItem,
      inputItemErrors: {},
      showInputModal: true,
      showSearchModal: false
    });
  }

  changeInputItem(e) {
    const currentInput = {
      ...this.state.currentInput,
      [e.target.name]: e.target.value
    };
    this.setState({currentInput});
  }

  startNewInput() {
    this.setState({
      currentInput: {id: -Date.now()},
      inputItemErrors: {},
      showInputModal: true,
      showSearchModal: false,
    });
  }

  // as for now - just mocking
  validateRecord(draft, itype) {
    const item = draft;
    return item;
  }

  submitRecord() {
    // local validation
    // if (!Object.keys(this.state.currentInput).length) return;
    const item = this.validateRecord(this.state.currentInput, this.props.itype);
    if (item.errors) {
      this.setState({
        inputItemErrors: item.errors
      });
      return;
    }

    let items;
    const ind = this.props.items.findIndex(i => i.id === this.state.currentInput.id);
    if (ind < 0) {
      items = [...this.props.items, item];
    } else {
      items = [
        ...this.props.items.slice(0, ind),
        item,
        ...this.props.items.slice(ind + 1)
      ];
    }

    console.log("setting props1");
    this.props.setItems(items);
    console.log("setting state1");
    this.setState({
      inputItemErrors: {},
      showInputModal: false,
      currentInput: {}
    });    
    console.log("end setting1");
  }

  cancelEditRecord() {
    this.setState({
      inputItemErrors: {},
      currentInput: {},
      showInputModal: false
    });
  }

  clearCurrentRecord() {
    this.setState({
      inputItemErrors: {},
      currentInput: {}
    });
  }

  changeSearchInput(e) {
    const searchInput = {
      ...this.state.searchInput,
      [e.target.name]: e.target.value
    };
    this.setState({searchInput});
  }

  // as for now - just mocking
  validateSearchInput(itype, input) {
    const searchItem = input;
    return searchItem;
  }

  submitSearch() {
    const data = this.validateSearchInput(this.props.itype, this.state.searchInput);
    if (data.errors) {
      this.setState({
        searchInputErrors: data.errors
      });
      return;
    }
    this.setState({showSearchModal: false});
    this.props.searchItems(this.props.itype, data);
  }

  cancelSearch() {
    this.setState({
      searchInputErrors: {},
      searchInput: {},
      showSearchModal: false
    });
  }

  clearCurrentSearch() {
    this.setState({
      searchInputErrors: {},
      searchInput: {},
    })
  }

  sendItems() {
    // atrodo čia teks pakartoti visą litaniją su update, insert, delete, bliad
    if (this.props.items.length < 1) return;
    this.props.supplyOperInput(this.props.items, this.props.itype);
  }

  clearInputItems() {    
    this.props.clearOperInput();
  }

  setItemEdit(e) {
    const id = e.target.dataset.id;
    const item = this.props.items.find(i => i.id.toString() === id.toString());
    if (!item) return;
    this.setState({
      currentInput: {...item},
      inputItemErrors: {},
      showInputModal: true,
      showSearchModal: false
    });
  }

  deleteItem(e) {
    const id = e.target.dataset.id;
    const ind = this.props.items.findIndex(i => i.id.toString() === id.toString());
    if (ind < 0) return;

    console.log("setting props2");
    this.props.setItems([
        ...this.props.items.slice(0, ind),
        ...this.props.items.slice(ind + 1)
      ]);
    console.log("setting state2");
    this.setState({currentInput: null})        
    console.log("end setting2");
  }

  setFoundItemEdit(e) {
    const id = e.target.dataset.id;
    const item = this.props.foundItems.find(i => i.id.toString() === id.toString());
    if (!item) return;
    this.setState({
      showSearchModal: false,
      showInputModal: true,
      currentInput: dropFields(item, this.props.itype),
      inputItemErrors: {},
      searchInputErrors: {},
      searchInput: {},
    });
  }

  startNewSearch() {
    this.setState({
      showSearchModal: true,
      showInputModal: false,
      searchInputErrors: {},
      searchInput: {},
    });
  }

  render() {
    // select form type
    const InputForm = itemSpecific[this.props.itype].inputForm.default;
    const SearchForm = itemSpecific[this.props.itype].searchForm.default;    
    //console.log("foundItems", this.props.foundItems);
    
    return (
      <React.Fragment>    
        <IsLoading when={this.props.isLoading} /> 
        <div className="container-fluid">
          <ModalFormPanel 
            body={InputForm({
              item: this.state.currentInput,
              onChange: this.changeInputItem,
              options: this.#options,
              errors: this.state.inputItemErrors,
            })}
            title={"Įrašo sukūrimas"}
            submitHandler={this.submitRecord}
            cancelHandler={this.cancelEditRecord}
            show={this.state.showInputModal}
          />
          <ModalFormPanel 
            body={SearchForm({
              searchInput: this.state.searchInput,
              onChange: this.changeSearchInput,
              options: this.#options,
              errors: this.state.searchInputErrors
            })}
            title={"Įrašų paieška"}
            submitHandler={this.submitSearch}
            cancelHandler={this.cancelSearch}
            clearHandler={this.clearCurrentSearch} // ???
            show={this.state.showSearchModal}
          />
          <InputPanel
            inputItems={this.props.items}
            itype={this.props.itype}
            newInputHandler={this.startNewInput}
            sendHandler={this.sendItems}
            clearHandler={this.clearInputItems}
            setItemEditHandler={this.setItemEdit}
            deleteItemHandler={this.deleteItem}
            copyInputHandler={this.copyInput}
            currentId={this.state.currentInput.id}
            info={this.props.info}
            hideInfo={this.hideInfo}
          />
          <SearchPanel
            foundItems={this.props.foundItems}
            itype={this.props.itype}
            setItemEditHandler={this.setFoundItemEdit}
            newSearchHandler={this.startNewSearch}
            info={this.props.searchInfo}
            hideInfo={this.hideSearchInfo}
          />
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  things: state.things.data,
  items: state.operInput.items,
  foundItems: state.operInput.foundItems,
  isLoading: state.operInput.isLoading,
  info: state.operInput.info,
  searchInfo: state.operInput.searchInfo,
});

export default connect(
  mapStateToProps,
  {
    fetchUnapprovedOperInput,
    searchItems,
    setItems,
    supplyOperInput,
    clearOperInput,
    dispatchRemoveInfo,
    dispatchRemoveSearchInfo
  }
)(OperInputSupply);
