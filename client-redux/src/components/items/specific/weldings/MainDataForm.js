import React from "react";
import PropTypes from "prop-types";
import TextFieldGroup from "../../../common/TextFieldGroup";
import TextAreaGroup from "../../../common/TextAreaGroup";
import SelectInputGroup from '../../../common/SelectInputGroup';
import { createOptions } from "../../../createOptions";
import absent from "../../../../utils/absent-props";

const MainDataForm = ({ item, onChange, things }) => {
  // select controls options
  // galbūt reikėtų iškelti prieš funciją, kad nekurtų kaskart kai renderina
  const siuleOptions = createOptions(things.siule, "Siūlė", x => x.id);
  const aparOptions = createOptions(things.apar, "Defektoskopas", x => x.id);
  const operOptions = createOptions(things.oper, "Operatorius", x => x.id);
  const statusOptions = createOptions([{id: 0}, {id: 1}, {id: 2}], null, x => x.id);
  //const virinoOptions = createOptions(things.virino, null, x => x.name);
  //const vbudasOptions = createOptions(things.vbudas, null, x => x.name);

  return (
    <div className="container item-info border border-primary text-center">
      <div className="form-group row main-data text-center">
        <TextFieldGroup
          divClassname="form-group"
          label="ID"
          id="item-id"
          name="id"
          placeholder="Suvirinimo ID"
          readonly={true}
          value={absent(item.id)}
          onChange={onChange}
        />
        <TextFieldGroup
          divClassname="form-group"
          label="Senasis ID"
          id="item-oldid"
          name="oldId"
          placeholder="Suvirinimo senasis ID"
          readonly={true}
          value={absent(item.oldid)}
          onChange={onChange}
        />
        <TextFieldGroup
          divClassname="form-group"
          label="Region bit"
          id="item-regbit"
          name="regbit"
          placeholder="Regionas"
          readonly={true}
          value={absent(item.regbit)}
          onChange={onChange}
        />
        <TextFieldGroup
          divClassname="form-group"
          label="Kas virino"
          id="item-virino"
          name="virino"
          placeholder="Kas virino"
          value={absent(item.virino)}
          onChange={onChange}
        />
        <TextFieldGroup
          divClassname="form-group"
          label="Virinimo būdas"
          id="item-vbudas"
          name="vbudas"
          placeholder="Virinimo būdas"
          value={absent(item.vbudas)}
          onChange={onChange}
        />
        <TextFieldGroup
          divClassname="form-group"
          label="Būsena"
          id="item-status"
          name="status"
          placeholder="Būsena"
          value={absent(item.status)}
          onChange={onChange}
        />
        <TextFieldGroup
          divClassname="form-group"
          label="Defekto ID"
          id="item-defectid"
          name="defectid"
          placeholder="Defekto ID"
          value={absent(item.defectid)}
          onChange={onChange}
        />
      </div>

      <div className="form-group row vieta text-center">
        <TextFieldGroup
          divClassname="form-group"
          label="Linija"
          id="item-linija"
          name="linija"
          placeholder="Linija"
          value={absent(item.linija)}
          onChange={onChange}
        />
        <TextFieldGroup
          divClassname="form-group"
          label="Kelias"
          id="item-kelias"
          name="kelias"
          placeholder="Kelias"
          value={absent(item.kelias)}
          onChange={onChange}
        />
        <TextFieldGroup
          divClassname="form-group"
          label="km"
          id="item-km"
          name="km"
          placeholder="km"
          value={absent(item.km)}
          onChange={onChange}
        />
        <TextFieldGroup
          divClassname="form-group"
          label="pk"
          id="item-pk"
          name="pk"
          placeholder="pk"
          value={absent(item.pk)}
          onChange={onChange}
        />
        <TextFieldGroup
          divClassname="form-group"
          label="m"
          id="item-m"
          name="m"
          placeholder="m"
          value={absent(item.m)}
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
        <TextFieldGroup
          divClassname="form-group"
          label="Suvir Nr."
          id="item-suvnr"
          name="suvnr"
          placeholder="suvnr"
          value={absent(item.suvnr)}
          onChange={onChange}
        />
        <TextFieldGroup
          divClassname="form-group"
          label="Nr. pagal schemą"
          id="item-nrschema"
          name="nrschema"
          placeholder="Nr. pagal schemą"
          value={absent(item.nrschema)}
          onChange={onChange}
        />
      </div>

      <div className="form-group row tikrinimai text-center">
        <TextFieldGroup
          divClassname="form-group"
          type="date"
          label="Įrengimo data"
          id="item-data0"
          name="data0"
          placeholder="Įrengimo data"
          value={absent(item.data0)}
          onChange={onChange}
        />
      </div>

      <div className="form-group row tikrinimai text-center">
        <TextFieldGroup
          divClassname="form-group"
          type="date"
          label="Data 1"
          id="item-data1"
          name="data1"
          placeholder="Data 1"
          value={absent(item.data1)}
          onChange={onChange}
        /> 
        <SelectInputGroup
          id="item-oper1"
          name="oper1"
          label="Operatorius 1"
          divClassname="form-group col-4"
          value={absent(item.oper1)}
          options={operOptions}
          onChange={onChange}
        />  
        <SelectInputGroup
          id="item-apar1"
          name="apar1"
          label="Defektoskopas 1"
          divClassname="form-group col-4"
          value={absent(item.apar1)}
          options={aparOptions}
          onChange={onChange}
        /> 
      </div>

      <div className="form-group row tikrinimai text-center">
        <TextFieldGroup
          divClassname="form-group"
          type="date"
          label="Data 2"
          id="item-data2"
          name="data2"
          placeholder="Data 2"
          value={absent(item.data2)}
          onChange={onChange}
        /> 
        <SelectInputGroup
          id="item-oper2"
          name="oper2"
          label="Operatorius 2"
          divClassname="form-group col-4"
          value={absent(item.oper2)}
          options={operOptions}
          onChange={onChange}
        />  
        <SelectInputGroup
          id="item-apar2"
          name="apar2"
          label="Defektoskopas 2"
          divClassname="form-group col-4"
          value={absent(item.apar2)}
          options={aparOptions}
          onChange={onChange}
        /> 
      </div>

      <div className="form-group row tikrinimai text-center">
        <TextFieldGroup
          divClassname="form-group"
          type="date"
          label="Data 3"
          id="item-data3"
          name="data3"
          placeholder="Data 3"
          value={absent(item.data3)}
          onChange={onChange}
        /> 
        <SelectInputGroup
          id="item-oper3"
          name="oper3"
          label="Operatorius 3"
          divClassname="form-group col-4"
          value={absent(item.oper3)}
          options={operOptions}
          onChange={onChange}
        />  
        <SelectInputGroup
          id="item-apar3"
          name="apar3"
          label="Defektoskopas 3"
          divClassname="form-group col-4"
          value={absent(item.apar3)}
          options={aparOptions}
          onChange={onChange}
        /> 
      </div>

      <div className="form-group row tikrinimai text-center">
        <TextFieldGroup
          divClassname="form-group"
          type="date"
          label="Data 4"
          id="item-data4"
          name="data4"
          placeholder="Data 4"
          value={absent(item.data4)}
          onChange={onChange}
        /> 
        <SelectInputGroup
          id="item-oper4"
          name="oper4"
          label="Operatorius 4"
          divClassname="form-group col-4"
          value={absent(item.oper4)}
          options={operOptions}
          onChange={onChange}
        />  
        <SelectInputGroup
          id="item-apar4"
          name="apar4"
          label="Defektoskopas 4"
          divClassname="form-group col-4"
          value={absent(item.apar4)}
          options={aparOptions}
          onChange={onChange}
        /> 
      </div>
      <div className="form-group row pastaba text-center">
        <TextAreaGroup
          divClassname="form-group"
          label="Pastaba"
          id="item-note"
          name="note"
          placeholder="Pastaba"
          value={absent(item.note)}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

MainDataForm.propTypes = {
  item: PropTypes.object,
  onChange: PropTypes.func.isRequired
};

export {MainDataForm};
