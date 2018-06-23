import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types';

import { getCellById } from '../../tools/notebook-utils'
import { cellTypeEnum } from '../../state-prototypes'
import { postActionToEditor } from '../../port-to-editor'


export class OutputContainerUnconnected extends React.Component {
  static propTypes = {
    selected: PropTypes.bool.isRequired,
    cellId: PropTypes.number.isRequired,
    children: PropTypes.node,
    editingCell: PropTypes.bool.isRequired,
    viewMode: PropTypes.oneOf(['editor', 'presentation']),
    cellType: PropTypes.oneOf(cellTypeEnum.values()),
    postActionToEditor: PropTypes.func.isRequired,
  }

  handleCellClick = () => {
    if (this.props.viewMode === 'editor' && !this.props.selected) {
      this.props.postActionToEditor({
        type: 'SELECT_CELL',
        id: this.props.cellId,
        scrollToCell: false,
      })
    }
  }

  render() {
    const cellClass = `cell-container ${
      this.props.cellType
    }${
      this.props.selected ? ' selected-cell' : ''
    }${
      this.props.editingCell ? ' editing-cell' : ''
    }`

    return (
      <div
        id={`cell-${this.props.cellId}`}
        className={cellClass}
        onMouseDown={this.handleCellClick}
      >
        <div className="cell-row-container">
          {this.props.children}
        </div>
      </div>
    )
  }
}


export function mapStateToProps(state, ownProps) {
  const cell = getCellById(state.cells, ownProps.cellId)
  return {
    cellId: cell.id,
    selected: cell.selected,
    editingCell: cell.selected && state.mode === 'edit',
    viewMode: state.viewMode,
    cellType: cell.cellType,
    postActionToEditor,
  }
}

export default connect(mapStateToProps)(OutputContainerUnconnected)