'use client'

import { Equipment } from '@/models/equipment'
import { SortDirection } from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css' // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css' // Optional theme CSS
import { AgGridReact } from 'ag-grid-react' // the AG Grid React Component
import { LegacyRef, useCallback, useEffect, useRef, useState } from 'react'

export default function EquipmentGrid({
  onSelectedItem,
}: {
  onSelectedItem: (item: Equipment) => void
}) {
  const [rowData, setRowData] = useState() // Set rowData to Array of Objects, one Object per Row]

  const [columnDefs, setColumnDefs] = useState([
    {
      field: 'level',
      filter: true,
      sort: 'asc' as SortDirection,
      maxWidth: 90,
      flex: 1,
    },
    { field: 'name', filter: true, flex: 1 },
    { field: 'category', filter: true, flex: 1 },
    { field: 'source.title', headerName: 'Source', filter: true, flex: 1 },
    {
      field: 'rarity',
      filter: true,
      valueFormatter: (value: any): string => value.data.rarity ?? 'common',
      flex: 1,
      maxWidth: 150,
    },
  ])

  const gridRef: LegacyRef = useRef()
  const onSelectionChanged = useCallback(() => {
    const selectedRows = gridRef!.current.api.getSelectedRows()
    onSelectedItem(selectedRows[0])
  }, [])

  // Example load data from server
  useEffect(() => {
    fetch('http://localhost:3000/api/equipment', {
      cache: 'no-store',
    })
      .then((result) => result.json())
      .then((rowData) => {
        setRowData(rowData)
      })
  }, [])

  return (
    <>
      <div className="ag-theme-alpine-dark w-11/12 h-full">
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
