import { useQuery } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";

export default function HubeauAPI() {

  // call de l'API Hubeau
  const { isPending, error, data } = useQuery({
    queryKey: ["stationsHubeau"],
    queryFn: () =>
      fetch("https://hubeau.eaufrance.fr/api/v1/temperature/station").then(
        (res) => res.json()
      ),
  });

  const stations = data?.data ?? [];

  const columns = React.useMemo(
    () => [
      {
        accessorKey: "code_station",
        header: "Code de la station",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "libelle_cours_eau",
        header: "Cours d'eau",
        filterFn: "includesString",
        cell: (info) => info.getValue() || "N/A",
      },
      {
        accessorKey: "libelle_commune",
        header: "Commune",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "libelle_region",
        header: "Région",
        cell: (info) => info.getValue(),
      },
    ],
    []
  );


  const table = useReactTable({
    data: stations,
    columns,
    filterFns: {},
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(), //client side filtering
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  });

  if (isPending) return <p>Chargement...</p>;
  if (error) return <p>Une erreur est survenue : {error.message}</p>;

  return (
    <div className="p-2">
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder ? null : (
                    <>
                      <div>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>
                    </>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}