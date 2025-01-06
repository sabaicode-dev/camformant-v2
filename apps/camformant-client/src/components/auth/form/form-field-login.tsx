import { FieldLoginProps } from "@/schema/login";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
export const FormFieldLogin: React.FC<FieldLoginProps> = ({
  type,
  placeholder,
  name,
  register,
  error,
  valueAsNumber,
  isIcon,
  onChangeVisible,
}) => (
  <div className="relative w-full">
    <input
      className="w-full p-3 pl-6 outline-none drop-shadow-md rounded-3xl"
      type={type}
      placeholder={placeholder}
      {...register(name, { valueAsNumber })}
    />
    {error && <span className="text-red-500">{error.message}</span>}
    {isIcon && (
      <div className="absolute top-3 right-3" onClick={onChangeVisible}>
        {type === "text" ? (
          <FaEye size={22} className="text-primaryCam" />
        ) : (
          <FaEyeSlash size={22} className="text-primaryCam" />
        )}
      </div>
    )}
  </div>
);
