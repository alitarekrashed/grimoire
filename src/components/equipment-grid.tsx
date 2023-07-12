'use client'

import { useEffect, useState } from 'react'
import { AgGridReact } from 'ag-grid-react' // the AG Grid React Component
import 'ag-grid-community/styles/ag-grid.css' // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css' // Optional theme CSS

export default function EquipmentGrid() {
  const [rowData, setRowData] = useState() // Set rowData to Array of Objects, one Object per Row]

  const [columnDefs, setColumnDefs] = useState([
    { field: 'name', filter: true },
    { field: 'category', filter: true },
    { field: 'level', filter: true },
  ])

  // Example load data from server
  useEffect(() => {
    fetch('http://localhost:3000/api/equipment', {
      cache: 'no-store',
    })
      .then((result) => result.json())
      .then((rowData) => setRowData(rowData))
  }, [])

  return (
    <>
      <div className="ag-theme-alpine-dark w-11/12 h-full">
        <AgGridReact
          rowData={rowData} // Row Data for Rows
          columnDefs={columnDefs} // Column Defs for Columns
          animateRows={true} // Optional - set to 'true' to have rows animate when sorted
          rowSelection="multiple" // Options - allows click selection of rows
        />
      </div>
    </>
  )
}
