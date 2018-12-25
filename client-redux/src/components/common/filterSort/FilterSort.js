import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import Filter from "./components/Filter";
import Sort from "./components/Sort";
import QuerySelect from "./components/QuerySelect";
import ErrorAlert from "../ErrorAlert";
import { filterSortDefects } from "../../../actions/defectsActions";
import {createOptions} from '../../createOptions';

class FilterSort extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentQueryId: '',
      filterText: '',
      sortText: ''
    }
    this.clearFilter = this.clearFilter.bind(this);
    this.clearSort = this.clearSort.bind(this);
    this.changeFilter = this.changeFilter.bind(this);
    this.changeSort = this.changeSort.bind(this);
    this.applyFS = this.applyFS.bind(this);
    this.useSelectedQuery = this.useSelectedQuery.bind(this);
    this.onSelectedQueryChange = this.onSelectedQueryChange.bind(this);
    this.editQueries = this.editQueries.bind(this);
    
    // in order to avoid recreating options each time new query is selected
    this.querySelectOptions = createOptions(this.props.queries);
  }

  clearFilter() {
    this.setState({filterText: '', id: ''});
  }

  clearSort() {
    this.setState({sortText: '', id: ''});
  }

  changeFilter(e) {
    this.setState({filterText: e.target.value, id: ''});
  }

  changeSort(e) {
    this.setState({sortText: e.target.value, id: ''});
  }

  applyFS() {
    this.props.filterSortDefects(this.state.filterText, this.state.sortText);
  }

  onSelectedQueryChange(e) {
    const id = e.target.value;
    this.setState({currentQueryId: id});
  }

  useSelectedQuery() {
    //console.log("queries, state.id", this.props.queries, this.state.currentQueryId);
    const query = this.props.queries.find(q => q.id === this.state.currentQueryId);
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
              <button
                className="btn btn-block btn-info"
                onClick={this.applyFS}
              >
                Apply Filter-Sort
              </button>
            </div>
            {/*<div className="col-3">
              <button
                className="btn btn-block btn-warning"
                onClick={this.saveAsFsQuery}
              >
                Save as Query
              </button>
            </div>*/}
          </div>
        </div>
        <div className="col-3">
          <div className="row">
            <div className="col-12">              
              <h5>
                Filter-Sort Queries <button 
                  className="btn btn-sm btn-warning"
                  onClick={this.editQueries}
                >Edit</button>
              </h5>
              <QuerySelect
                options={this.querySelectOptions}
                onChange={this.onSelectedQueryChange}
                value={this.state.currentQueryId}
              /> 
              <button 
                className="btn btn-sm btn-info" 
                onClick={this.useSelectedQuery}
              >Use</button>
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
  filterSortDefects: PropTypes.func.isRequired,
  queries: PropTypes.arrayOf(PropTypes.object).isRequired
};

const mapStateToProps = (state, ownProps) => ({
  queries: state.queries.data[ownProps.thingType],
  filterSortError: state.filterSort.error
});

FilterSort.defaultProps = {
  queries: []
}

export default connect(
  mapStateToProps,
  { filterSortDefects }
)(FilterSort);
