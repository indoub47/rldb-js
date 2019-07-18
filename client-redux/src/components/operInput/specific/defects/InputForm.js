import React from "react";
import TextFieldGroup from "../../../common/TextFieldGroup";
import SelectInputGroup from "../../../common/SelectInputGroup";
//import TextAreaGroup from "../../../common/TextAreaGroup";
import absent from "../../../../utils/absent-props";

const InputForm = ({ item, onChange, options, errors }) => {
  const edit = item.id && item.id > 0;
  
  return (
    <form>
      <div className="form-group row main-data text-center">
        <SelectInputGroup
          id="item-meistrija"
          name="meistrija"
          label="Meistrija"
          divClassname="form-group col-3"
          value={absent(item.meistrija)}
          options={options.meistrija}
          onChange={onChange}
          disabled={edit}
          error={errors.meistrija}
        />
        <SelectInputGroup
          id="item-kkateg"
          name="kkateg"
          label="Kelio kategorija"
          divClassname="form-group col-2"
          value={absent(item.kkateg)}
          options={options.kkateg}
          onChange={onChange}
          disabled={edit}
          error={errors.kkateg}
        />
      </div>
      <div className="form-group row begis text-center">
        <SelectInputGroup
          id="item-btipas"
          divClassname="form-group col-4"
          name="btipas"
          label="Bėgio tipas"
          value={absent(item.btipas)}
          options={options.btipas}
          onChange={onChange}
          disabled={edit}
          error={errors.btipas}
        />
        <SelectInputGroup
          id="item-bgamykl"
          divClassname="form-group col-4"
          name="bgamykl"
          label="Bėgio gamykla"
          value={absent(item.bgamykl)}
          options={options.bgamykl}
          onChange={onChange}
          disabled={edit}
          error={errors.bgamykl}
        />
        <TextFieldGroup
          divClassname="form-group col-4"
          label="Bėgio gam. metai"
          id="item-bmetai"
          name="bmetai"
          placeholder="Bėgio gam. metai"
          value={absent(item.bmetai)}
          onChange={onChange}
          readonly={edit}
          error={errors.bmetai}
        />
      </div>

      <div className="form-group row vieta text-center">
        <TextFieldGroup
          label="Linija"
          divClassname="form-group col-2"
          id="item-linija"
          name="linija"
          placeholder="Linija"
          value={absent(item.linija)}
          onChange={onChange}
          readonly={edit}
          error={errors.linija}
        />
        <TextFieldGroup
          label="Kelias"
          divClassname="form-group col-2"
          id="item-kelias"
          name="kelias"
          placeholder="Kelio Nr."
          value={absent(item.kelias)}
          onChange={onChange}
          readonly={edit}
          error={errors.kelias}
        />
        <TextFieldGroup
          label="km"
          divClassname="form-group col-2"
          id="item-km"
          name="km"
          placeholder="km"
          value={absent(item.km)}
          onChange={onChange}
          readonly={edit}
          error={errors.km}
        />
        <TextFieldGroup
          label="pk"
          divClassname="form-group col-2"
          id="item-pk"
          name="pk"
          placeholder="pk"
          value={absent(item.pk)}
          onChange={onChange}
          readonly={edit}
          error={errors.pk}
        />
        <TextFieldGroup
          label="m"
          divClassname="form-group col-2"
          id="item-m"
          name="m"
          placeholder="m"
          value={absent(item.m)}
          onChange={onChange}
          readonly={edit}
          error={errors.m}
        />
        <SelectInputGroup
          id="item-siule"
          divClassname="form-group col-2"
          name="siule"
          label="Siūlė"
          value={absent(item.siule)}
          options={options.siule}
          onChange={onChange}
          disabled={edit}
          error={errors.siule}
        />
      </div>
      <div className="form-group row text-center">
        <TextFieldGroup
          label="Data"
          divClassname="form-group col-4"
          type="date"
          id="item-data"
          name="data"
          value={absent(item.data)}
          onChange={onChange}
          error={errors.data}
        />
        <SelectInputGroup
          id="item-oper"
          name="oper"
          label="Operatorius"
          divClassname="form-group col-4"
          value={absent(item.oper)}
          options={options.oper}
          onChange={onChange}
          error={errors.oper}
        />
        <SelectInputGroup
          id="item-apar"
          name="apar"
          label="Defektoskopas"
          divClassname="form-group col-4"
          value={absent(item.apar)}
          options={options.apar}
          onChange={onChange}
          error={errors.apar}
        />
      </div>
      <div className="form-group row text-center">
        <TextFieldGroup
          label="Kodas"
          divClassname="form-group col-3"
          id="item-kodas"
          name="kodas"
          placeholder="Kodas"
          value={absent(item.kodas)}
          onChange={onChange}
          error={errors.kodas}
        />
        <TextFieldGroup
          label="L"
          divClassname="form-group col-2"
          id="item-dl"
          name="dl"
          placeholder="L"
          value={absent(item.dl)}
          onChange={onChange}
          error={errors.dl}
        />
        <TextFieldGroup
          label="H"
          divClassname="form-group col-2"
          id="item-dh"
          name="dh"
          placeholder="H"
          value={absent(item.dh)}
          onChange={onChange}
          error={errors.dh}
        />
        <SelectInputGroup
          id="item-pavoj"
          name="pavoj"
          label="Pavojingumas"
          divClassname="form-group col-2"
          value={absent(item.pavoj)}
          options={options.pavoj}
          onChange={onChange}
          error={errors.pavoj}
        />
        <TextFieldGroup
          label="Terminas"
          divClassname="form-group col-3"
          type="date"
          id="item-dtermin"
          name="dtermin"
          value={absent(item.dtermin)}
          onChange={onChange}
          error={errors.termin}
        />
      </div>
      <div className="form-group row text-center">
        <TextFieldGroup
          label="Pastaba"
          divClassname="form-group col-12"
          id="item-note"
          name="note"
          placeholder="Pastaba"
          value={absent(item.note)}
          onChange={onChange}
          error={errors.note}
        />
      </div>
    </form>
  );
};

export default InputForm;
