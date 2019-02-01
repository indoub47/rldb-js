import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import EditQueryForm from "./components/EditQueryForm";
import QueryList from "./components/QueryList";
import ErrorAlert from "../common/Alerts/ErrorAlert";
import IsLoading from "../common/IsLoading";
import { updateQueries } from "../../actions/queriesActions";
import getId from "../../utils/getId";

class EditQueries extends Component {
  constructor(props) {
    super(props);
    this.state = {
      queries: [],
      currentQuery: null,
      queryNameErrorMsg: ""
    };

    this.submitQueries = this.submitQueries.bind(this);
    this.submitQuery = this.submitQuery.bind(this);
    this.setForEditing = this.setForEditing.bind(this);
    this.remove = this.remove.bind(this);
    this.moveUp = this.moveUp.bind(this);
    this.moveDown = this.moveDown.bind(this);
  }

  componentDidMount() {
    let query = this.props.queries.find(
      q =>
        q.filter === this.props.filterSort.filterText &&
        q.sort === this.props.filterSort.sortText
    );

    if (!query) {
      query = {
        filter: this.props.filterSort.filterText,
        sort: this.props.filterSort.sortText
      };
    }

    this.setState({
      queries: this.props.queries,
      currentQuery: query
    });
  }

  moveUp(e) {
    const id = e.target.dataset.id;
    const ind = this.state.queries.findIndex(q => q.id === id);
    if (ind <= 0) return;
    // reikia mažinti indexą
    const modifiedQueries = [
      ...this.state.queries.slice(0, ind - 1),
      this.state.queries[ind],
      this.state.queries[ind - 1],
      ...this.state.queries.slice(ind + 1)
    ];
    this.setState({
      queries: modifiedQueries
    });
  }

  moveDown(e) {
    const id = e.target.dataset.id;
    const ind = this.state.queries.findIndex(q => q.id === id);
    if (ind < 0 || ind === this.state.queries.length - 1) return;
    // reikia didinti indexą
    const modifiedQueries = [
      ...this.state.queries.slice(0, ind),
      this.state.queries[ind + 1],
      this.state.queries[ind],
      ...this.state.queries.slice(ind + 2)
    ];
    this.setState({
      queries: modifiedQueries
    });
  }

  remove(e) {
    const id = e.target.dataset.id;
    const ind = this.state.queries.findIndex(q => q.id === id);
    if (ind < 0) return;
    const modifiedQueries = [
      ...this.state.queries.slice(0, ind),
      ...this.state.queries.slice(ind + 1)
    ];
    this.setState({
      queries: modifiedQueries
    });
  }

  setForEditing(e) {
    const id = e.target.dataset.id;
    const query = this.state.queries.find(q => q.id === id);
    if (query) {
      this.setState({ currentQuery: query });
    }
  }

  submitQuery(draft) {
    // validate query
    // name must be not empty
    if (draft.name.trim() === "") {
      this.setState({ queryNameErrorMsg: "Name must be not empty" });
      return;
    }

    // ...and must be unique
    const sameNameQuery = this.state.queries.find(
      q => q.name.trim() === draft.name.trim()
    );
    if (sameNameQuery) {
      this.setState({
        queryNameErrorMsg: `Same name as ${
          sameNameQuery.id
        }; The name must be unique`
      });
      return;
    }

    let modifiedQueries;
    if (draft.id) {
      const ind = this.state.queries.findIndex(q => q.id === draft.id);
      if (ind < 0) return;
      modifiedQueries = [
        ...this.state.queries.slice(0, ind),
        draft,
        ...this.state.queries.slice(ind + 1)
      ];
    } else {
      draft.id = getId();
      modifiedQueries = [...this.state.queries, draft];
    }

    this.setState({
      queryNameErrorMsg: "",
      queries: modifiedQueries,
      currentQuery: draft
    });
  }

  submitQueries() {
    this.props.updateQueries(
      this.state.queries,
      this.props.match.params.thingType
    );
  }

  render() {
    return (
      <div className="container thing-edit">
        {this.props.queriesUpdateError ? (
          <ErrorAlert message={this.props.queriesUpdateError.message} />
        ) : null}
        <IsLoading when={this.props.queriesIsLoading} />
        <QueryList
          queries={this.state.queries}
          remove={this.remove}
          setItemForEditing={this.setForEditing}
          moveUp={this.moveUp}
          moveDown={this.moveDown}
        />
        <EditQueryForm
          query={this.state.currentQuery}
          submitQuery={this.submitQuery}
          nameErrorMsg={this.state.queryNameErrorMsg}
        />
        {/*{this.props.error && <ErrorAlert message={this.props.error.message} />}*/}
        <button className="btn btn-primary btn-lg" onClick={this.submitQueries}>
          Submit Changes
        </button>
      </div>
    );
  }
}

EditQueries.propTypes = {
  queries: PropTypes.arrayOf(PropTypes.object),
  queriesUpdateError: PropTypes.object,
  queriesIsLoading: PropTypes.bool,
  currentQuery: PropTypes.object,
  filterSort: PropTypes.object,
  updateQueries: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => {
  const thingType = ownProps.match.params.thingType;
  const stateQueries = state.queries[thingType];  
  let stateFilterSort;
  switch(thingType) {
    case "defect":
      stateFilterSort = state.defectsFS;
      break;
    case "welding":
      stateFilterSort = state.weldingsFS;
      break;
    default: throw(Error(`bad thingType argument ${thingType} for EditQueries`));
  }
  return {
    queries: stateQueries.data,
    queriesIsLoading: stateQueries.isLoading,
    queriesUpdateError: stateQueries.error,
    filterSort: stateFilterSort
  };
};

export default connect(
  mapStateToProps,
  { updateQueries }
)(EditQueries);
