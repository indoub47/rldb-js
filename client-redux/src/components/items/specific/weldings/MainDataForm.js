import React from "react";
import PropTypes from "prop-types";
import TextFieldGroup from "../../../common/TextFieldGroup";
import TextAreaGroup from "../../../common/TextAreaGroup";
//import SelectInputGroup from "../../common/SelectInputGroup";
//import { createOptions } from "../../createOptions";
import absent from "../../../../utils/absent-props";

const MainDataForm = ({ welding, onChange, things }) => {
  // select controls options
  // galbūt reikėtų iškelti prieš funciją, kad nekurtų kaskart kai renderina
  //console.log("things", things);

  return (
    <div className="container welding-info border border-primary text-center">
      <div className="form-group row main-data text-center">
        <TextFieldGroup
          divClassname="form-group"
          label="ID"
          id="welding-id"
          name="id"
          placeholder="Suvirinimo ID"
          readonly={true}
          value={absent(welding.id)}
          onChange={onChange}
        />
        <TextFieldGroup
          divClassname="form-group"
          label="Region"
          id="welding-region"
          name="region"
          placeholder="Regionas"
          readonly={true}
          value={absent(welding.region)}
          onChange={onChange}
        />
        <TextFieldGroup
          divClassname="form-group"
          label="Kas virino"
          id="welding-virino"
          name="virino"
          placeholder="Kas virino"
          value={absent(welding.virino)}
          onChange={onChange}
        />
        <TextFieldGroup
          divClassname="form-group"
          label="Virinimo būdas"
          id="welding-vbudas"
          name="vbudas"
          placeholder="Virinimo būdas"
          value={absent(welding.vbudas)}
          onChange={onChange}
        />
        <div className="radio">
          <label>
            <input
              type="radio"
              id="welding-panaikinta"
              name="panaikinta"
              value={welding.panaikinta ? true : false}
              onChange={onChange}
            />
            Panaikinta
          </label>
        </div>
        <TextFieldGroup
          divClassname="form-group"
          label="Defekto ID"
          id="welding-defectid"
          name="defectid"
          placeholder="Defekto ID"
          value={absent(welding.defectid)}
          onChange={onChange}
        />
      </div>

      <div className="form-group row begis text-center">
        <TextFieldGroup
          divClassname="form-group"
          label="Linija"
          id="welding-linija"
          name="linija"
          placeholder="Linija"
          value={absent(welding.linija)}
          onChange={onChange}
        />
        <TextFieldGroup
          divClassname="form-group"
          label="Kelias"
          id="welding-kelias"
          name="kelias"
          placeholder="Kelias"
          value={absent(welding.kelias)}
          onChange={onChange}
        />
        <TextFieldGroup
          divClassname="form-group"
          label="Km"
          id="welding-km"
          name="km"
          placeholder="Km"
          value={absent(welding.km) + ""}
          onChange={onChange}
        />
        <TextFieldGroup
          divClassname="form-group"
          label="Pk"
          id="welding-pk"
          name="pk"
          placeholder="Pk"
          value={absent(welding.pk) + ""}
          onChange={onChange}
        />
        <TextFieldGroup
          divClassname="form-group"
          label="M"
          id="welding-m"
          name="m"
          placeholder="M"
          value={absent(welding.m) + ""}
          onChange={onChange}
        />
        <TextFieldGroup
          divClassname="form-group"
          label="Siūlė"
          id="welding-siule"
          name="siule"
          placeholder="Siūlė"
          value={absent(welding.siule)}
          onChange={onChange}
        />
      </div>

      <div className="form-group row vieta text-center">
        <TextFieldGroup
          divClassname="form-group"
          type="date"
          label="Data 1"
          id="welding-data1"
          name="data1"
          placeholder="Data 1"
          value={absent(welding.data1)}
          onChange={onChange}
        />
        <TextFieldGroup
          divClassname="form-group"
          label="Defektoskopas 1"
          id="welding-apar1"
          name="apar1"
          placeholder="Defektoskopas 1"
          value={absent(welding.apar1)}
          onChange={onChange}
        />
        <TextFieldGroup
          divClassname="form-group"
          label="Operatorius 1"
          id="welding-oper1"
          name="oper1"
          placeholder="Operatorius 1"
          value={absent(welding.oper1)}
          onChange={onChange}
        />
      </div>

      <div className="form-group row vieta text-center">
        <TextFieldGroup
          divClassname="form-group"
          type="date"
          label="Data 2"
          id="welding-data2"
          name="data2"
          placeholder="Data 2"
          value={absent(welding.data2)}
          onChange={onChange}
        />
        <TextFieldGroup
          divClassname="form-group"
          label="Defektoskopas 2"
          id="welding-apar2"
          name="apar2"
          placeholder="Defektoskopas 2"
          value={absent(welding.apar2)}
          onChange={onChange}
        />
        <TextFieldGroup
          divClassname="form-group"
          label="Operatorius 2"
          id="welding-oper2"
          name="oper2"
          placeholder="Operatorius 2"
          value={absent(welding.oper2)}
          onChange={onChange}
        />
      </div>

      <div className="form-group row vieta text-center">
        <TextFieldGroup
          divClassname="form-group"
          type="date"
          label="Data 3"
          id="welding-data3"
          name="data3"
          placeholder="Data 3"
          value={absent(welding.data3)}
          onChange={onChange}
        />
        <TextFieldGroup
          divClassname="form-group"
          label="Defektoskopas 3"
          id="welding-apar3"
          name="apar3"
          placeholder="Defektoskopas 3"
          value={absent(welding.apar3)}
          onChange={onChange}
        />
        <TextFieldGroup
          divClassname="form-group"
          label="Operatorius 3"
          id="welding-oper3"
          name="oper3"
          placeholder="Operatorius 3"
          value={absent(welding.oper3)}
          onChange={onChange}
        />
      </div>

      <div className="form-group row vieta text-center">
        <TextFieldGroup
          divClassname="form-group"
          type="date"
          label="Data 4"
          id="welding-data4"
          name="data4"
          placeholder="Data 4"
          value={absent(welding.data4)}
          onChange={onChange}
        />
        <TextFieldGroup
          divClassname="form-group"
          label="Defektoskopas 4"
          id="welding-apar4"
          name="apar4"
          placeholder="Defektoskopas 4"
          value={absent(welding.apar4)}
          onChange={onChange}
        />
        <TextFieldGroup
          divClassname="form-group"
          label="Operatorius 4"
          id="welding-oper4"
          name="oper4"
          placeholder="Operatorius 4"
          value={absent(welding.oper4)}
          onChange={onChange}
        />
      </div>
      <div className="form-group row vieta text-center">
        <TextAreaGroup
          divClassname="form-group"
          label="Pastaba"
          id="welding-pastaba"
          name="pastaba"
          placeholder="Pastaba"
          value={absent(welding.pastaba)}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

MainDataForm.propTypes = {
  welding: PropTypes.object,
  onChange: PropTypes.func.isRequired
};

export {MainDataForm};
