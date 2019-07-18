//const modelProvider = require("../models/modelProvider");
const collections = require("../config/collections");

const filters = {
        update: {
          main: "id = @id AND regbit = @regbit", 
          journal: "id = @id AND mainid = @mainid"
        }
      };

const exclude = {
      update: {
        main: ["id", "regbit"],
        journal: ["id", "mainid"],
      }, 
      insert: {
        main: ["id"],
        journal: [],
      }
    }; 

// eksportuoja funkciją, kuriai padavus objektą, 
// ji pagamina to objekto INSERT SQL statement tekstą:
// textFactory = INSERT_stmtTextFactory(itype, itemPart);
// txtStmt = textFactory(obj);
// Kad tą tekstą įvykdyti, reikia db.prepare(textStmt).run(obj);
module.exports.INSERT_stmtTextFactory = (itype, itemPart) => {  
  const tableName = collections[itype].tables[itemPart].name;
  const excludeFields = exclude.insert[itemPart];
  return (obj) => {
      const keys = Object.keys(obj)
        .filter(key => !excludeFields.includes(key));

      return `INSERT INTO ${tableName} (${
        keys.join(', ')
      }) VALUES (${
        keys.map(key => "@" + key).join(', ')
      })`;
  }
};

// eksportuoja funkciją, kuriai padavus objektą, 
// ji pagamina to objekto UPDATE SQL statement tekstą:
// textFactory = UPDATE_stmtTextFactory(itype, itemPart);
// txtStmt = textFactory(obj);
// Kad tą tekstą įvykdyti, reikia db.prepare(textStmt).run(obj);
module.exports.UPDATE_stmtTextFactory = (itype, itemPart) => {  
  const tableName = collections[itype].tables[itemPart].name;
  const excludeFields = exclude.update[itemPart];
  const filter = filters.update[itemPart];

  return obj => {
      const updateText = `UPDATE ${tableName} SET ${
        Object.keys(obj)
          .filter(key => !excludeFields.includes(key))
          .map(key => `${key} = @${key}`)
          .join(", ")
      }`;
      if (filter) return updateText + ` WHERE ${filter}`;
      return updateText;
  }
};

// eksportuoja funkciją, kuri
// pagamina objekto main dalies DELETE SQL statement tekstą:
// txtStmt = DELETEMAIN_stmtText(itype);
// Kad tą tekstą įvykdyti, reikia db.prepare(textStmt).run(mainData);
// kur mainData turi id, regbit, v
module.exports.DELETE_MAIN_stmtText = (itype) => {  
  const tableName = collections[itype].tables.main.name;
  return `DELETE FROM ${tableName} WHERE id = @id AND regbit = @regbit AND v = @v`;
};

// eksportuoja funkciją, kuri
// pagamina updateinamo item kai kurių journal DELETE SQL statement tekstą:
// txtStmt = DELETE_SOME_JOURNAL_stmtText(itype, journal.delete);
// Kad tą tekstą įvykdyti, reikia db.prepare(textStmt).run(main_id, journal.delete);
module.exports.DELETE_SOME_JOURNAL_stmtText = (itype, journal_delete) => {  
  const tableName = collections[itype].tables.journal.name;
  return `DELETE FROM ${tableName} WHERE mainid = ? AND id IN (${journal_delete.map(j => '?').join(', ')})`;
};

// eksportuoja prepared statement, kuris
// naikina item visą journal
// Kad tą įvykdyti, reikia stmt.run(main_id);
module.exports.DELETE_WHOLE_JOURNAL_stmt = (itype, db) => {  
  const tableName = collections[itype].tables.journal.name;
  return db.prepare(`DELETE FROM ${tableName} WHERE mainid = ?`);
};

module.exports.simpleUpdateStmt = (obj, tableName, excludeFields) => {
  const exFields = excludeFields || [];
  return `UPDATE ${tableName} SET ${
        Object.keys(obj)
          .filter(key => !exFields.includes(key))
          .map(key => `${key}=@${key}`)
          .join(", ")
      }`;
}

module.exports.simpleDeleteStmt = (tableName, filter) => {
  return `DELETE FROM ${tableName} WHERE ${filter}`;
}

module.exports.simpleInsertStmt = (tableName, draft, excludeFields) => {
  const exFields = excludeFields || [];
  const keys = Object.keys(draft)
        .filter(key => !exFields.includes(key));

  return `INSERT INTO ${tableName} (${
    keys.join(', ')
  }) VALUES (${
    keys.map(key => "@" + key).join(', ')
  })`;
}

module.exports.DELETE_FROM_SUPPLIED_stmt = db => db.prepare("DELETE FROM supplied WHERE regbit = ? AND itype = ?");

module.exports.INSERT_INTO_UNAPPROVED_stmt = db => db.prepare("INSERT INTO unapproved (input, itype, oper) VALUES (@input, @itype, @oper)");

module.exports.INSERT_INTO_WITHERRORS_stmt = db => db.prepare("INSERT INTO withErrors (input, itype, regbit) VALUES (@input, @itype, @regbit)");

module.exports.SHIFT_MAIN_V_stmt = (itype, db) => {   
  const tableName = collections[itype].tables.main.name;
  return db.prepare(`UPDATE ${tableName} SET v = v + 1 WHERE id = ?`);
}

module.exports.SEARCH_ITEMS_BY_LOCATION_stmt = (itype, filterObj, db) => {
  const tableName = collections[itype].tables.viewAllLastJ.name;
  const notPanaikinta = collections[itype].notPanaikinta;
  const locationFilter = Object.keys(filterObj)
    .filter(key => filterObj[key] != null && filterObj[key] !== '')
    .map(key => `${key} = @${key}`)
    .join(" AND ");
  const stmtText = `SELECT * FROM ${tableName} WHERE regbit = ? AND ${locationFilter} AND ${notPanaikinta}`;
  return db.prepare(stmtText); 
}

