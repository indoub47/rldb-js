import React from "react";

const HeaderRow = ({header}) => { 
  const HeaderCell = ({item}) => (<th>{item}</th>);
  return <tr>header.map((item, index) => <HeaderCell item={item} key={index} />)</tr>
};


export default HeaderRow;
/*
input = [
  "a", 
  "b", 
  c: [
    "ca", 
    "cb", 
    "cc", 
    cd: [
      "cda", 
      "cdb"
    ], 
    "ce"
  ], 
  "d", 
  f: [
    "fa", 
    "fb"
  ]
];

output = [
  [
    {name: "a", row: 3, col: 1},
    {name: "b", row: 3, col: 1},
    {name: "c", row: 1, col: 6},
    {name: "d", row: 3, col: 1},
    {name: "f", row: 2, col: 2},
  ],
  [
    {name: "ca", row: 2, col: 1},
    {name: "cb", row: 2, col: 1},
    {name: "cc", row: 2, col: 1},
    {name: "cd", row: 1, col: 2},
    {name: "ce", row: 2, col: 1},
    {name: "fa", row: 1, col: 1},
    {name: "fb", row: 1, col: 1},
  ],
  [
    {name: "cda", row: 1, col: 1},
    {name: "cdb", row: 1, col: 1},
  ]
]