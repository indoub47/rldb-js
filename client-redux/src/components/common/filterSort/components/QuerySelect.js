import React from 'react';
import SelectInputGroup from "../../SelectInputGroup";

const QuerySelect = ({options, onChange, value}) => {
      console.log(value);
      return (
          <SelectInputGroup
            options={options}
            name="fsqueries"
            value={value || ''}
            placeholder='Queries'
            onChange={onChange}
            size="3"
            style={{ fontSize: ".95rem" }}
          /> 
      );
  }

export default QuerySelect;
