import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import ItemTable from "./components_of_defects/ItemTable";
import IsLoading from "../common/IsLoading";
import ErrorAlert from "../common/Alerts/ErrorAlert";
import WarningAlert from "../common/Alerts/WarningAlert";
import SuccessAlert from "../common/Alerts/SuccessAlert";
import ItemsCount from "../common/ItemsCount";
import Pager from "../common/pager/Pager";
import Confirmation from "../common/Confirmation";
import FilterSort from "../common/filterSort/FilterSort";
import * from "../../actions/defectsActions";
import { fetchQueries } from "../../actions/queriesActions";

class Defects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showConfirmationDialog: false,
      _idToDelete: "",
      vToDelete: ""
    };
    this.thingType = "defect";
    this.toggleFilterSort = this.toggleFilterSort.bind(this);
    this.editDefect = this.editDefect.bind(this);
    this.createDefect = this.createDefect.bind(this);
    this.pageChange = this.pageChange.bind(this);
    this.itemsPerPageChange = this.itemsPerPageChange.bind(this);
    this.showDeleteConfirmation = this.showDeleteConfirmation.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
    this.unconfirmDelete = this.unconfirmDelete.bind(this);
    this.refreshDefects = this.refreshDefects.bind(this);
    this.refreshDefectsAll = this.refreshDefectsAll.bind(this);
  }

  componentDidMount() {
    //this.props.refreshStatus();
    if (!this.props.fsedDefectsAreValid) {
      this.props.fetchDefects();
    }

    if (!this.props.queriesAreValid) {
      this.props.fetchQueries(this.thingType);
    }
  }

  componentDidUpdate() {
    if (!this.props.fsedDefectsAreValid) {
      this.props.fetchDefects();
    }
  }

  pageChange(pageIndex) {
    this.props.pageChange(pageIndex, this.props.fsedDefects.length);
  }

  itemsPerPageChange(e) {
    const selectedValue = parseInt(e.target.value, 10);
    this.props.itemsPerPageChange(selectedValue, this.props.fsedDefects.length);
  }

  toggleFilterSort() {
    this.props.toggleFS();
  }

  createDefect() {
    this.props.history.push("/defects/new");
  }

  editDefect(e) {
    const id = e.target.dataset.id;
    this.props.history.push(`defects/edit/${id}`);
  }

  showDeleteConfirmation(e) {
    this.setState({
      showConfirmationDialog: true,
      _idToDelete: e.target.dataset.id,
      vToDelete: e.target.dataset.v
    });
  }

  confirmDelete() {
    this.props.deleteDefect(this.state._idToDelete, this.state.vToDelete);
    this.setState({
      showConfirmationDialog: false,
      _idToDelete: "",
      vToDelete: ""
    });
  }

  unconfirmDelete() {
    this.setState({
      showConfirmationDialog: false,
      _idToDelete: "",
      vToDelete: ""
    });
  }

  refreshDefects() {
    this.props.invalidateDefects(false);
  }

  refreshDefectsAll() {
    this.props.invalidateDefects(true);
  }

  render() {
    if (this.props.defectsFetchError || this.props.queriesFetchError) {
      return (
        <div className="row">
          <div className="col-12">
            <ErrorAlert
              message={
                this.props.defectsFetchError.message ||
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
      !this.props.fsedDefectsAreValid ||
      this.props.defectsIsLoading
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
          itemCount={this.props.fsedDefects.length}
        />
      ) : null;

    return (
      <div className="container-fluid">
        <Confirmation
          title="Delete Confirmation"
          body="Please confirm that you really want to delete this defect from database."
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
              onClick={this.createDefect}
            >
              New Defect
            </button>
            <button
              className="btn btn-sm btn-warning"
              onClick={this.refreshDefects}
            >
              Refresh
            </button>
            <button
              className="btn btn-sm btn-warning"
              onClick={this.refreshDefectsAll}
            >
              Refresh All
            </button>
          </div>
          <div className="col-12">
            {this.props.showFS ? (
              <FilterSort
                history={this.props.history}
                thingType={this.thingType}
                fsAction={this.props.filterSortDefects}
                toggleFSManual={this.props.toggleFSManual}
                filterSortError={this.props.filterSortError}
                showFSManual={this.props.showFSManual}
              />
            ) : null}
            <div className="row">
              {this.props.warning ? (
                <div className="col-12">
                  <WarningAlert
                    message={this.props.warning}
                    hide={this.props.hideWarning}
                  />
                </div>
              ) : null}
              {this.props.defectsError ? (
                <div className="col-12">
                  <ErrorAlert
                    message={this.props.defectsError.message}
                    hide={this.props.hideError}
                  />
                </div>
              ) : null}
              {this.props.success ? (
                <div className="col-12">
                  <SuccessAlert
                    message={this.props.success}
                    hide={this.props.hideSuccess}
                  />
                </div>
              ) : null}
              <div className="col-12">
                <ItemTable
                  items={this.props.fsedDefects.slice(
                    firstItemIndex,
                    firstItemIndex + itemsPerPage
                  )}
                  editItem={this.editDefect}
                  deleteItem={this.showDeleteConfirmation}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-3">
                <ItemsCount
                  inView={this.props.fsedDefects.length}
                  total={this.props.allDefectCount}
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

Defects.propTypes = {
  fsedDefects: PropTypes.array,
  fsedDefectsAreValid: PropTypes.bool.isRequired,
  allDefectCount: PropTypes.number,
  filterSort: PropTypes.object,
  fetchDefects: PropTypes.func.isRequired,
  deleteDefect: PropTypes.func.isRequired,
  invalidateDefects: PropTypes.func.isRequired,
  defectsIsLoading: PropTypes.bool,
  defectsError: PropTypes.object,
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
  queriesIsLoading: state.queries.defect.isLoading,
  queriesFetchError: state.queries.defect.error,
  queriesAreValid: state.queries.defect.valid,

  allDefectCount: state.allDefects.length,
  fsedDefects: state.fsedDefects.data,
  fsedDefectsAreValid: state.fsedDefects.valid,
  defectsIsLoading: state.defectsStatus.isBusy,
  defectsError: state.defectsStatus.error,
  defectsFetchError: state.defectsStatus.fetchError,
  warning: state.defectsStatus.warning,
  success: state.defectsStatus.success,
  pager: state.defectsPager,
  showFS: state.defectsShow.fsOn,
  filterSortError: state.defectsFS.error,
  showFSManual: state.defectsShow.fsManualOn
});

Defects.defaultProps = {
  fsedDefects: [],
  allDefectCount: 0
};

export default connect(
  mapStateToProps,
  {
    deleteDefect,
    fetchDefects,
    fetchQueries,
    invalidateDefects,
    filterSortDefects,
    pageChange,
    itemsPerPageChange,
    toggleFS,
    toggleFSManual,
    hideError,
    hideWarning,
    hideSuccess
  }
)(Defects);
