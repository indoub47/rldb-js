import React from "react";
import PropTypes from "prop-types";
import TextFieldGroup from "../../../common/TextFieldGroup";
import TextAreaGroup from "../../../common/TextAreaGroup";
//import SelectInputGroup from "../../common/SelectInputGroup";
//import { createOptions } from "../../createOptions";
import absent from "../../../../utils/absent-props";

const MainDataForm = ({ item, onChange, things }) => {
  // select controls options
  // galbūt reikėtų iškelti prieš funciją, kad nekurtų kaskart kai renderina
  //console.log("things", things);

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
          label="Region"
          id="item-region"
          name="region"
          placeholder="Regionas"
          readonly={true}
          value={absent(item.region)}
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
        <div className="radio">
          <label>
            <input
              type="radio"
              id="item-panaikinta"
              name="panaikinta"
              value={item.panaikinta ? true : false}
              onChange={onChange}
            />
            Panaikinta
          </label>
        </div>
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

      <div className="form-group row begis text-center">
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
          label="Km"
          id="item-km"
          name="km"
          placeholder="Km"
          value={absent(item.km) + ""}
          onChange={onChange}
        />
        <TextFieldGroup
          divClassname="form-group"
          label="Pk"
          id="item-pk"
          name="pk"
          placeholder="Pk"
          value={absent(item.pk) + ""}
          onChange={onChange}
        />
        <TextFieldGroup
          divClassname="form-group"
          label="M"
          id="item-m"
          name="m"
          placeholder="M"
          value={absent(item.m) + ""}
          onChange={onChange}
        />
        <TextFieldGroup
          divClassname="form-group"
          label="Siūlė"
          id="item-siule"
          name="siule"
          placeholder="Siūlė"
          value={absent(item.siule)}
          onChange={onChange}
        />
      </div>

      <div className="form-group row vieta text-center">
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
        <TextFieldGroup
          divClassname="form-group"
          label="Defektoskopas 1"
          id="item-apar1"
          name="apar1"
          placeholder="Defektoskopas 1"
          value={absent(item.apar1)}
          onChange={onChange}
        />
        <TextFieldGroup
          divClassname="form-group"
          label="Operatorius 1"
          id="item-oper1"
          name="oper1"
          placeholder="Operatorius 1"
          value={absent(item.oper1)}
          onChange={onChange}
        />
      </div>

      <div className="form-group row vieta text-center">
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
        <TextFieldGroup
          divClassname="form-group"
          label="Defektoskopas 2"
          id="item-apar2"
          name="apar2"
          placeholder="Defektoskopas 2"
          value={absent(item.apar2)}
          onChange={onChange}
        />
        <TextFieldGroup
          divClassname="form-group"
          label="Operatorius 2"
          id="item-oper2"
          name="oper2"
          placeholder="Operatorius 2"
          value={absent(item.oper2)}
          onChange={onChange}
        />
      </div>

      <div className="form-group row vieta text-center">
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
        <TextFieldGroup
          divClassname="form-group"
          label="Defektoskopas 3"
          id="item-apar3"
          name="apar3"
          placeholder="Defektoskopas 3"
          value={absent(item.apar3)}
          onChange={onChange}
        />
        <TextFieldGroup
          divClassname="form-group"
          label="Operatorius 3"
          id="item-oper3"
          name="oper3"
          placeholder="Operatorius 3"
          value={absent(item.oper3)}
          onChange={onChange}
        />
      </div>

      <div className="form-group row vieta text-center">
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
        <TextFieldGroup
          divClassname="form-group"
          label="Defektoskopas 4"
          id="item-apar4"
          name="apar4"
          placeholder="Defektoskopas 4"
          value={absent(item.apar4)}
          onChange={onChange}
        />
        <TextFieldGroup
          divClassname="form-group"
          label="Operatorius 4"
          id="item-oper4"
          name="oper4"
          placeholder="Operatorius 4"
          value={absent(item.oper4)}
          onChange={onChange}
        />
      </div>
      <div className="form-group row vieta text-center">
        <TextAreaGroup
          divClassname="form-group"
          label="Pastaba"
          id="item-pastaba"
          name="pastaba"
          placeholder="Pastaba"
          value={absent(item.pastaba)}
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
