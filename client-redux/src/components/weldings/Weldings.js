import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import ItemTable from "./components_of_weldings/ItemTable";
import IsLoading from "../common/IsLoading";
import ErrorAlert from "../common/Alerts/ErrorAlert";
//import WarningAlert from "../common/Alerts/WarningAlert";
import ItemsCount from "../common/ItemsCount";
import Pager from "../common/pager/Pager";
import Confirmation from "../common/Confirmation";
import FilterSort from "../common/filterSort/FilterSort";
import {
  fetchWeldings,
  deleteWelding,
  invalidateWeldings,
  filterSortWeldings,
  pageChange,
  itemsPerPageChange,
  toggleFS,
  toggleFSManual
} from "../../actions/weldingsActions";
import { fetchQueries } from "../../actions/queriesActions";

class Weldings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showConfirmationDialog: false,
      idToDelete: ""
    };
    this.thingType = "welding";
    this.toggleFilterSort = this.toggleFilterSort.bind(this);
    this.editWelding = this.editWelding.bind(this);
    this.createWelding = this.createWelding.bind(this);
    this.pageChange = this.pageChange.bind(this);
    this.itemsPerPageChange = this.itemsPerPageChange.bind(this);
    this.showDeleteConfirmation = this.showDeleteConfirmation.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
    this.unconfirmDelete = this.unconfirmDelete.bind(this);
    this.refreshWeldings = this.refreshWeldings.bind(this);
    this.refreshWeldingsAll = this.refreshWeldingsAll.bind(this);
  }

  componentDidMount() {
    if (!this.props.fsedWeldingsAreValid) {
      this.props.fetchWeldings();
    }

    if (!this.props.queriesAreValid) {
      this.props.fetchQueries(this.thingType);
    }
  }

  componentDidUpdate() {
    if (!this.props.fsedWeldingsAreValid) {
      this.props.fetchWeldings();
    }
  }

  pageChange(pageIndex) {
    this.props.pageChange(pageIndex, this.props.fsedWeldings.length);
  }

  itemsPerPageChange(e) {
    const selectedValue = parseInt(e.target.value, 10);
    this.props.itemsPerPageChange(
      selectedValue,
      this.props.fsedWeldings.length
    );
  }

  toggleFilterSort() {
    this.props.toggleFS();
  }

  createWelding() {
    this.props.history.push("/weldings/new");
  }

  editWelding(e) {
    const id = e.target.dataset.id;
    this.props.history.push(`weldings/edit/${id}`);
  }

  showDeleteConfirmation(e) {
    this.setState({
      showConfirmationDialog: true,
      idToDelete: e.target.dataset.id
    });
  }

  confirmDelete() {
    this.props.deleteWelding(this.state.idToDelete);
    this.setState({
      showConfirmationDialog: false,
      idToDelete: ""
    });
  }

  unconfirmDelete() {
    this.setState({
      showConfirmationDialog: false,
      weldingId: ""
    });
  }

  refreshWeldings() {
    this.props.invalidateWeldings(false);
  }

  refreshWeldingsAll() {
    this.props.invalidateWeldings(true);
  }

  render() {
    if (this.props.weldingsError || this.props.queriesFetchError) {
      return (
        <div className="row">
          <div className="col-12">
            <ErrorAlert
              message={
                this.props.weldingsError.message ||
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
      !this.props.fsedWeldingsAreValid ||
      this.props.weldingsIsLoading
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
          itemCount={this.props.fsedWeldings.length}
        />
      ) : null;

    return (
      <div className="container-fluid">
        <Confirmation
          title="Delete Confirmation"
          body="Please confirm that you really want to delete this welding from database."
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
              onClick={this.createWelding}
            >
              New
            </button>
            <button
              className="btn btn-sm btn-warning"
              onClick={this.refreshWeldings}
            >
              Refresh
            </button>
            <button
              className="btn btn-sm btn-warning"
              onClick={this.refreshWeldingsAll}
            >
              Refresh All
            </button>
          </div>
          <div className="col-12">
            {this.props.showFS ? (
              <FilterSort
                history={this.props.history}
                thingType={this.thingType}
                fsAction={this.props.filterSortWeldings}
                toggleFSManual={this.props.toggleFSManual}
                filterSortError={this.props.filterSortError}
                showFSManual={this.props.showFSManual}
              />
            ) : null}
            <div className="row">
              <div className="col-12">
                <ItemTable
                  items={this.props.fsedWeldings.slice(
                    firstItemIndex,
                    firstItemIndex + itemsPerPage
                  )}
                  editItem={this.editWelding}
                  deleteItem={this.showDeleteConfirmation}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-3">
                <ItemsCount
                  inView={this.props.fsedWeldings.length}
                  total={this.props.allWeldingCount}
                />
              </div>

              <div className="col-7">{pagerComponent}</div>

              {/*<div className="col-xl-2">
                <ExportItems items={this.props.filterSort.items} />
              </div>*/}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Weldings.propTypes = {
  fsedWeldings: PropTypes.array,
  fsedWeldingsAreValid: PropTypes.bool.isRequired,
  allWeldingCount: PropTypes.number,
  filterSort: PropTypes.object,
  fetchWeldings: PropTypes.func.isRequired,
  deleteWelding: PropTypes.func.isRequired,
  invalidateWeldings: PropTypes.func.isRequired,
  weldingsIsLoading: PropTypes.bool,
  weldingsError: PropTypes.object,
  pager: PropTypes.object.isRequired,
  fetchQueries: PropTypes.func.isRequired,
  queriesIsLoading: PropTypes.bool,
  queriesFetchError: PropTypes.object,
  pageChange: PropTypes.func.isRequired,
  itemsPerPageChange: PropTypes.func.isRequired,
  toggleFS: PropTypes.func.isRequired,
  showFS: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  fsedWeldings: state.fsedWeldings.data,
  fsedWeldingsAreValid: state.fsedWeldings.valid,
  queriesIsLoading: state.queries.welding.isLoading,
  queriesFetchError: state.queries.welding.error,
  queriesAreValid: state.queries.welding.valid,

  allWeldingCount: state.allWeldings.length,
  weldingsIsLoading: state.weldingsStatus.isBusy,
  weldingsError: state.weldingsStatus.error,
  pager: state.weldingsPager,
  showFS: state.weldingsShow.fsOn,
  filterSortError: state.weldingsFS.error,
  showFSManual: state.weldingsShow.fsManualOn
});

Weldings.defaultProps = {
  fsedWeldings: [],
  allWeldingCount: 0
};

export default connect(
  mapStateToProps,
  {
    deleteWelding,
    fetchWeldings,
    fetchQueries,
    invalidateWeldings,
    filterSortWeldings,
    pageChange,
    itemsPerPageChange,
    toggleFS,
    toggleFSManual
  }
)(Weldings);
