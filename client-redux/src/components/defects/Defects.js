import React, { Component } from "react";
//import {Link} from 'react-router-dom';
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import DefectTable from "./components_defects/DefectTable";
import IsLoading from "../common/IsLoading";
import ErrorAlertPacket from "../common/ErrorAlert/ErrorAlertPacket";
import ItemsCount from "../common/ItemsCount";
import Pager from "../common/pager/Pager";
import Confirmation from "../common/Confirmation";
//import ExportItems from "../common/exportItems/ExportItems";
import FilterSort from "../common/filterSort/FilterSort";
import { pageChange, itemsPerPageChange } from "../../actions/pagerActions";
import { fetchDefects, deleteDefect, invalidateDefects } from "../../actions/defectsActions";
import { fetchQueries } from "../../actions/queriesActions";
import { toggleFS } from "../../actions/showActions";

class Defects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showConfirmationDialog: false,
      idToDelete: ""
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
  }

  componentDidMount() {
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
    this.props.toggleFS("defect");
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
      idToDelete: e.target.dataset.id
    });
  }

  confirmDelete() {
    this.props.deleteDefect(this.state.idToDelete);
    this.setState({
      showConfirmationDialog: false,
      idToDelete: ""
    });
  }

  unconfirmDelete() {
    this.setState({
      showConfirmationDialog: false,
      defectId: ""
    });
  }

  refreshDefects() {
    this.props.invalidateDefects();
  }

  render() {
    if (this.props.defectsError || this.props.queriesFetchError) {
      return (
        <div className="row">
          <div className="col-12">
            <ErrorAlertPacket
              errorObjArray={[
                this.props.defectsError,
                this.props.queriesFetchError
              ]}
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
          <div className="col-12 fs-header">
            <button
              className="btn btn-sm btn-secondary"
              onClick={this.toggleFilterSort}
            >
              Filter-Sort
            </button>
          </div>
          <div className="col-12">
            {this.props.showFs ? (
              <FilterSort
                history={this.props.history}
                thingType={this.thingType}
              />
            ) : null}
            <div className="row">
              <div className="button-group mb-2">
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
                  Refresh Defects
                </button>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <DefectTable
                  items={this.props.fsedDefects.slice(
                    firstItemIndex,
                    firstItemIndex + itemsPerPage
                  )}
                  editDefect={this.editDefect}
                  deleteDefect={this.showDeleteConfirmation}
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
  showFs: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  fsedDefects: state.fsedDefects.data,
  fsedDefectsAreValid: state.fsedDefects.valid,
  queriesIsLoading: state.queries.defect.isLoading,
  queriesFetchError: state.queries.defect.error,
  queriesAreValid: state.queries.defect.valid,

  allDefectCount: state.allDefects.length,
  defectsIsLoading: state.defectsStatus.isBusy,
  defectsError: state.defectsStatus.error,
  pager: state.pager,
  showFs: state.show.fsOn.defect
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
    pageChange,
    itemsPerPageChange,
    toggleFS
  }
)(Defects);
