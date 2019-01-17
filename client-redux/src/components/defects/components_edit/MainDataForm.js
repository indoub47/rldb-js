import React from 'react';
import PropTypes from 'prop-types';
import TextFieldGroup from '../../common/TextFieldGroup';
import SelectInputGroup from '../../common/SelectInputGroup';
import {createOptions} from '../../createOptions';
import absent from '../../../utils/absent-props';

const MainDataForm = ({defect, onChangeMain, onChangeVieta, onChangeBegis, things}) => {
  
  // select controls options
  // galbūt reikėtų iškelti prieš funciją, kad nekurtų kaskart kai renderina
  //console.log("things", things);
  const meistrijOptions = createOptions(things.meistrij, "Meistrija", x => x.abbr + ", " + x.name);
  const kkategOptions = createOptions(things.kkateg, "Kelio kategorija", x => x.id);
  const btipasOptions = createOptions(things.btipas, "Bėgio tipas", x => x.id);
  const bgamyklOptions = createOptions(things.bgamykl, "Bėgio gamykla", x => x.id);
  const linstOptions = createOptions(things.linst, "Linija/stotis");
  const siuleOptions = createOptions(things.siule, "Siūlė", x => x.id);

  return (     
    <div className="container defect-info border border-primary text-center">
      <div className="form-group row main-data text-center">
        <TextFieldGroup 
          divClassname="form-group col-4"
          label="ID"
          id="defect-id"
          name="id"
          placeholder="Defekto ID"
          readonly={true}
          value={absent(defect.id)}
          onChange={onChangeMain}
        />

        <SelectInputGroup
          id="defect-meistrij"
          name="meistrij"
          label="Meistrija"
          divClassname="form-group col-4"
          value={absent(defect.vieta.meistrij)}
          options={meistrijOptions}
          onChange={onChangeVieta}
        />

        <SelectInputGroup
          id="defect-kkateg"
          name="kkateg"
          label="Kelio kategorija"
          divClassname="form-group col-4"
          value={absent(defect.kkateg)}
          options={kkategOptions}
          onChange={onChangeMain}
        />
      </div>

      <div className="form-group row begis text-center">
        <SelectInputGroup
          id="defect-btipas"
          name="tipas"
          label="Bėgio tipas"
          divClassname="form-group col-4"
          value={absent(defect.begis.tipas)}
          options={btipasOptions}
          onChange={onChangeBegis}
        />

        <SelectInputGroup
          id="defect-bgamykla"
          name="gamykla"
          label="Bėgio gamykla"
          divClassname="form-group col-4"
          value={absent(defect.begis.gamykla)}
          options={bgamyklOptions}
          onChange={onChangeBegis}
        />

        <TextFieldGroup 
          divClassname="form-group col-4"
          label="Bėgio gam. metai"
          id="defect-bmetai"
          name="metai"
          placeholder="Bėgio gam. metai"
          value={absent(defect.begis.metai) + ""}
          onChange={onChangeBegis}
        />
      </div>

      <div className="form-group row vieta text-center">
        <SelectInputGroup
          id="defect-linst"
          name="linst"
          label="Linija/stotis"
          divClassname="form-group col-4"
          value={absent(defect.vieta.linst)}
          options={linstOptions}
          onChange={onChangeVieta}
        />
        
        <TextFieldGroup 
          divClassname="form-group col-2"
          label="Kelias"
          id="defect-kelias"
          name="kelias"
          placeholder="Kelio Nr."
          value={absent(defect.vieta.kelias)}
          onChange={onChangeVieta}
        />
        
        <TextFieldGroup 
          divClassname="form-group col-2"
          label="Iešmas"
          name="iesmas"
          id="defect-iesmas"
          placeholder="Iešmo Nr."
          value={absent(defect.vieta.iesmas)}
          onChange={onChangeVieta}
        />
        
        <TextFieldGroup 
          divClassname="form-group col-1"
          label="km"
          id="defect-km"
          name="km"
          placeholder="km"
          value={absent(defect.vieta.km) + ''}
          onChange={onChangeVieta}
        />
        
        <TextFieldGroup 
          divClassname="form-group col-1"
          label="pk"
          id="defect-pk"
          name="pk"
          placeholder="pk"
          value={absent(defect.vieta.pk) + ''}
          onChange={onChangeVieta}
        />
        
        <TextFieldGroup 
          divClassname="form-group col-1"
          label="m"
          id="defect-m"
          name="m"
          placeholder="m"
          value={absent(defect.vieta.m) + ''}
          onChange={onChangeVieta}
        />

        <SelectInputGroup
          id="defect-siule"
          name="siule"
          label="Siūlė"
          divClassname="form-group col-1"
          value={absent(defect.vieta.siule)}
          options={siuleOptions}
          onChange={onChangeVieta}
        />
      </div>
    </div>
  );
}

MainDataForm.propTypes = {
  defect: PropTypes.object,
  onChangeMain: PropTypes.func.isRequired,
  onChangeVieta: PropTypes.func.isRequired,
  onChangeBegis: PropTypes.func.isRequired,
};



export default MainDataForm;