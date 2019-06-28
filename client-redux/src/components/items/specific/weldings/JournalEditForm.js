import React from "react";
import Alert from "../../../common/Alert";
import TextFieldGroup from "../../../common/TextFieldGroup";
import SelectInputGroup from "../../../common/SelectInputGroup";
import TextAreaGroup from "../../../common/TextAreaGroup";
import absent from "../../../../utils/absent-props";

const JournalEditForm = ({ jItem, onChange, options, submitJItem, cancelJItem, alert }) => {
  
  return (
    <div className="container journal-info border border-primary text-center">
      <div className="form-group row text-center">
        {alert ? (
          <div className="col-12">
            <Alert message={alert.msg} type={alert.type} />
          </div>
        ) : null}
      </div>
      <div className="form-group row text-center">
        <TextFieldGroup
          label="Data"
          divClassname="form-group col-4"
          type="date"
          id="jitem-dt"
          name="dt"
          value={absent(jItem.dt)}
          onChange={onChange}
        />
        <SelectInputGroup
          id="jitem-oper"
          name="oper"
          label="Operatorius"
          divClassname="form-group col-4"
          value={absent(jItem.oper)}
          options={options.oper}
          onChange={onChange}
        />
        <SelectInputGroup
          id="jitem-apar"
          name="apar"
          label="Defektoskopas"
          divClassname="form-group col-4"
          value={absent(jItem.apar)}
          options={options.apar}
          onChange={onChange}
        />
      </div>
      <div className="form-group row text-center">
        <TextFieldGroup
          label="Pavadinimas"
          divClassname="form-group col-3"
          id="jitem-pvd"
          name="pvd"
          placeholder="Pavadinimas"
          value={absent(jItem.pvd)}
          onChange={onChange}
        />
        <TextFieldGroup
          label="Defekto ID"
          divClassname="form-group col-3"
          id="jitem-defectid"
          name="defectid"
          placeholder="Defekto ID"
          value={absent(jItem.defectid)}
          onChange={onChange}
        />
      </div>
      <div className="form-group row pastaba text-center">
        <TextAreaGroup
          divClassname="form-group col-12"
          label="Pastaba"
          id="jitem-jnote"
          name="jnote"
          value={absent(jItem.jnote)}
          onChange={onChange}
        />
      </div> 
      <div className="form-group row pastaba text-center">
        <div className="form-group col-3">
          <button type="submit" className="btn btn-primary" onClick={submitJItem}>
            Submit This Journal Record
          </button>
        </div>
        <div className="form-group col-3">
          <button type="submit" className="btn btn-light" onClick={cancelJItem}>
            Clear
          </button>
        </div>
      </div> 
    </div>
  );
};

export { JournalEditForm };
