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
            <Alert alertInfo={alert} />
          </div>
        ) : null}
      </div>
      <div className="form-group row text-center">
        <TextFieldGroup
          label="Data"
          divClassname="form-group col-3"
          type="date"
          id="item-hdata"
          name="hdata"
          value={absent(jItem.hdata)}
          onChange={onChange}
        />
        <SelectInputGroup
          id="item-action"
          name="action"
          label="Veiksmas"
          divClassname="form-group col-3"
          value={absent(jItem.action)}
          options={options.action}
          onChange={onChange}
        />
        <SelectInputGroup
          id="item-oper"
          name="oper"
          label="Operatorius"
          divClassname="form-group col-3"
          value={absent(jItem.oper)}
          options={options.oper}
          onChange={onChange}
        />
        <SelectInputGroup
          id="item-apar"
          name="apar"
          label="Defektoskopas"
          divClassname="form-group col-3"
          value={absent(jItem.apar)}
          options={options.apar}
          onChange={onChange}
        />
      </div>
      <div className="form-group row text-center">
        <TextFieldGroup
          label="Kodas"
          divClassname="form-group col-3"
          id="item-kodas"
          name="kodas"
          placeholder="Kodas"
          value={absent(jItem.kodas)}
          onChange={onChange}
        />
        <TextFieldGroup
          label="L"
          divClassname="form-group col-2"
          id="item-dl"
          name="dl"
          placeholder="L"
          value={absent(jItem.dl)}
          onChange={onChange}
        />
        <TextFieldGroup
          label="H"
          divClassname="form-group col-2"
          id="item-dh"
          name="dh"
          placeholder="H"
          value={absent(jItem.dh)}
          onChange={onChange}
        />
        <SelectInputGroup
          id="item-pavoj"
          name="pavoj"
          label="Pavojingumas"
          divClassname="form-group col-2"
          value={absent(jItem.pavoj)}
          options={options.pavoj}
          onChange={onChange}
        />
        <TextFieldGroup
          label="Terminas"
          divClassname="form-group col-3"
          type="date"
          id="item-termin"
          name="termin"
          value={absent(jItem.dtermin)}
          onChange={onChange}
        />
      </div>
      <div className="form-group row pastaba text-center">
        <TextAreaGroup
          divClassname="form-group col-12"
          label="Pastaba"
          id="item-note"
          name="note"
          value={absent(jItem.note)}
          onChange={onChange}
        />
      </div> 
      <div className="form-group row pastaba text-center">
        <div className="form-group col-3">
          <button type="submit" class="btn btn-primary" onClick={submitJItem}>
            Submit This Journal Record
          </button>
        </div>
        <div className="form-group col-3">
          <button type="submit" class="btn btn-light" onClick={cancelJItem}>
            Clear
          </button>
        </div>
      </div> 
    </div>
  );
};

export { JournalEditForm };
