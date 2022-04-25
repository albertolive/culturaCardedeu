export default function Input({ id, title, value, onChange }) {
  return (
    <div className="mt-2 relative rounded-md">
      <div className="mb-1">
        <label className="mb-2 font-bold">{title}</label>
      </div>
      <input
        value={value}
        onChange={onChange}
        type="text"
        name={id}
        id={id}
        className="w-full mb-1 shadow-sm block p-4 sm:text-sm border border-gray-200 rounded-md focus:border-yellow-500"
      />
    </div>
  );
}
