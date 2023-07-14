'use client'

import 'ag-grid-community/styles/ag-grid.css' // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css' // Optional theme CSS
import { AgGridReact } from 'ag-grid-react' // the AG Grid React Component
import { LegacyRef, useCallback, useRef } from 'react'

export default function SelectableGrid({
  onSelectedItem,
  rowData,
  columnDefs,
}: {
  onSelectedItem: (item: any[]) => void
  rowData: any[]
  columnDefs: any[]
}) {
  const gridRef: LegacyRef = useRef()
  const onSelectionChanged = useCallback(() => {
    const selectedRows = gridRef!.current.api.getSelectedRows()
    onSelectedItem(selectedRows[0])
  }, [])

  return (
    <>
      <div className="ag-theme-alpine-dark h-full drop-shadow-md">
        <AgGridReact
          ref={gridRef}
          rowData={rowData} // Row Data for Rows
          columnDefs={columnDefs} // Column Defs for Columns
          animateRows={true} // Optional - set to 'true' to have rows animate when sorted
          rowSelection="single" // Options - allows click selection of rows
          onSelectionChanged={onSelectionChanged}
        />
      </div>
    </>
  )
}
