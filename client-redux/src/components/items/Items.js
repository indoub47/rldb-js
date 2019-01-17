import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import ItemsCount from "../common/ItemsCount";
import Pager from "../common/pager/Pager";
import Confirmation from "../common/Confirmation";
//import ExportItems from "../common/exportItems/ExportItems";
import FilterSort from "../common/filterSort/FilterSort";
import { pageChange, itemsPerPageChange } from "../../actions/pagerActions";

import { fetchDefects, filterSortDefects } from "../../actions/defectsActions";
import { fetchWeldings, filterSortWeldings } from "../../actions/weldingsActions";
import {DefectRow, DefectHeaderRow} from "./components_items/DefectRow";
import {WeldingRow, WeldingHeaderRow} from "./components_items/DefectRow";

class Items extends Component {
  constructor(props) {
    super(props);

    this.thingType = this.props.thingType;
    select(this.thingType) {

    }
    this.pageChange = this.pageChange.bind(this);
    this.itemsPerPageChange = this.itemsPerPageChange.bind(this);
  }

  pageChange(pageIndex) {
    this.props.pageChange(pageIndex, this.props.fsedDefects.length);
  }

  itemsPerPageChange(e) {
    const selectedValue = parseInt(e.target.value, 10);
    this.props.itemsPerPageChange(selectedValue, this.props.fsedDefects.length);
  }

  render() {
    if (this.props.itemsError) {
      return (
        <div className="row">
          <div className="col-12">
            <ErrorAlertPacket
              errorObjArray={[
                this.props.itemsError
              ]}
            />
          </div>
        </div>
      );
    }

    const { firstItemIndex, itemsPerPage, buttons } = this.props.pager;

    const pagerComponent =
      buttons.length > 0 ? (
        <Pager
          firstItemIndex={firstItemIndex}
          buttons={buttons}
          itemsPerPage={itemsPerPage}
          onPageChanged={this.pageChange}
          onItemsPerPageChanged={this.itemsPerPageChange}
          itemCount={this.props.items.length}
        />
      ) : null;

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <ItemTable
              items={this.props.fsedDefects.slice(
                firstItemIndex,
                firstItemIndex + itemsPerPage
              )}
              editItem={this.editDefect}
              deleteItem={this.showDeleteConfirmation}
              ItemRow={this.ItemRow}
              ItemHeaderRow={this.ItemHeaderRow}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-3">
            <ItemsCount
              inView={this.props.fsedDefects.length}
              total={this.props.allDefectCount}
            />
          </div>

          <div className="col-7">{pagerComponent}</div>

          {/*<div className="col-xl-2">
            <ExportItems items={this.props.filterSort.items} />
          </div>*/}
        </div>
      </div>
    );
  }
}

Defects.propTypes = {
  items: PropTypes.array,
  itemsError: PropTypes.object,
  pager: PropTypes.object.isRequired,
  pageChange: PropTypes.func.isRequired,
  itemsPerPageChange: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  items: state.items.data,
  itemsError: state.items.error,
  pager: state.pager
});

Defects.defaultProps = {
  items: []
};

export default connect(
  mapStateToProps,
  {    
    pageChange,
    itemsPerPageChange
  }
)(Items);
