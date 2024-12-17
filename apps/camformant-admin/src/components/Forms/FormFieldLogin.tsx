import { FieldError, UseFormRegister } from "react-hook-form";
import { LoginProps, ValidFieldNames } from "@/schema/login";
import { IoEyeOffOutline, IoEyeOutline, IoMailOutline } from "react-icons/io5";
const FormFieldLogin: React.FC<{
  label:string
  type: string;
  placeholder: string;
  name: ValidFieldNames;
  register: UseFormRegister<LoginProps>;
  error: FieldError | undefined;
  valueAsNumber?: boolean;
  isClickable?: boolean;
  onChangeVisible?: () => void;
}> = ({
  label,
  type,
  placeholder,
  name,
  register,
  error,
  valueAsNumber,
  isClickable,
  onChangeVisible,
}) => {
  return (
    <div className="mb-4">
      <label className="mb-2.5 block font-medium text-black dark:text-white">
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          {...register(name, { valueAsNumber })}
          className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
        />
        {isClickable ? (
          <span className="absolute right-4 top-5" onClick={onChangeVisible}>
            {type === "text" ? (
              <IoEyeOutline size={22} className="text-primaryCam" />
            ) : (
              <IoEyeOffOutline size={22} className="text-primaryCam" />
            )}
          </span>
        ) : (
          <span className="absolute right-4 top-5">
            <IoMailOutline size={20} />
          </span>
        )}
      </div>
      {error && <span className="text-red-500">{error.message}</span>}
    </div>
  );
};

export default FormFieldLogin;
