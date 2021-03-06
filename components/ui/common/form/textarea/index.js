import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

export default function TextArea({ id, value = "", onChange }) {
  const onChangeContent = (value) => onChange({ target: { name: id, value } });

  return (
    <div className="sm:col-span-6">
      <label
        htmlFor="first-name"
        className="block text-sm font-medium text-gray-700"
      >
        DescripciĆ³ *
      </label>
      <div className="mt-1">
        <ReactQuill
          id={id}
          theme="snow"
          defaultValue={value}
          onChange={onChangeContent}
          className="shadow-sm block w-full sm:text-sm border-gray-300 rounded-md"
        />
      </div>
    </div>
  );
}
