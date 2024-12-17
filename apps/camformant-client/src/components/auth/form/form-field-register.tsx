import { FieldRegisterProps } from "@/schema/register";
import { FaEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa6";

export const FormFieldRegister: React.FC<FieldRegisterProps> = ({
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
      className={`w-full p-3 pl-6 drop-shadow-md rounded-3xl ${error ? "border border-red-500" : "outline-none"}`}
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
