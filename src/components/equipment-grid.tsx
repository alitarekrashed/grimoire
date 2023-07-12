'use client'

import { GridReadyEvent, SortDirection } from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css' // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css' // Optional theme CSS
import { AgGridReact } from 'ag-grid-react' // the AG Grid React Component
import { useEffect, useRef, useState } from 'react'

export default function EquipmentGrid() {
  const [rowData, setRowData] = useState() // Set rowData to Array of Objects, one Object per Row]

  const [columnDefs, setColumnDefs] = useState([
    {
      field: 'level',
      filter: true,
      sort: 'asc' as SortDirection,
      maxWidth: '90',
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
      maxWidth: '150',
    },
  ])

  // access API from event object
  let onGridReady = (e: GridReadyEvent) => {
    console.log('grid is ready'!)
  }

  // Example load data from server
  useEffect(() => {
    fetch('http://localhost:3000/api/equipment', {
      cache: 'no-store',
    })
      .then((result) => result.json())
      .then((rowData) => {
        setRowData(rowData)
        console.log('setting data')
      })
  }, [])

  return (
    <>
      <div className="ag-theme-alpine-dark w-11/12 h-full">
        <AgGridReact
          onGridReady={onGridReady} // register event listener
          rowData={rowData} // Row Data for Rows
          columnDefs={columnDefs} // Column Defs for Columns
          animateRows={true} // Optional - set to 'true' to have rows animate when sorted
          rowSelection="multiple" // Options - allows click selection of rows
        />
      </div>
    </>
  )
}
