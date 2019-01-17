import React, { Component } from "react";
//import {Link} from 'react-router-dom';
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import WeldingTable from "./components_weldings/WeldingTable";
import IsLoading from "../common/IsLoading";
import ErrorAlertPacket from "../common/ErrorAlert/ErrorAlertPacket";
import ItemsCount from "../common/ItemsCount";
import Pager from "../common/pager/Pager";
import Confirmation from "../common/Confirmation";
//import ExportItems from "../common/exportItems/ExportItems";
import FilterSort from "../common/filterSort/FilterSort";
import { pageChange, itemsPerPageChange } from "../../actions/pagerActions";
import {
  fetchWeldings,
  deleteWelding,
  invalidateWeldings, 
  filterSortWeldings
} from "../../actions/weldingsActions";
import { fetchQueries } from "../../actions/queriesActions";
import { toggleFS } from "../../actions/showActions";

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
    this.props.toggleFS("welding");
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
    this.props.invalidateWeldings();
  }

  render() {
    if (this.props.weldingsError || this.props.queriesFetchError) {
      return (
        <div className="row">
          <div className="col-12">
            <ErrorAlertPacket
              errorObjArray={[
                this.props.weldingsError,
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
                fsAction={this.props.filterSortWeldings} 
              />
            ) : null}
            <div className="row">
              <div className="button-group mb-2">
                <button
                  className="btn btn-sm btn-primary"
                  onClick={this.createWelding}
                >
                  New Welding
                </button>
                <button
                  className="btn btn-sm btn-warning"
                  onClick={this.refreshWeldings}
                >
                  Refresh Weldings
                </button>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <WeldingTable
                  items={this.props.fsedWeldings.slice(
                    firstItemIndex,
                    firstItemIndex + itemsPerPage
                  )}
                  editWelding={this.editWelding}
                  deleteWelding={this.showDeleteConfirmation}
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
  showFs: PropTypes.bool.isRequired
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
  pager: state.pager,
  showFs: state.show.fsOn.welding
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
    toggleFS
  }
)(Weldings);
