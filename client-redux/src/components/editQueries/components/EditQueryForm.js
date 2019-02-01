import React, { Component } from "react";
import PropTypes from "prop-types";
//import { connect } from "react-redux";
import TextFieldGroup from "../../common/TextFieldGroup";
import TextAreaGroup from "../../common/TextAreaGroup";
import validateFSQuery from "../../../validation/fsQuery";

class EditQueryForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      filter: "",
      sort: "",
      name: "",
      errors: null
    };

    this.onChange = this.onChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.query !== prevProps.query) {
      this.setState({
        id: this.props.query.id || "",
        filter: this.props.query.filter || "",
        sort: this.props.query.sort || "",
        name: this.props.query.name || ""
      });
    }
  }

  submit(e) {
    e.preventDefault();
    const modifiedQuery = {
      id: this.state.id,
      filter: this.state.filter,
      sort: this.state.sort,
      name: this.state.name
    };
    const validation = validateFSQuery(modifiedQuery);
    if (validation.isValid) {
      this.props.submitQuery(modifiedQuery);
    } else {
      this.setState({ errors: validation.errors });
    }
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
                //classname="form-control-plaintext"
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
                //label="Name"
                value={this.state.name}
                onChange={this.onChange}
                error={this.props.nameErrorMsg}
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
                //label="ID"
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
  submitQuery: PropTypes.func.isRequired,
  nameErrorMsg: PropTypes.string
};

//export default connect()(EditQueryForm);

export default EditQueryForm;
