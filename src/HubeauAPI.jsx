import { useQuery } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";

export default function HubeauAPI() {
  const [columnFilters, setColumnFilters] = React.useState([]);

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

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 15,
  });

  const [inputPage, setInputPage] = React.useState(pagination.pageIndex + 1);

  React.useEffect(() => {
    setInputPage(pagination.pageIndex + 1);
  }, [pagination.pageIndex]);

  const table = useReactTable({
    data: stations,
    columns,
    filterFns: {},
    state: {
      pagination,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(), //client side filtering
    getPaginationRowModel: getPaginationRowModel(),
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

      <div className="h-2" />
      <div className="flex items-center gap-2">
        <button
          onClick={() => setPagination((old) => ({ ...old, pageIndex: 0 }))}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </button>

        <button
          onClick={() =>
            setPagination((old) => ({
              ...old,
              pageIndex: Math.max(old.pageIndex - 1, 0),
            }))
          }
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>

        <button
          onClick={() =>
            setPagination((old) => ({
              ...old,
              pageIndex: Math.min(old.pageIndex + 1, table.getPageCount() - 1),
            }))
          }
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </button>

        <button
          onClick={() =>
            setPagination((old) => ({
              ...old,
              pageIndex: table.getPageCount() - 1,
            }))
          }
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </button>
        <span className="flex items-center gap-1">
          <div>
            Page{" "}
            <strong>
              {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </strong>
          </div>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            min="1"
            max={table.getPageCount()}
            value={inputPage}
            onKeyPress={(event) => {
              if (!/[0-9]/.test(event.key)) {
                event.preventDefault();
              }
            }}
            type="number"
            onChange={(e) => {
              const value = e.target.value;

              // On laisse vide si l'utilisateur efface
              if (value === "") {
                setInputPage("");
                return;
              }

              // Vérifie si le nombre est valide et >= 1
              const num = Number(value);
              if (
                num >= 1 &&
                num < table.getPageCount() + 1
              ) {
                setInputPage(value);

                const page = num - 1;
                if (page < table.getPageCount()) {
                  setPagination((old) => ({ ...old, pageIndex: page }));
                }
              }
            }}
            onBlur={() => {
              // Remet la bonne page si invalide ou vide
              if (
                inputPage === "" ||
                Number(inputPage) < 1 ||
                Number(inputPage) > table.getPageCount()
              ) {
                setInputPage(pagination.pageIndex + 1);
              }
            }}
            className="border p-1 rounded w-16"
          />
        </span>
      </div>
      <div>{table.getPrePaginationRowModel().rows.length} Stations</div>
    </div>
  );
}