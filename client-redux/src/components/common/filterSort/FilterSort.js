import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import Filter from "./components/Filter";
import Sort from "./components/Sort";
import QuerySelect from "./components/QuerySelect";
import Manual from "./components/Manual";
import ErrorAlert from "../Alerts/ErrorAlert";

class FilterSort extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentQueryId: "",
      filterText: "",
      sortText: ""
    };
    this.clearFilter = this.clearFilter.bind(this);
    this.clearSort = this.clearSort.bind(this);
    this.changeFilter = this.changeFilter.bind(this);
    this.changeSort = this.changeSort.bind(this);
    this.applyFS = this.applyFS.bind(this);
    this.useSelectedQuery = this.useSelectedQuery.bind(this);
    this.onSelectedQueryChange = this.onSelectedQueryChange.bind(this);
    this.editQueries = this.editQueries.bind(this);
    this.toggleManual = this.toggleManual.bind(this); 
  }

  componentDidUpdate(prevProps) {
    console.log("FilterSort componentDidUpdate props", this.props);
  }

  clearFilter() {
    this.setState({ filterText: "", currentQueryId: "" });
  }

  clearSort() {
    this.setState({ sortText: "", currentQueryId: "" });
  }

  changeFilter(e) {
    this.setState({ filterText: e.target.value, currentQueryId: "" });
  }

  changeSort(e) {
    this.setState({ sortText: e.target.value, currentQueryId: "" });
  }

  applyFS() {
    console.log("Todo: galbūt galima fsAction pasiimti tiesiai į FilterSort, o ne kaip props iš Items");
    this.props.fsAction(this.state.filterText, this.state.sortText);
  }

  onSelectedQueryChange(e) {
    const id = e.target.value;
    //console.log("current query id set to ", id);
    this.setState({ currentQueryId: id });
  }

  toggleManual() {
    this.props.toggleFSManual();
  }

  useSelectedQuery() {
    //console.log("queries, state.id", this.props.queries, this.state.currentQueryId);
    if (!this.state.currentQueryId) return;

    const query = this.props.queries.find(
      q => q.id === this.state.currentQueryId
    );

    if (!query) {
      // this must not happen
      console.log(
        "didn't found a selected query by its id",
        this.state.currentQueryId
      );
      return;
    }

    //console.log("found query", query);
    this.setState({
      filterText: query.filter,
      sortText: query.sort
    });
  }

  editQueries() {
    this.props.history.push(`/queries/edit/${this.props.itype}`);
  }

  // saveAsFSQuery() {
  //   this.props.history.push(`/queries/edit/${this.props.itype}`);
  // }

  render() {
    const isValidFS = null;
    // let isValidFS;
    // if (this.props.filterSort.isCurrentValidated) {
    //   isValidFS = this.props.filterSort.error !== true
    // } else {
    //   isValidFS = null;
    // }

    return (
      <div className="row fs-view mb-2">
        <div className="col-7" id="fscontent">
          <div className="row">
            <div className="col-7">
              <Filter
                filterText={this.state.filterText}
                onChange={this.changeFilter}
                clearText={this.clearFilter}
                valid={isValidFS}
              />
            </div>
            <div className="col-5">
              <Sort
                sortText={this.state.sortText}
                onChange={this.changeSort}
                clearText={this.clearSort}
                valid={isValidFS}
              />
            </div>
            {
              this.props.filterSortError &&
              <div className="col-12">
                <ErrorAlert message={this.props.filterSortError.message} />
              </div>
            }
          </div>
          <div className="row">
            <div className="col-12">
              <button
                type="button"
                className="btn btn-sm btn-secondary col-1"
                onClick={this.toggleManual}
              >
                Manual
              </button>
              <button
                type="button"
                className="btn btn-sm btn-info col-11"
                onClick={this.applyFS}
              >
                Apply Filter-Sort
              </button>
            </div>
            {this.props.showFSManual ? (
              <div className="col-12">
                <Manual />
              </div>
            ) : null}
          </div>
        </div>
        <div className="col-3">
          <div className="row">
            <div className="col-12">
              <h5>
                Filter-Sort Queries{" "}
                <button
                  className="btn btn-sm btn-warning"
                  onClick={this.editQueries}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-info"
                  onClick={this.useSelectedQuery}
                >
                  Use
                </button>
              </h5>
              <QuerySelect
                queries={this.props.queries}
                onChange={this.onSelectedQueryChange}
                value={this.state.currentQueryId}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

FilterSort.propTypes = {
  history: PropTypes.object.isRequired,
  filterSortError: PropTypes.object,
  fsAction: PropTypes.func.isRequired,
  queries: PropTypes.arrayOf(PropTypes.object).isRequired,
  toggleFSManual: PropTypes.func.isRequired,
  showFSManual: PropTypes.bool.isRequired,
  itype: PropTypes.string.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  queries: state.queries[ownProps.itype].data
});

FilterSort.defaultProps = {
  queries: []
};

export default connect(mapStateToProps)(FilterSort);
