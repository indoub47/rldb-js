import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import EditQueryForm from './components/EditQueryForm';
import QueryList from './components/QueryList';
import ErrorAlert from '../common/ErrorAlert';
import IsLoading from '../common/IsLoading';
import {updateQueries} from "../../actions/queriesActions";
import getId from '../../utils/getId';

class EditQueries extends Component {
  constructor(props) {
    super(props);
    this.state = {
      queries: [],
      currentQuery: null,
      isBusy: false,
      queryNameErrorMsg: '',
      queriesUpdateError: null
    }

    this.submitQueries = this.submitQueries.bind(this);
    this.submitQuery = this.submitQuery.bind(this);
    this.setForEditing = this.setForEditing.bind(this);
    this.remove = this.remove.bind(this);
    this.moveUp = this.moveUp.bind(this);
    this.moveDown = this.moveDown.bind(this);
  }

  componentDidMount() {
    let query = this.props.queries.find(q => 
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
      this.setState({currentQuery: query});
    }
  }

  submitQuery(draft) {
    console.log("queries", this.state.queries);
    console.log("draft", draft);
    // validate query
    // name must be not empty
    if (draft.name.trim() === '') {
      this.setState({queryNameErrorMsg: "Name must be not empty"});
      return;
    }

    // ...and must be unique
    const sameNameQuery = this.state.queries.find(q => q.name.trim() === draft.name.trim());
    if (sameNameQuery) {
      this.setState({queryNameErrorMsg: `Same name as ${sameNameQuery.id}; The name must be unique`});
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
      modifiedQueries = [
        ...this.state.queries,
        draft
      ];
    }

    this.setState({
      queryNameErrorMsg: '', 
      queries: modifiedQueries, 
      currentQuery: draft
    });
  }

  submitQueries() {
    console.log("props.match", this.props.match);
    this.props.updateQueries(
      this.state.queries,
      this.props.match.params.thingType
    );
  }

  render() {
    if (this.state.isBusy) {
      return <IsLoading />
    }

    return (      
      <div className="container thing-edit">
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
        {this.state.error && <ErrorAlert errorObj={this.state.error} />}
        <button 
          className="btn btn-primary btn-lg"
          onClick={this.submitQueries}>
          Submit Changes
        </button>
      </div>
    );
  }

}

EditQueries.propTypes = {
  updateQueries: PropTypes.func.isRequired,
  queries: PropTypes.arrayOf(PropTypes.object),
  currentQuery: PropTypes.object,
  filterSort: PropTypes.object,
  queryNameError: PropTypes.object,
  queriesUpdateError: PropTypes.object,
}

const mapStateToProps = (state, ownProps) => ({
  queries: state.queries.data[ownProps.match.params.thingType],
  filterSort: state.filterSort 
});

export default connect(mapStateToProps, {updateQueries})(EditQueries);