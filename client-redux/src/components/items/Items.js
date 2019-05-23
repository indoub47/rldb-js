import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import ItemTable from "./ItemTable";
import IsLoading from "../common/IsLoading";
import ErrorAlert from "../common/Alerts/ErrorAlert";
import WarningAlert from "../common/Alerts/WarningAlert";
import SuccessAlert from "../common/Alerts/SuccessAlert";
import ItemsCount from "../common/ItemsCount";
import Pager from "../common/pager/Pager";
import Confirmation from "../common/Confirmation";
import ExportItems from "../common/exportItems/ExportItems";
import FilterSort from "../common/filterSort/FilterSort";
import {
  deleteItem,
  fetchItems,
  invalidateItems,
  pageChange,
  itemsPerPageChange,
  toggleFS,
  hideItemListError,
  hideWarning,
  hideSuccess} from "../../actions/itemsActions";
import { fetchQueries } from "../../actions/queriesActions";
//import * from "../../iTypes";

class Items extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showConfirmationDialog: false,
      idToDelete: "",
      vToDelete: ""
    };
    this.toggleFilterSort = this.toggleFilterSort.bind(this);
    this.editItem = this.editItem.bind(this);
    this.createItem = this.createItem.bind(this);
    this.pageChange = this.pageChange.bind(this);
    this.itemsPerPageChange = this.itemsPerPageChange.bind(this);
    this.showDeleteConfirmation = this.showDeleteConfirmation.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
    this.unconfirmDelete = this.unconfirmDelete.bind(this);
    this.refreshItems = this.refreshItems.bind(this);
    this.refreshItemsAll = this.refreshItemsAll.bind(this);
    this.hideSuccess = this.hideSuccess.bind(this);
    this.hideWarning = this.hideWarning.bind(this);
    //this.hideError = this.hideError.bind(this);
    this.getItems = this.getItems.bind(this);
  }

  componentDidMount() {   
    
    if (!this.props.fsedItemsAreValid) {
      this.props.fetchItems(this.props.itype);
    }

    if (!this.props.queriesAreValid) {
      this.props.fetchQueries(this.props.itype);
    }
  }

  componentDidUpdate(prevProps) {
    //console.log("items.componentDidUpdate props",this.props);
    if (prevProps.fsedItemsAreValid &&!this.props.fsedItemsAreValid) {
      this.props.fetchItems(this.props.itype);
    }
    if (prevProps.queriesAreValid && !this.props.queriesAreValid) {
      this.props.fetchQueries(this.props.itype);
    }
  }

  componentWillUnmount() {
    this.props.hideItemListError(this.props.itype);
    this.props.hideWarning(this.props.itype);
    this.props.hideSuccess(this.props.itype);
    console.log("items component will unmount");
  }

  pageChange(pageIndex) {
    this.props.pageChange(pageIndex, this.props.fsedItems.length, this.props.itype);
  }

  itemsPerPageChange(e) {
    const selectedValue = parseInt(e.target.value, 10);
    this.props.itemsPerPageChange(selectedValue, this.props.fsedItems.length, this.props.itype);
  }

  toggleFilterSort() {
    this.props.toggleFS(this.props.itype);
  }

  createItem() {
    this.props.history.push(`/${this.props.itype}s/new`);
  }

  editItem(e) {
    const id = e.target.dataset.id;
    this.props.history.push(`${this.props.itype}s/edit/${id}`);
  }

  showDeleteConfirmation(e) {
    this.setState({
      showConfirmationDialog: true,
      idToDelete: e.target.dataset.id,
      vToDelete: e.target.dataset.v
    });
  }

  confirmDelete() {
    this.props.deleteItem(this.state.idToDelete, this.state.vToDelete,this.props.itype);
    this.setState({
      showConfirmationDialog: false,
      idToDelete: "",
      vToDelete: ""
    });
  }

  unconfirmDelete() {
    this.setState({
      showConfirmationDialog: false,
      idToDelete: "",
      vToDelete: ""
    });
  }

  refreshItems() {
    this.props.invalidateItems(false, this.props.itype);
  }

  refreshItemsAll() {
    this.props.invalidateItems(true, this.props.itype);
  }

  hideSuccess() {
    this.props.hideSuccess(this.props.itype);
  }

  hideWarning() {
    this.props.hideWarning(this.props.itype);
  }

  hideItemListError() {
    this.props.hideItemListError(this.props.itype);
  }

  getItems() {
    return this.props.fsedItems;
  }

  render() {
    if (this.props.itemsFetchError || this.props.queriesFetchError) {
      return (
        <div className="row">
          <div className="col-12">
            <ErrorAlert
              message={
                this.props.itemsFetchError.message ||
                this.props.queriesFetchError.message
              }
            />
          </div>
        </div>
      );
    }

    if (
      !this.props.queriesAreValid ||
      this.props.queriesIsLoading ||
      !this.props.fsedItemsAreValid ||
      this.props.itemsIsLoading
    ) {
      return <IsLoading />;
    }
    const { firstItemIndex, itemsPerPage, buttons } = this.props.pager;

    const pagerComponent =
      buttons.length > 0 ? (
        <Pager
          firstItemIndex={firstItemIndex}
          buttons={buttons}
          itemsPerPage={itemsPerPage}
          onPageChanged={this.pageChange}
          onItemsPerPageChanged={this.itemsPerPageChange}
          itemCount={this.props.fsedItems.length}
        />
      ) : null;

    return (
      <div className="container-fluid">
        <Confirmation
          title="Delete Confirmation"
          body="Please confirm that you really want to delete this item from database."
          confirmHandler={this.confirmDelete}
          rejectHandler={this.unconfirmDelete}
          show={this.state.showConfirmationDialog}
        />
        <div className="row">
          <div className="col-12 commands button-group mb-2">
            <button
              className="btn btn-sm btn-secondary"
              onClick={this.toggleFilterSort}
            >
              Filter-Sort
            </button>
            <button
              className="btn btn-sm btn-primary"
              onClick={this.createItem}
            >
              New Item
            </button>
            <button
              className="btn btn-sm btn-warning"
              onClick={this.refreshItems}
            >
              Refresh
            </button>
            <button
              className="btn btn-sm btn-warning"
              onClick={this.refreshItemsAll}
            >
              Refresh All
            </button>
          </div>
          <div className="col-12">
            {this.props.showFS ? (
              <FilterSort
                itype={this.props.itype}
                history={this.props.history}
              />
            ) : null}
            <div className="row">
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
                  <ErrorAlert
                    message={this.props.errormsg}
                    hide={this.hideError}
                  />
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
              <div className="col-12">
                <ItemTable
                  itype={this.props.itype}
                  items={this.props.fsedItems.slice(
                    firstItemIndex,
                    firstItemIndex + itemsPerPage
                  )}
                  editItem={this.editItem}
                  deleteItem={this.showDeleteConfirmation}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-3">
                <ItemsCount
                  inView={this.props.fsedItems.length}
                  total={this.props.allItemCount}
                />
              </div>

              <div className="col-7">{pagerComponent}</div>

              <div className="col-xl-2">
                <ExportItems getItems={this.getItems} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Items.propTypes = {
  itype: PropTypes.string.isRequired,
  fsedItems: PropTypes.array,
  fsedItemsAreValid: PropTypes.bool.isRequired,
  allItemCount: PropTypes.number,
  filterSort: PropTypes.object,
  fetchItems: PropTypes.func.isRequired,
  deleteItem: PropTypes.func.isRequired,
  invalidateItems: PropTypes.func.isRequired,
  itemsIsLoading: PropTypes.bool,
  errormsg: PropTypes.string,
  pager: PropTypes.object.isRequired,
  fetchQueries: PropTypes.func.isRequired,
  queriesIsLoading: PropTypes.bool,
  queriesFetchError: PropTypes.object,
  pageChange: PropTypes.func.isRequired,
  itemsPerPageChange: PropTypes.func.isRequired,
  toggleFS: PropTypes.func.isRequired,
  showFS: PropTypes.bool.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  queriesIsLoading: state.queries[ownProps.itype].isLoading,
  queriesFetchError: state.queries[ownProps.itype].error,
  queriesAreValid: state.queries[ownProps.itype].valid,

  allItemCount: state.allItems[ownProps.itype].length,
  fsedItems: state.fsedItems[ownProps.itype].data,
  fsedItemsAreValid: state.fsedItems[ownProps.itype].valid,
  itemsIsLoading: state.itemsStatus[ownProps.itype].isBusy,
  errormsg: state.itemsStatus[ownProps.itype].itemListErrorMsg,
  itemsFetchError: state.itemsStatus[ownProps.itype].fetchError,
  warningmsg: state.itemsStatus[ownProps.itype].warningmsg,
  successmsg: state.itemsStatus[ownProps.itype].successmsg,
  allItems: state.itemsStatus[ownProps.itype].all,
  pager: state.itemsPager[ownProps.itype],
  showFS: state.itemsShow[ownProps.itype].fsOn
});

Items.defaultProps = {
  fsedItems: [],
  allItemCount: 0
};

export default connect(
  mapStateToProps,
  {
    deleteItem,
    fetchItems,
    fetchQueries,
    invalidateItems,
    pageChange,
    itemsPerPageChange,
    toggleFS,
    hideItemListError,
    hideWarning,
    hideSuccess
  }
)(Items);
