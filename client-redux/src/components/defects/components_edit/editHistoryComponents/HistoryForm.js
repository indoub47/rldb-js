import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import TextFieldGroup from '../../../common/TextFieldGroup';
import SelectInputGroup from '../../../common/SelectInputGroup';
import TextAreaGroup from '../../../common/TextAreaGroup';
import validateDefectHistory from '../../../../validation/defectHistory';
import {createOptions} from '../../../createOptions';
import {emptyHistoryItem} from './emptyHistoryItem';
import ErrorAlert from '../../../common/ErrorAlert/ErrorAlert';

class HistoryForm extends Component {
  constructor(props) {    
    super(props);    
    this.state = {
      item: emptyHistoryItem,
      doneByNB: true,        
      errors: null      
    }

    this.nbActionOptions = createOptions(this.props.actions.filter(x => x.nb), "Veiksmas");
    this.nonNbActionOptions = createOptions(this.props.actions.filter(x => !x.nb), "Veiksmas");
    this.operatOptions = createOptions(this.props.operats, "Operatorius");
    this.defskopOptions = createOptions(this.props.defskops, "Defektoskopas", x => (x.id + ", " + x.model.toUpperCase()));
    this.pavojOptions = createOptions(this.props.pavojs, "Pavojingumas", x => x.id);

    this.onChange = this.onChange.bind(this);
    this.onChangeActor = this.onChangeActor.bind(this);
    this.submit = this.submit.bind(this);
  }

  componentDidUpdate(prevProps) {
    // atnaujina state tik tada, kai EditHistory siunčia
    // naują item. Tas vyksta po submit, po empty arba po setForEditing
    // console.log("HistoryForm.componentDidUpdate props.actions, props.item", this.props.actions, this.props.item);

    // po submit, empty arba setForEditing pareina naujas historyItem.
    // jis turi action arba neturi. Nustatoma doneByNB reikšmė. Default yra true
    const doneByNB = this.props.item && this.props.item.action ? 
      this.props.actions.find(
        a => a.id === this.props.item.action
      ).nb 
      : 
      true;  

      //console.log("HistoryForm.componentDidUpdate doneByNB", doneByNB);


    if (this.props.item !== prevProps.item) {
      this.setState({
        item: this.props.item, 
        errors: null,
        doneByNB
      });
    }
  }

  submit(e) {
    e.preventDefault();
    const validation = validateDefectHistory(this.state.item);
    if (validation.isValid) {
      this.props.submit(this.state.item);            
    } else {
      this.setState({errors: validation.errors});
    }
  }

  onChangeActor(e) {
    // Kai pasirenkamas aktorius ne NB, turi išsitrinti visi 
    // item duomenys iš state, išskyrus id. 
    // Frankly, čia toks kosminis atvejis, kai
    // operatoriaus veiksmą reikės perrašyti
    // ne operatoriaus veiksmu. Bet tai chuliš, negi gaila
    this.setState({
      doneByNB: e.target.checked, 
      item: {...emptyHistoryItem, id: this.state.item.id}, 
      errors: null
    });
  }

  onChange(e) {
    this.setState({
      item: {
        ...this.state.item,
        [e.target.name]: e.target.value
      }
    });
  }


