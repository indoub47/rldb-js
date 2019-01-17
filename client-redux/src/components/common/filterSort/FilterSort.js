import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import Filter from "./components/Filter";
import Sort from "./components/Sort";
import QuerySelect from "./components/QuerySelect";
import Manual from "./components/Manual";
import ErrorAlert from "../ErrorAlert/ErrorAlert";
//import { filterSortDefects } from "../../../actions/defectsActions";
import { createOptions } from "../../createOptions";
import {toggleFSManual} from "../../../actions/showActions";

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

    // in order to avoid recreating options each time new query is selected
    this.querySelectOptions = createOptions(this.props.queries, "Filter-Sort Queries");
  }

  clearFilter() {
    this.setState({ filterText: "", id: "" });
  }

  clearSort() {
    this.setState({ sortText: "", id: "" });
  }

  changeFilter(e) {
    this.setState({ filterText: e.target.value, id: "" });
  }

  changeSort(e) {
    this.setState({ sortText: e.target.value, id: "" });
  }

  applyFS() {
    this.props.fsAction(this.state.filterText, this.state.sortText);
  }

  onSelectedQueryChange(e) {
    const id = e.target.value;
    console.log("current query id set to ", id);
    this.setState({ currentQueryId: id });

  }

  toggleManual() {
    this.props.toggleFSManual(this.props.thingType);
  }

  useSelectedQuery() {
    //console.log("queries, state.id", this.props.queries, this.state.currentQueryId);
    if (!this.state.currentQueryId) return;

    const query = this.props.queries.find(
      q => q.id === this.state.currentQueryId
    );

    if (!query) {
      // this must not happen
      console.log('didn\'t found a selected query by its id', this.state.currentQueryId);
      return;
    }

    //console.log("found query", query);
    this.setState({
      filterText: query.filter,
      sortText: query.sort
    });
  }

  editQueries() {
    this.props.history.push(`/queries/edit/${this.props.thingType}`);
  }

  // saveAsFsQuery() {
  //   this.props.history.push(`/queries/edit/${this.props.thingType}`);
  // }

  render() {
    const isValidFs = null;
    // let isValidFs;
    // if (this.props.filterSort.isCurrentValidated) {
    //   isValidFs = this.props.filterSort.error !== true
    // } else {
    //   isValidFs = null;
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
                valid={isValidFs}
              />
            </div>
            <div className="col-5">
              <Sort
                sortText={this.state.sortText}
                onChange={this.changeSort}
                clearText={this.clearSort}
                valid={isValidFs}
              />
            </div>
            <div className="col-12">
              <ErrorAlert errorObj={this.props.filterSortError} />
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <button type="button" className="btn btn-sm btn-secondary col-1" onClick={this.toggleManual}>
                Manual
              </button>
              <button type="button" className="btn btn-sm btn-info col-11" onClick={this.applyFS}>
                Apply Filter-Sort
              </button>
            </div>
            {this.props.showFsManual ? (
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
                options={this.querySelectOptions}
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
  thingType: PropTypes.string.isRequired,
  filterSortError: PropTypes.object,
  fsAction: PropTypes.func.isRequired,
  queries: PropTypes.arrayOf(PropTypes.object).isRequired,
  toggleFSManual: PropTypes.func.isRequired,
  showFsManual: PropTypes.bool.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  queries: state.queries[ownProps.thingType].data,
  filterSortError: state.filterSort.error,
  showFsManual: state.show.fsManualOn[ownProps.thingType]
});

FilterSort.defaultProps = {
  queries: []
};

export default connect(
  mapStateToProps,
  { toggleFSManual }
)(FilterSort);
