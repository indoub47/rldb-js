import React from "react";
import PropTypes from "prop-types";
import TextFieldGroup from "../../../common/TextFieldGroup";
import SelectInputGroup from "../../../common/SelectInputGroup";
import TextAreaGroup from "../../../common/TextAreaGroup";
import { createOptions } from "../../../createOptions";
import absent from "../../../../utils/absent-props";

const MainDataForm = ({ item, onChange, things }) => {
  // console.log("item", item);
  // select controls options
  // galbūt reikėtų iškelti prieš funciją, kad nekurtų kaskart kai renderina
  // console.log("things", things);
  const meistrijaOptions = createOptions(
    things.meistrija.sort((m1, m2) => m1.ind - m2.ind),
    "-- nenurodyta --",
    x => x.abbr + ", " + x.name
  );
  const kkategOptions = createOptions(
    things.kkateg,
    "-- nenurodyta --",
    x => x.id
  );
  const pavojOptions = createOptions(
    things.pavoj.sort((p1, p2) => p1.ind - p2.ind),
    "-- nenurodyta --",
    x => x.id
  );
  const btipasOptions = createOptions(
    things.btipas,
    "-- nenurodyta --",
    x => x.id
  );
  const bgamyklOptions = createOptions(
    things.bgamykl,
    "-- nenurodyta --",
    x => x.id
  );
  const siuleOptions = createOptions(
    things.siule,
    "-- nenurodyta --",
    x => x.id
  );
  const aparOptions = createOptions(
    things.defskop,
    "-- nenurodyta --",
    x => x.id
  );
  const operOptions = createOptions(
    things.operat,
    "-- nenurodyta --",
    x => x.id
  );
  const actionOptions = createOptions(
    [
      { id: 0, name: "" },
      { id: 1, name: "pakeistas bėgis" },
      { id: 2, name: "sutvarsliuota" }
    ],
    "-- nenurodyta --",
    x => x.name
  );

  return (
    <div className="container item-info border border-primary text-center">
      <div className="form-group row main-data text-center">
        <TextFieldGroup
          divClassname="form-group col-2"
          label="ID"
          id="item-id"
          name="id"
          placeholder="Defekto ID"
          readonly={true}
          value={absent(item.id)}
          onChange={onChange}
        />
        <TextFieldGroup
          divClassname="form-group col-2"
          label="Regionas"
          id="item-regbit"
          name="regbit"
          placeholder="Regionas"
          readonly={true}
          value={absent(item.regbit)}
          onChange={onChange}
        />
        <TextFieldGroup
          divClassname="form-group col-2"
          label="ID1"
          id="item-id1"
          name="id1"
          placeholder="Defekto ID1"
          value={absent(item.id1)}
          onChange={onChange}
        />
        <SelectInputGroup
          id="item-meistrija"
          name="meistrija"
          label="Meistrija"
          divClassname="form-group col-3"
          value={absent(item.meistrija)}
          options={meistrijaOptions}
          onChange={onChange}
        />
        <SelectInputGroup
          id="item-kkateg"
          name="kkateg"
          label="Kelio kategorija"
          divClassname="form-group col-2"
          value={absent(item.kkateg)}
          options={kkategOptions}
          onChange={onChange}
        />
      </div>

      <div className="form-group row begis text-center">
        <SelectInputGroup
          id="item-btipas"
          divClassname="form-group col-4"
          name="btipas"
          label="Bėgio tipas"
          value={absent(item.btipas)}
          options={btipasOptions}
          onChange={onChange}
        />
        <SelectInputGroup
          id="item-bgamykl"
          divClassname="form-group col-4"
          name="bgamykl"
          label="Bėgio gamykla"
          value={absent(item.bgamykl)}
          options={bgamyklOptions}
          onChange={onChange}
        />
        <TextFieldGroup
          divClassname="form-group col-4"
          label="Bėgio gam. metai"
          id="item-bmetai"
          name="bmetai"
          placeholder="Bėgio gam. metai"
          value={absent(item.bmetai)}
          onChange={onChange}
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
        />
        <TextFieldGroup
          label="Kelias"
          divClassname="form-group col-2"
          id="item-kelias"
          name="kelias"
          placeholder="Kelio Nr."
          value={absent(item.kelias)}
          onChange={onChange}
        />
        <TextFieldGroup
          label="km"
          divClassname="form-group col-2"
          id="item-km"
          name="km"
          placeholder="km"
          value={absent(item.km)}
          onChange={onChange}
        />
        <TextFieldGroup
          label="pk"
          divClassname="form-group col-2"
          id="item-pk"
          name="pk"
          placeholder="pk"
          value={absent(item.pk)}
          onChange={onChange}
        />
        <TextFieldGroup
          label="m"
          divClassname="form-group col-2"
          id="item-m"
          name="m"
          placeholder="m"
          value={absent(item.m)}
          onChange={onChange}
        />
        <SelectInputGroup
          id="item-siule"
          divClassname="form-group col-2"
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
          divClassname="form-group col-3"
          id="item-kodas"
          name="kodas"
          placeholder="Kodas"
          value={absent(item.kodas)}
          onChange={onChange}
        />
        <TextFieldGroup
          label="L"
          divClassname="form-group col-3"
          id="item-dl"
          name="dl"
          placeholder="L"
          value={absent(item.dl)}
          onChange={onChange}
        />
        <TextFieldGroup
          label="H"
          divClassname="form-group col-3"
          id="item-dh"
          name="dh"
          placeholder="H"
          value={absent(item.dh)}
          onChange={onChange}
        />
        <SelectInputGroup
          id="item-pavoj"
          name="pavoj"
          label="Pavojingumo laipsnis"
          divClassname="form-group col-3"
          value={absent(item.pavoj)}
          options={pavojOptions}
          onChange={onChange}
        />
      </div>

      <div className="form-group row aptiko text-center">
        <SelectInputGroup
          id="item-oper"
          name="oper"
          label="Operatoriaus kodas"
          divClassname="form-group col-4"
          value={absent(item.oper)}
          options={operOptions}
          onChange={onChange}
        />
        <SelectInputGroup
          id="item-apar"
          name="apar"
          label="Defektoskopo kodas"
          divClassname="form-group col-4"
          value={absent(item.apar)}
          options={aparOptions}
          onChange={onChange}
        />
      </div>

      <div className="form-group row datos text-center">
        <TextFieldGroup
          label="Aptikimo data"
          divClassname="form-group col-3"
          type="date"
          id="item-daptik"
          name="daptik"
          placeholder="Aptikimo data"
          value={absent(item.daptik)}
          onChange={onChange}
        />
        <TextFieldGroup
          label="Pašalinimo terminas"
          divClassname="form-group col-3"
          type="date"
          id="item-dtermin"
          name="dtermin"
          placeholder="Terminas"
          value={absent(item.dtermin)}
          onChange={onChange}
        />
        <TextFieldGroup
          label="Panaikinimo (tvarsliavimo) data"
          divClassname="form-group col-3"
          type="date"
          id="item-daction"
          name="daction"
          placeholder="Panaikinimo data"
          value={absent(item.daction)}
          onChange={onChange}
        />
        <SelectInputGroup
          id="item-action"
          name="action"
          label="Atliktas veiksmas"
          divClassname="form-group col-3"
          value={absent(item.action)}
          options={actionOptions}
          onChange={onChange}
        />
      </div>

      <div className="form-group row pastaba text-center">
        <TextAreaGroup
          divClassname="form-group col-12"
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

export { MainDataForm };