  render() {
    return (
      <div className="container defect-history-edit border border-primary">
        <div className="row">
          <div className="col-12">
            <form className="form defect-history-form p-xl-3">
              <div className="form-group row">
                <div className="form-check col-8">
                  <input 
                    type="checkbox" 
                    className="form-check-input" 
                    id="whichActionCheck"
                    checked={this.state.doneByNB}
                    onChange={this.onChangeActor}
                  />
                  <label className="form-check-label" htmlFor="whichActionCheck">Atliko NB</label>
                </div>
                <div className="form-group form-inline col-4">
                  <label htmlFor="id" className="control-label">ID</label>
                  <input 
                    className="form-control ml-sm-2" 
                    type="text" 
                    name="id" id="id" 
                    placeholder="ID" 
                    readOnly="readOnly"
                    value={this.state.item.id} 
                  />
                </div>
              </div>
              <div className="form-group row">
                <TextFieldGroup
                  divClassname="form-group col-4"
                  type="date"
                  name="data"
                  value={this.state.item.data}
                  onChange={this.onChange}
                  error={this.state.errors && this.state.errors.data}
                />
                <SelectInputGroup
                  name="action"
                  size="1"
                  divClassname="form-group col-4"
                  value={this.state.item.action}
                  onChange={this.onChange}
                  error={this.state.errors && this.state.errors.action}
                  options={this.state.doneByNB ? this.nbActionOptions : this.nonNbActionOptions}
                />
              </div>
              <div className="row nb-action-data border border-secondary p-xl-2 mb-xl-2">
                <div className="col-12">
                  <div className="form-group row">                
                    <SelectInputGroup
                      name="oper"
                      size="1"
                      divClassname="form-group col-6"
                      value={this.state.item.oper}
                      onChange={this.onChange}
                      error={this.state.errors && this.state.errors.oper}
                      options={this.operatOptions}
                      disabled={this.state.doneByNB ? null : "disabled"}
                    />                
                    <SelectInputGroup
                      name="apar"
                      size="1"
                      divClassname="form-group col-6"
                      value={this.state.item.apar}
                      onChange={this.onChange}
                      error={this.state.errors && this.state.errors.apar}
                      options={this.defskopOptions}
                      disabled={this.state.doneByNB ? null : "disabled"}
                    />
                  </div>
                  <div className="form-group row">
                    <TextFieldGroup
                      divClassname="form-group col-2"
                      name="dl" 
                      placeholder="L"
                      info="Sąlyginis ilgis L"
                      value={(this.state.item.dl && this.state.item.dl + '') || ''}
                      onChange={this.onChange}
                      disabled={this.state.doneByNB ? null : "disabled"}
                      error={this.state.errors && this.state.errors.dl}
                    />
                    <TextFieldGroup
                      divClassname="form-group col-2"
                      name="dh" 
                      placeholder="H"
                      info="Sąlyginis aukštis H"
                      value={(this.state.item.dh && this.state.item.dh + '') || ''}
                      onChange={this.onChange}
                      disabled={this.state.doneByNB ? null : "disabled"}
                      error={this.state.errors && this.state.errors.dh}
                    />
                    <TextFieldGroup
                      divClassname="form-group col-2"
                      name="kodas" 
                      placeholder="Kodas"
                      info="Defekto kodas"
                      value={this.state.item.kodas}
                      onChange={this.onChange}
                      disabled={this.state.doneByNB ? null : "disabled"}
                      error={this.state.errors && this.state.errors.kodas}
                    />                
                    <SelectInputGroup
                      name="pavoj"
                      size="1"
                      divClassname="form-group col-2"
                      value={this.state.item.pavoj}
                      onChange={this.onChange}
                      error={this.state.errors && this.state.errors.pavoj}
                      options={this.pavojOptions}
                      disabled={this.state.doneByNB ? null : "disabled"}
                    />
                    <TextFieldGroup
                      divClassname="form-group col-4"
                      type="date"
                      name="termin"
                      info="Pašalinti iki datos"
                      value={this.state.item.termin || ''}
                      onChange={this.onChange}
                      error={this.state.errors && this.state.errors.termin}
                      disabled={this.state.doneByNB ? null : "disabled"}
                    />
                  </div>
                </div>
              </div>
              <TextAreaGroup
                divClassname="form-group row"
                name="pastaba"
                rows="2" 
                placeholder="Pastaba"
                value={this.state.item.pastaba}
                onChange={this.onChange}
                error={this.state.errors && this.state.errors.pastaba}
                info="Neilgas tekstukas, iki 300 simbolių"
              />
              {this.props.hiSubmitError ? 
                <div className="form-group row">
                  <ErrorAlert errorObj={this.props.hiSubmitError} />
                </div> 
                : null
              }
              <div className="form-group row">
                <button type="button" className="btn btn-light" onClick={this.props.empty}>
                  Clear
                </button>
                <button type="submit" className="btn btn-primary" onClick={this.submit}>
                  Submit This Record
                </button>
              </div>
            </form> 
          </div>
        </div>
      </div> 
    );
  }
}

HistoryForm.propTypes = {
  item: PropTypes.object,
  submit: PropTypes.func.isRequired,
  empty: PropTypes.func.isRequired,
  actions: PropTypes.arrayOf(PropTypes.object).isRequired,
  operats: PropTypes.arrayOf(PropTypes.object).isRequired,
  defskops: PropTypes.arrayOf(PropTypes.object).isRequired,
  pavojs: PropTypes.arrayOf(PropTypes.object).isRequired,
  hiSubmitError: PropTypes.object
}

const mapStateToProps = state => ({
  actions: state.things.data.action,
  operats: state.things.data.operat,
  defskops: state.things.data.defskop,
  pavojs: state.things.data.pavoj
});

export default connect(
  mapStateToProps,
)(HistoryForm);