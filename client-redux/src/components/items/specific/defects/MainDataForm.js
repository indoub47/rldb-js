import React from 'react';
import PropTypes from 'prop-types';
import TextFieldGroup from '../../../common/TextFieldGroup';
import SelectInputGroup from '../../../common/SelectInputGroup';
import {createOptions} from '../../../createOptions';
import absent from '../../../../utils/absent-props';

const MainDataForm = ({item, onChange, things}) => {
  
  // select controls options
  // galbūt reikėtų iškelti prieš funciją, kad nekurtų kaskart kai renderina
  //console.log("things", things);
  const meistrijaOptions = createOptions(things.meistrija, "Meistrija", x => x.abbr + ", " + x.name);
  const kkategOptions = createOptions(things.kkateg, "Kelio kategorija", x => x.id);
  const btipasOptions = createOptions(things.btipas, "Bėgio tipas", x => x.id);
  const bgamyklOptions = createOptions(things.bgamykl, "Bėgio gamykla", x => x.id);
  const siuleOptions = createOptions(things.siule, "Siūlė", x => x.id);

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
          label="ID1"
          id="item-id1"
          name="id1"
          placeholder="Defekto ID1"
          readonly={true}
          value={absent(item.id1)}
          onChange={onChange}
        />
        <SelectInputGroup
          id="item-meistrija"
          name="meistrija"
          label="Meistrija"
          divClassname="form-group col-4"
          value={absent(item.meistrija)}
          options={meistrijaOptions}
          onChange={onChange}
        />
        <SelectInputGroup
          id="item-kkateg"
          name="kkateg"
          label="Kelio kategorija"
          divClassname="form-group col-4"
          value={absent(item.kkateg)}
          options={kkategOptions}
          onChange={onChange}
        />
      </div>

      <div className="form-group row begis text-center">
        <SelectInputGroup
          id="item-btipas"
          name="btipas"
          label="Bėgio tipas"
          value={absent(item.btipas)}
          options={btipasOptions}
          onChange={onChange}
        />
        <SelectInputGroup
          id="item-bgamykla"
          name="bgamykla"
          label="Bėgio gamykla"
          value={absent(item.bgamykla)}
          options={bgamyklOptions}
          onChange={onChange}
        />
        <TextFieldGroup 
          divClassname="form-group"
          label="Bėgio gam. metai"
          id="item-bmetai"
          name="bmetai"
          placeholder="Bėgio gam. metai"
          value={absent(item.bmetai) + ""}
          onChange={onChange}
        />
      </div>

      <div className="form-group row vieta text-center">        
        <TextFieldGroup
          label="Linija"
          id="item-linija"
          name="linija"
          placeholder="Linija"
          value={absent(item.linija)}
          onChange={onChange}
        />        
        <TextFieldGroup 
          label="Kelias"
          id="item-kelias"
          name="kelias"
          placeholder="Kelio Nr."
          value={absent(item.kelias)}
          onChange={onChange}
        />        
        <TextFieldGroup 
          label="km"
          id="item-km"
          name="km"
          placeholder="km"
          value={absent(item.km) + ''}
          onChange={onChange}
        />        
        <TextFieldGroup 
          label="pk"
          id="item-pk"
          name="pk"
          placeholder="pk"
          value={absent(item.pk) + ''}
          onChange={onChange}
        />        
        <TextFieldGroup 
          label="m"
          id="item-m"
          name="m"
          placeholder="m"
          value={absent(item.m) + ''}
          onChange={onChange}
        />
        <SelectInputGroup
          id="item-siule"
          name="siule"
          label="Siūlė"
          value={absent(item.siule)}
          options={siuleOptions}
          onChange={onChange}
        />
      </div>

      <div className="form-group row charakteristikos text-center">                  
        <TextFieldGroup 
          label="Kodas"
          id="item-kodas"
          name="kodas"
          placeholder="Kodas"
          value={absent(item.kodas)}
          onChange={onChange}
        />                 
        <TextFieldGroup 
          label="L"
          id="item-dl"
          name="dl"
          placeholder="L"
          value={absent(item.dl) + ''}
          onChange={onChange}
        />                 
        <TextFieldGroup 
          label="H"
          id="item-dh"
          name="dh"
          placeholder="H"
          value={absent(item.dh) + ''}
          onChange={onChange}
        />                 
        <TextFieldGroup 
          label="Pavojingumas"
          id="item-pavoj"
          name="pavoj"
          placeholder="Pavojingumas"
          value={absent(item.pavoj)}
          onChange={onChange}
        />
      </div>  

      <div className="form-group row aptiko text-center">                  
        <TextFieldGroup 
          label="Operatorius"
          id="item-oper"
          name="oper"
          placeholder="Operatoriaus kodas"
          value={absent(item.oper)}
          onChange={onChange}
        />                 
        <TextFieldGroup 
          label="Defektoskopas"
          id="item-apar"
          name="apar"
          placeholder="Defektoskopo kodas"
          value={absent(item.apar)}
          onChange={onChange}
        /> 
      </div>  

      <div className="form-group row datos text-center">                  
        <TextFieldGroup 
          label="Aptikimo data"
          type="date"
          id="item-daptik"
          name="daptik"
          placeholder="Aptikimo data"
          value={absent(item.daptik)}
          onChange={onChange}
        />                  
        <TextFieldGroup 
          label="Pašalinimo terminas"
          type="date"
          id="item-dtermin"
          name="dtermin"
          placeholder="Terminas"
          value={absent(item.dtermin)}
          onChange={onChange}
        />                                  
        <TextFieldGroup 
          label="Tvarsliavimo data"
          type="date"
          id="item-dtvarsl"
          name="dtvarsl"
          placeholder="Tvarsliavimo data"
          value={absent(item.dtvarsl)}
          onChange={onChange}
        />                                  
        <TextFieldGroup 
          label="Panaikinimo data"
          type="date"
          id="item-dpanaik"
          name="panaikinta"
          placeholder="Panaikinimo data"
          value={absent(item.panaikinta)}
          onChange={onChange}
        />  
      </div>               
    </div>
  );
}

MainDataForm.propTypes = {
  item: PropTypes.object,
  onChange: PropTypes.func.isRequired
};



export {MainDataForm};