import DebouncedInput from "./DebouncedInput";

export default function Filter({ column }) {
  const columnFilterValue = column.getFilterValue();

  return (
    <DebouncedInput
      className="border shadow rounded text-[1.8vw] text-center w-full"
      onChange={(value) => column.setFilterValue(value)}
      placeholder="Search..."
      type="text"
      value={columnFilterValue ?? ""}
    />
  );
}
