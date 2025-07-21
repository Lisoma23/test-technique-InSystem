import DebouncedInput from "./DebouncedInput";

export default function Filter({ column }) {
  const columnFilterValue = column.getFilterValue();
  const filterVariant = column.columnDef.meta?.filterVariant;

  if (filterVariant === "range") {
    return (
      <div>
        <div className="flex space-x-2">
          <DebouncedInput
            type="number"
            value={(columnFilterValue && columnFilterValue[0]) ?? ""}
            onChange={(value) =>
              column.setFilterValue((old) => [value, old?.[1]])
            }
            placeholder="Min"
            className="w-24 border shadow rounded"
          />
          <DebouncedInput
            type="number"
            value={(columnFilterValue && columnFilterValue[1]) ?? ""}
            onChange={(value) =>
              column.setFilterValue((old) => [old?.[0], value])
            }
            placeholder="Max"
            className="w-24 border shadow rounded"
          />
        </div>
        <div className="h-1" />
      </div>
    );
  } else if (filterVariant === "select") {
    return (
      <select
        onChange={(e) => column.setFilterValue(e.target.value)}
        value={columnFilterValue ? columnFilterValue.toString() : ""}
      >
        <option value="">All</option>
        <option value="complicated">complicated</option>
        <option value="relationship">relationship</option>
        <option value="single">single</option>
      </select>
    );
  } else {
    return (
      <DebouncedInput
        className="w-36 border shadow rounded"
        onChange={(value) => column.setFilterValue(value)}
        placeholder="Search..."
        type="text"
        value={columnFilterValue ?? ""}
      />
    );
  }
}