import { useQuery } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";
import Filter from "./Filter";

export default function HubeauAPI({ sendCodeStation, sendRegionStation }) {
  const [columnFilters, setColumnFilters] = React.useState([]);

  // Call de l'API Hubeau
  const { isPending, error, data } = useQuery({
    queryKey: ["stationsHubeau"],
    queryFn: () =>
      fetch("https://hubeau.eaufrance.fr/api/v1/temperature/station").then(
        (res) => res.json()
      ),
  });

  const stations = data?.data ?? [];

  // Définition des colonnes
  const columns = React.useMemo(
    () => [
      {
        accessorKey: "code_station",
        header: "N° station",
      },
      {
        accessorFn: (row) => row.libelle_cours_eau || "N/A", // Permet d'afficher N/A si pas de libellé et de prendre en compte N/A quand on filtre
        id: "libelle_cours_eau",
        header: "Cours d'eau",
        filterFn: "includesString",
      },
      {
        accessorKey: "libelle_commune",
        header: "Commune",
      },
      {
        accessorKey: "libelle_region",
        header: "Région",
      },
    ],
    []
  );

  // Pagination manuelle
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 15,
  });

  // État pour afficher le numéro de page dans le champ input
  const [inputPage, setInputPage] = React.useState(pagination.pageIndex + 1);

  // Met à jour l'affichage du champ de page à chaque changement de pageIndex
  React.useEffect(() => {
    setInputPage(pagination.pageIndex + 1);
  }, [pagination.pageIndex]);

  // Init Tab avec Tanstack Table
  const table = useReactTable({
    data: stations,
    columns,
    state: {
      columnFilters,
      pagination,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(), //client side filtering
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  });

  // Si la page courante dépasse le nombre total de pages, on remet à la dernière page possible (permet d'éviter page 1 sur 0)
  React.useEffect(() => {
    if (pagination.pageIndex >= table.getPageCount()) {
      setPagination((old) => ({
        ...old,
        pageIndex: Math.max(table.getPageCount() - 1, 0),
      }));
    }
  }, [table.getPageCount(), pagination.pageIndex]);

  if (isPending) return <p>Chargement...</p>;
  if (error) return <p>Une erreur est survenue : {error.message}</p>;

  return (
    <div className="overflow-x-auto">
      <h1 className="sm:text-[1.3vw] border-y-1 py-2 mb-5 text-center font-medium">
        Liste des cours d'eau
      </h1>
      <table className="w-full table-auto table-fixed">
        <colgroup>
          <col className="w-[13vw]" />
          <col className="w-[15vw]" />
          <col className="w-[18vw]" />
          <col className="w-[18vw]" />
        </colgroup>
        <thead className="border-b-1">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  className="py-2 px-[2vw] text-[2.5vw]"
                >
                  {/* Affichage du nom des colonnes */}
                  {header.isPlaceholder ? null : (
                    <>
                      <div>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>

                      {/* Affichage du filtre s'il est activé sur la colonne */}
                      {header.column.getCanFilter() ? (
                        <div
                          className="search"
                          onKeyPress={() => {
                            if (table.getPageCount() > 1)
                              setPagination((old) => ({
                                ...old,
                                pageIndex: 0,
                              })); // Toujours afficher la première page quand on filtre
                          }}
                        >
                          <Filter column={header.column} />
                        </div>
                      ) : null}
                    </>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="text-[2.4vw] text-center">
          {/* Affichage des datas dans les lignes du tab */}
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              onClick={() => {
                // Envoie le code et la région de la station lorsqu'une ligne est cliquée
                sendCodeStation(row.original.code_station);
                sendRegionStation(row.original.libelle_region);
              }}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border-b-1 py-1 px-0.5">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="h-2" />
      {/* Système de pagination */}
      <div className="flex items-center gap-2 text-[2.8vw]">
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

        {/* Affichage de la page actuelle et du nombre total de pages */}
        <span className="flex items-center gap-1">
          <div>
            Page{" "}
            <strong>
              {table.getPageCount() === 0
                ? 0
                : table.getState().pagination.pageIndex + 1}{" "}
              of {table.getPageCount()}
            </strong>
          </div>
        </span>

        {/* Input pour choisir la page où on veut aller */}
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

              // Vérifie que la page entrée est OK avant de changer la pagination
              const num = Number(value);
              if (num >= 1 && num < table.getPageCount() + 1) {
                setInputPage(value);

                const page = num - 1;
                if (page < table.getPageCount()) {
                  setPagination((old) => ({ ...old, pageIndex: page }));
                }
              }
            }}
            onBlur={() => {
              // Si l'utilisateur quitte le champ sans valeur valide, on remet la page actuelle
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
      {/* Affichage du nombre total de stations récupérées*/}
      <div className="text-[2.5vw]">
        {table.getPrePaginationRowModel().rows.length} Station(s)
      </div>
      <hr className="my-5 w-1/2 ml-[22.5vw]" />
    </div>
  );
}
