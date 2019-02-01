import React from 'react';
import PropTypes from 'prop-types';
import TextFieldGroup from '../../common/TextFieldGroup';
import SelectInputGroup from '../../common/SelectInputGroup';
import {createOptions} from '../../createOptions';
import absent from '../../../utils/absent-props';

const MainDataForm = ({defect, onChange, things}) => {
  
  // select controls options
  // galbūt reikėtų iškelti prieš funciją, kad nekurtų kaskart kai renderina
  //console.log("things", things);
  const meistrijOptions = createOptions(things.meistrij, "Meistrija", x => x.abbr + ", " + x.name);
  const kkategOptions = createOptions(things.kkateg, "Kelio kategorija", x => x.id);
  const btipasOptions = createOptions(things.btipas, "Bėgio tipas", x => x.id);
  const bgamyklOptions = createOptions(things.bgamykl, "Bėgio gamykla", x => x.id);
  const siuleOptions = createOptions(things.siule, "Siūlė", x => x.id);

  return (     
    <div className="container defect-info border border-primary text-center">
      <div className="form-group row main-data text-center">
        <TextFieldGroup 
          divClassname="form-group"
          label="Regionas"
          id="defect-region"
          name="region"
          placeholder="Regionas"
          readonly={true}
          value={absent(defect.region)}
          onChange={onChange}
        />
        <TextFieldGroup 
          divClassname="form-group"
          label="ID"
          id="defect-id"
          name="id"
          placeholder="Defekto ID"
          readonly={true}
          value={absent(defect.id)}
          onChange={onChange}
        />
        <TextFieldGroup 
          divClassname="form-group"
          label="ID1"
          id="defect-id1"
          name="id1"
          placeholder="Defekto ID1"
          readonly={true}
          value={absent(defect.id1)}
          onChange={onChange}
        />
        <SelectInputGroup
          id="defect-meistrij"
          name="meistrij"
          label="Meistrija"
          divClassname="form-group col-4"
          value={absent(defect.meistrija)}
          options={meistrijOptions}
          onChange={onChange}
        />
        <SelectInputGroup
          id="defect-kkateg"
          name="kkateg"
          label="Kelio kategorija"
          divClassname="form-group col-4"
          value={absent(defect.kkateg)}
          options={kkategOptions}
          onChange={onChange}
        />
      </div>

      <div className="form-group row begis text-center">
        <SelectInputGroup
          id="defect-btipas"
          name="btipas"
          label="Bėgio tipas"
          value={absent(defect.btipas)}
          options={btipasOptions}
          onChange={onChange}
        />
        <SelectInputGroup
          id="defect-bgamykla"
          name="bgamykla"
          label="Bėgio gamykla"
          value={absent(defect.bgamykla)}
          options={bgamyklOptions}
          onChange={onChange}
        />
        <TextFieldGroup 
          divClassname="form-group"
          label="Bėgio gam. metai"
          id="defect-bmetai"
          name="bmetai"
          placeholder="Bėgio gam. metai"
          value={absent(defect.bmetai) + ""}
          onChange={onChange}
        />
      </div>

      <div className="form-group row vieta text-center">        
        <TextFieldGroup
          label="Linija"
          id="defect-linija"
          name="linija"
          placeholder="Linija"
          value={absent(defect.linija)}
          onChange={onChange}
        />        
        <TextFieldGroup 
          label="Kelias"
          id="defect-kelias"
          name="kelias"
          placeholder="Kelio Nr."
          value={absent(defect.kelias)}
          onChange={onChange}
        />        
        <TextFieldGroup 
          label="km"
          id="defect-km"
          name="km"
          placeholder="km"
          value={absent(defect.km) + ''}
          onChange={onChange}
        />        
        <TextFieldGroup 
          label="pk"
          id="defect-pk"
          name="pk"
          placeholder="pk"
          value={absent(defect.pk) + ''}
          onChange={onChange}
        />        
        <TextFieldGroup 
          label="m"
          id="defect-m"
          name="m"
          placeholder="m"
          value={absent(defect.m) + ''}
          onChange={onChange}
        />
        <SelectInputGroup
          id="defect-siule"
          name="siule"
          label="Siūlė"
          value={absent(defect.siule)}
          options={siuleOptions}
          onChange={onChange}
        />
      </div>

      <div className="form-group row charakteristikos text-center">                  
        <TextFieldGroup 
          label="Kodas"
          id="defect-kodas"
          name="kodas"
          placeholder="Kodas"
          value={absent(defect.kodas)}
          onChange={onChange}
        />                 
        <TextFieldGroup 
          label="L"
          id="defect-dl"
          name="dl"
          placeholder="L"
          value={absent(defect.dl) + ''}
          onChange={onChange}
        />                 
        <TextFieldGroup 
          label="H"
          id="defect-dh"
          name="dh"
          placeholder="H"
          value={absent(defect.dh) + ''}
          onChange={onChange}
        />                 
        <TextFieldGroup 
          label="Pavojingumas"
          id="defect-pavoj"
          name="pavoj"
          placeholder="Pavojingumas"
          value={absent(defect.pavoj)}
          onChange={onChange}
        />
      </div>  

      <div className="form-group row aptiko text-center">                  
        <TextFieldGroup 
          label="Operatorius"
          id="defect-oper"
          name="oper"
          placeholder="Operatoriaus kodas"
          value={absent(defect.oper)}
          onChange={onChange}
        />                 
        <TextFieldGroup 
          label="Defektoskopas"
          id="defect-apar"
          name="apar"
          placeholder="Defektoskopo kodas"
          value={absent(defect.apar)}
          onChange={onChange}
        /> 
      </div>  

      <div className="form-group row datos text-center">                  
        <TextFieldGroup 
          label="Aptikimo data"
          type="date"
          id="defect-daptik"
          name="daptik"
          placeholder="Aptikimo data"
          value={absent(defect.daptik)}
          onChange={onChange}
        />                  
        <TextFieldGroup 
          label="Pašalinimo terminas"
          type="date"
          id="defect-dtermin"
          name="dtermin"
          placeholder="Terminas"
          value={absent(defect.dtermin)}
          onChange={onChange}
        />                                  
        <TextFieldGroup 
          label="Tvarsliavimo data"
          type="date"
          id="defect-dtvarsl"
          name="dtvarsl"
          placeholder="Tvarsliavimo data"
          value={absent(defect.dtvarsl)}
          onChange={onChange}
        />                                  
        <TextFieldGroup 
          label="Panaikinimo data"
          type="date"
          id="defect-dpanaik"
          name="panaikinta"
          placeholder="Panaikinimo data"
          value={absent(defect.panaikinta)}
          onChange={onChange}
        />  
      </div>               
    </div>
  );
}

MainDataForm.propTypes = {
  defect: PropTypes.object,
  onChange: PropTypes.func.isRequired
};



export default MainDataForm;