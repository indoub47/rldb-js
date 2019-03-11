import React, {Component} from 'react';
import {createReport} from "../../../actions/reportActions";
import connect from "redux";
import TextFieldGroup from "../../components/common/TextFieldGroup";

export class DUParamsCollector extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      byDate: null,
      whichDefects: 'active', // 'overdued', 'both'
      meistrijos: []
    };
    this.submitParams = this.submitParams.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e){
    const name = e.target.name;
    const value = e.target.value;
    this.setState({[name]: value});
  }

  submitParams() {
    this.props.createReport(this.state);
  }

  render() {
    return (
      <form>
        <TextFieldGroup
          type="date"
          id="bydate"
          label="Datai"
          name="byDate"
          value = {this.state.byDate}
          onChange={this.onChange}
        />
        <div className="form-group wichDefects">
          <div className="form-check form-check-inline">
            <input 
              className="form-check-input" 
              name="whichDefects" 
              type="checkbox" 
              id="radio-both" 
              value="both" 
              onChange={this.onChange}
            />
            <label 
              className="form-check-label" 
              for="radio-both"
            >Kelyje/pradelsti</label>
          </div>
          <div className="form-check form-check-inline">
            <input 
              className="form-check-input" 
              name="whichDefects" 
              type="checkbox" 
              id="radio-active" 
              value="active" 
              onChange={this.onChange}
            />
            <label 
              className="form-check-label" 
              for="radio-active"  
              checked={true}
            >Kelyje</label>
          </div>
          <div className="form-check form-check-inline">
            <input 
              className="form-check-input" 
              name="whichDefects" 
              type="checkbox" 
              id="radio-overdued" 
              value="overdued" 
              onChange={this.onChange}
            />
            <label 
              className="form-check-label" 
              for="radio-overdued"
            >Pradelsti</label>
          </div>
        </div>
        <div class="form-group">
          <label for="selectMeistrijos">Meistrijos</label>
          <select 
            multiple={true} 
            className="form-control" 
            name="meistrijos"
            id="selectMeistrijos"
            size={this.props.meistrijos.length < 5 ? this.props.meistrijos.length : "5"}
          >
            {this.props.meistrijos.map(m => 
                <option value={m.id} key={m.id} selected={true}>{m.abbr}</option>
              );
            }
          </select>
        </div>
        <div className="form-group">
          <input type="button" className="btn" onClick={this.submitParams}>Submit</input>
        </div>
      </form>
    );
  }
}

const mapStateToProps = (state) => ({
  meistrijos: state.things.data.meistrija;
});

export default connect(
  mapStateToProps,
  {createReport}
)(DUParamsCollector);