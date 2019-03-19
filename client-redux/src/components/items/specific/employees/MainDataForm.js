import React from 'react';
import PropTypes from 'prop-types';
import TextFieldGroup from '../../../common/TextFieldGroup';
// import SelectInputGroup from '../../../common/SelectInputGroup';
// import {createOptions} from '../../../createOptions';
import absent from '../../../../utils/absent-props';

const MainDataForm = ({item, onChange, things}) => {
  
  // select controls options
  // galbūt reikėtų iškelti prieš funciją, kad nekurtų kaskart kai renderina
  //console.log("things", things);
  // NOTHING SO FAR

  return (     
    <div className="container item-info border border-primary text-center">
      <div className="form-group row main-data text-center">
        <TextFieldGroup 
          divClassname="form-group"
          label="Regionas"
          id="item-region"
          name="region"
          placeholder="Regionas"
          readonly={true}
          value={absent(item.region)}
          onChange={onChange}
        />
        <TextFieldGroup 
          divClassname="form-group"
          label="ID"
          id="item-id"
          name="id"
          placeholder="Defekto ID"
          readonly={true}
          value={absent(item.id)}
          onChange={onChange}
        />
        <TextFieldGroup 
          divClassname="form-group"
          label="Vardas"
          id="item-name"
          name="name"
          placeholder="Vardas"
          value={absent(item.name)}
          onChange={onChange}
        />
        <TextFieldGroup 
          divClassname="form-group"
          label="Atestacija iki"
          id="item-atest"
          name="atest"
          placeholder="Atestacija iki"
          value={absent(item.atest)}
          onChange={onChange}
        />
        <div className="form-group">
          <div className="checkbox">
            <label>
              <input 
                type="checkbox" 
                id="item-active"
                name="active"
                value={absent(item.active)}
                onChange={onChange} 
              />
              Active
            </label>
          </div>
        </div>
      </div>               
    </div>
  );
}

MainDataForm.propTypes = {
  item: PropTypes.object,
  onChange: PropTypes.func.isRequired
};



export {MainDataForm};