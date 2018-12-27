import React, { Component } from "react";
//import {Link} from 'react-router-dom';
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import DefectTable from "./components_defects/DefectTable";
import IsLoading from "../common/IsLoading";
import ErrorAlert from "../common/ErrorAlert";
import ItemsCount from "../common/ItemsCount";
import Pager from "../common/pager/Pager";
import Confirmation from "../common/Confirmation";
//import ExportItems from "../common/exportItems/ExportItems";
import FilterSort from "../common/filterSort/FilterSort";
import { pageChange, itemsPerPageChange } from "../../actions/pagerActions";
import { fetchDefects, deleteDefect } from "../../actions/defectsActions";
import { fetchQueries } from "../../actions/queriesActions";

class Defects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showFilterSort: true,
      showConfirmationDialog: false,
      idToDelete: ""
    };
    this.thingType = "defect";
    this.toggleFilterSort = this.toggleFilterSort.bind(this);
    this.editDefect = this.editDefect.bind(this);
    //this.deleteDefect = this.deleteDefect.bind(this);
    this.createDefect = this.createDefect.bind(this);
    this.pageChange = this.pageChange.bind(this);
    this.itemsPerPageChange = this.itemsPerPageChange.bind(this);
    this.showDeleteConfirmation = this.showDeleteConfirmation.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
    this.unconfirmDelete = this.unconfirmDelete.bind(this);
  }

  componentDidMount() {
    //console.log("component did mount");
    if (this.props.fsedDefects.length < 1) {
      //console.log("fetchDefects called");
      this.props.fetchDefects();
    }

    if (this.props.queryCount < 1) {
      //console.log("fetch queries called");
      this.props.fetchQueries(this.thingType);
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
    this.setState({ showFilterSort: !this.state.showFilterSort });
  }

  createDefect() {
    this.props.history.push("/defects/new");
  }

  editDefect(e) {
    const id = e.target.dataset.id;
    this.props.history.push(`defects/edit/${id}`);
  }

  // deleteDefect(e) {
  //   const id = e.target.dataset.id;
  //   this.props.deleteDefect(id);
  // }

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

  render() {
    //console.log("defectsIsLoading, queriesIsLoading:",this.props.defectsIsLoading, this.props.queriesIsLoading);

    if (this.props.queryCount < 1) {
      //console.log("initial render");
      return <h3>the innitial render</h3>;
    }

    if (this.props.defectsIsLoading || this.props.queriesIsLoading) {
      return <IsLoading />;
    }

    if (this.props.defectsError) {
      return <ErrorAlert errorObj={this.props.defectsError} />;
    }

    if (this.props.queriesFetchError) {
      return <ErrorAlert errorObj={this.props.queriesFetchError} />;
    }

    // let errorMsg = '';
    // if (this.props.defectsError) {
    //   errorMsg = errorMsg + this.props.defectsError.msg;
    // }
    // if (this.props.queriesFetchError) {
    //   errorMsg = errorMsg + '\n' + this.props.queriesFetchError.msg
    // }
    // errorMsg = errorMsg.trim();
    // if (errorMsg !== '') {
    //   return <ErrorAlert error={errorMsg} />;
    // }

    const { firstItemIndex, itemsPerPage, buttons } = this.props.pager;
    //console.log("Defects.render firstItemIndex, itemsPerPage, buttons",
    //   firstItemIndex,
    //   itemsPerPage,
    //   buttons
    // );

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
          <div className="col-xl-12 fs-header">
            <button
              className="btn btn-sm btn-secondary"
              onClick={this.toggleFilterSort}
            >
              Filter-Sort
            </button>
          </div>
          <div className="col-lg-12">
            {this.state.showFilterSort ? (
              <FilterSort
                history={this.props.history}
                thingType={this.thingType}
              />
            ) : null}
            <div className="row">
              <div className="col-2 mb-2">
                <button
                  className="btn btn-sm btn-primary"
                  onClick={this.createDefect}
                >
                  New Defect
                </button>
              </div>
            </div>
            <div className="row">
              <div className="col-xl-12">
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
              <div className="col-xl-3">
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
  fsedDefects: PropTypes.arrayOf(PropTypes.object).isRequired,
  allDefectCount: PropTypes.number,
  filterSort: PropTypes.object,
  fetchDefects: PropTypes.func.isRequired,
  deleteDefect: PropTypes.func.isRequired,
  defectsIsLoading: PropTypes.bool,
  defectsError: PropTypes.object,
  pager: PropTypes.object.isRequired,
  queryCount: PropTypes.number.isRequired,
  fetchQueries: PropTypes.func.isRequired,
  queriesIsLoading: PropTypes.bool,
  queriesFetchError: PropTypes.object,
  pageChange: PropTypes.func.isRequired,
  itemsPerPageChange: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  fsedDefects: state.fsedDefects,
  queryCount: state.queries.data.defect.length,
  queriesIsLoading: state.queries.isLoading,
  queriesFetchError: state.queries.error,
  allDefectCount: state.allDefects.length,
  defectsIsLoading: state.defectsStatus.isBusy,
  defectsError: state.defectsError.error,
  pager: state.pager
});

Defects.defaultProps = {
  fsedDefects: [],
  allDefectCount: 0
};

export default connect(
  mapStateToProps,
  { deleteDefect, fetchDefects, fetchQueries, pageChange, itemsPerPageChange }
)(Defects);
