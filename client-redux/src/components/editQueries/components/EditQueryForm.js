import React, { Component } from "react";
import PropTypes from "prop-types";
//import { connect } from "react-redux";
import TextFieldGroup from "../../common/TextFieldGroup";
import TextAreaGroup from "../../common/TextAreaGroup";

class EditQueryForm extends Component {
  constructor(props) {
    super(props);
    this.state = this.props.query ? {
      _id: this.props.query._id || "",
      id: this.props.query.id || "",
      filter: this.props.query.filter || "",
      sort: this.props.query.sort || "",
      name: this.props.query.name || ""
    } : {
      _id: "",
      id: "",
      filter: "",
      sort: "",
      name: ""
    };

    this.onChange = this.onChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  submit(e) {
    e.preventDefault();
    const modifiedQuery = {
      _id: this.state._id,
      id: this.state.id,
      filter: this.state.filter,
      sort: this.state.sort,
      name: this.state.name
    };
    
    this.props.submitQuery(modifiedQuery);
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  render() {
    return (
      <div className="row pt-3 mb-2 border border-primary">
        <div className="col-12">
          <form className="">
            <div className="form-group row">
              <TextAreaGroup
                divClassname="form-group col-7"
                id="filter"
                name="filter"
                rows="4"
                readonly={true}
                placeholder="Filter"
                value={this.state.filter}
              />
              <TextAreaGroup
                divClassname="form-group col-5"
                id="sort"
                name="sort"
                rows="4"
                readonly={true}
                placeholder="Sort"
                value={this.state.sort}
              />
            </div>
            <div className="form-group row">
              <TextFieldGroup
                divClassname="form-group col-7"
                name="name"
                id="name"
                placeholder="Name"
                value={this.state.name}
                onChange={this.onChange}
              />
              <div className="form-group col-2">
                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={this.submit}
                >
                  Submit Query Name
                </button>
              </div>
              <TextFieldGroup
                divClassname="form-group col-3"
                name="id"
                id="id"
                placeholder="ID"
                readonly={true}
                value={this.state.id}
              />
            </div>
          </form>
        </div>
      </div>
    );
  }
}

EditQueryForm.propTypes = {
  query: PropTypes.object,
  submitQuery: PropTypes.func.isRequired
};

export default EditQueryForm;
