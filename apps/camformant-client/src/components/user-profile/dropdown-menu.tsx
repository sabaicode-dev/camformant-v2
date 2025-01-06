const DropDownMenu: React.FC<{
  setValue: (value: string) => void;
  currentText: string;
  arrText: string[];
}> = ({ setValue, currentText, arrText }) => {
  return (
    <div className="container w-full pt-10">
      <select
        className="w-full h-16 p-5 text-black shadow-md outline-none min-w-5/6 rounded-2xl shadow-black-300 pl-7"
        value={currentText}
        onChange={(e) => setValue(e.target.value)}
      >
        {arrText.map((text: string,index:number) => (
          <option key={index} value={text}>
            {text}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropDownMenu;
