

type InputTextProp = {
    text:string
};

const InputText = ({ text }: InputTextProp) => {
    return (
        <div className="flex items-center">
            <input type="text" value={text} className="border p-2" />
        </div>
    );
};
export default InputText
